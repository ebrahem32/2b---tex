const http = require('node:http');
const { execFile } = require('node:child_process');

const PORT = Number(process.env.A5_SERVICE_PORT || 3041);
const SQL_SERVER = process.env.A5_SQL_SERVER || 'a5server';
const SQL_DATABASE = process.env.A5_SQL_DATABASE || '2B2026';

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

function runPowerShell(script) {
  const encoded = Buffer.from(script, 'utf16le').toString('base64');
  return new Promise((resolve, reject) => {
    execFile(
      'powershell.exe',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', encoded],
      { windowsHide: true, maxBuffer: 1024 * 1024 * 10, timeout: 20000 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error((stderr || error.message || '').trim()));
          return;
        }
        resolve(stdout);
      }
    );
  });
}

function sqlJsonScript(query) {
  const safeServer = SQL_SERVER.replace(/'/g, "''");
  const safeDatabase = SQL_DATABASE.replace(/'/g, "''");
  const safeQuery = query.replace(/'/g, "''");
  return `
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.Data
$cs = 'Server=${safeServer};Database=${safeDatabase};Integrated Security=True;TrustServerCertificate=True;Connection Timeout=5'
$conn = New-Object System.Data.SqlClient.SqlConnection($cs)
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = '${safeQuery}'
$cmd.CommandTimeout = 15
$adapter = New-Object System.Data.SqlClient.SqlDataAdapter($cmd)
$table = New-Object System.Data.DataTable
[void]$adapter.Fill($table)
$rows = @()
foreach ($row in $table.Rows) {
  $item = [ordered]@{}
  foreach ($col in $table.Columns) {
    $value = $row[$col.ColumnName]
    if ($value -is [System.DBNull]) { $value = $null }
    $item[$col.ColumnName] = $value
  }
  $rows += [pscustomobject]$item
}
$conn.Close()
$rows | ConvertTo-Json -Depth 5
`;
}

async function querySql(query) {
  const stdout = await runPowerShell(sqlJsonScript(query));
  const text = stdout.trim();
  if (!text) return [];
  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed : [parsed];
}

async function getCustomers() {
  return querySql(`
WITH LastCustomerAccount AS (
  SELECT
    LTRIM(RTRIM(AccBrnch_n)) AS CustomerName,
    acc_id,
    Acc_Date,
    Bfr_Bal,
    AccIn,
    AccOut,
    Aftr_Bal,
    ROW_NUMBER() OVER (PARTITION BY LTRIM(RTRIM(AccBrnch_n)) ORDER BY acc_id DESC) AS rn
  FROM acc
  WHERE LTRIM(RTRIM(accMain_n)) = N'العملاء'
),
CustomerMovement AS (
  SELECT
    LTRIM(RTRIM(AccBrnch_n)) AS CustomerName,
    SUM(ISNULL(AccIn, 0)) AS TotalDebit,
    SUM(ISNULL(AccOut, 0)) AS TotalCredit,
    COUNT(*) AS MovementCount
  FROM acc
  WHERE LTRIM(RTRIM(accMain_n)) = N'العملاء'
  GROUP BY LTRIM(RTRIM(AccBrnch_n))
)
SELECT
  c.Cust_id AS customerId,
  LTRIM(RTRIM(c.Cust_name)) AS customerName,
  c.area_name AS areaName,
  c.Cust_Phones AS phones,
  c.cust_limit AS creditLimit,
  ISNULL(m.TotalDebit, 0) AS totalDebit,
  ISNULL(m.TotalCredit, 0) AS totalCredit,
  ISNULL(m.MovementCount, 0) AS movementCount,
  la.Aftr_Bal AS balance,
  la.Acc_Date AS lastMovementDate,
  la.AccIn AS lastDebit,
  la.AccOut AS lastCredit
FROM Cust c
LEFT JOIN LastCustomerAccount la
  ON la.CustomerName = LTRIM(RTRIM(c.Cust_name)) AND la.rn = 1
LEFT JOIN CustomerMovement m
  ON m.CustomerName = LTRIM(RTRIM(c.Cust_name))
ORDER BY LTRIM(RTRIM(c.Cust_name))
`);
}

async function getCustomerLedger(customerName) {
  const safeName = String(customerName || '').trim().replace(/'/g, "''");
  if (!safeName) return [];
  return querySql(`
SELECT TOP 500
  acc_id AS movementId,
  Acc_Date AS movementDate,
  accTime AS movementTime,
  LTRIM(RTRIM(accMain_n)) AS accountMain,
  LTRIM(RTRIM(AccBrnch_n)) AS customerName,
  Bfr_Bal AS beforeBalance,
  AccIn AS debit,
  AccOut AS credit,
  Aftr_Bal AS afterBalance,
  Dscrp AS description,
  acc_Cat AS movementType,
  ord AS orderRef,
  OrdBk AS orderBookRef,
  RefAcc AS referenceAccount,
  ChkNu AS checkNumber,
  Chk_date AS checkDate
FROM acc
WHERE LTRIM(RTRIM(accMain_n)) = N'العملاء'
  AND LTRIM(RTRIM(AccBrnch_n)) = N'${safeName}'
ORDER BY acc_id DESC
`);
}

async function route(req, res) {
  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true });
    return;
  }
  const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  try {
    if (req.method === 'GET' && url.pathname === '/api/a5/status') {
      const rows = await querySql("SELECT DB_NAME() AS databaseName, @@SERVERNAME AS serverName, GETDATE() AS serverTime");
      sendJson(res, 200, { ok: true, server: SQL_SERVER, database: SQL_DATABASE, info: rows[0] || null });
      return;
    }
    if (req.method === 'GET' && url.pathname === '/api/a5/customers') {
      const customers = await getCustomers();
      sendJson(res, 200, { ok: true, server: SQL_SERVER, database: SQL_DATABASE, customers });
      return;
    }
    if (req.method === 'GET' && url.pathname === '/api/a5/customer-ledger') {
      const customerName = url.searchParams.get('customerName') || '';
      const movements = await getCustomerLedger(customerName);
      sendJson(res, 200, { ok: true, server: SQL_SERVER, database: SQL_DATABASE, customerName, movements });
      return;
    }
    sendJson(res, 404, { ok: false, message: 'المسار غير موجود' });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: 'تعذر قراءة بيانات A5', detail: error.message });
  }
}

http.createServer(route).listen(PORT, '127.0.0.1', () => {
  console.log(`A5 read-only service running on http://127.0.0.1:${PORT}`);
});
