$LogFile    = Join-Path $PSScriptRoot "backups\auto-backup.log"
$BackupDir  = Join-Path $PSScriptRoot "backups"
$BaseUrl    = $env:BACKEND_URL
if ([string]::IsNullOrWhiteSpace($BaseUrl)) { $BaseUrl = "http://localhost:3050" }
$Endpoint   = "$BaseUrl/api/backup"
$HealthUrl  = "$BaseUrl/api/health"
$Stamp      = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$KeepCount  = if ($env:BACKUP_KEEP_COUNT) { [int]$env:BACKUP_KEEP_COUNT } else { 7 }
$SystemUser = if ($env:SYSTEM_USER) { $env:SYSTEM_USER } else { "admin" }
$SystemPass = if ($env:SYSTEM_PASS) { $env:SYSTEM_PASS } else { "151297" }

New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null

$basicToken = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("${SystemUser}:${SystemPass}"))
$headers = @{ Authorization = "Basic $basicToken" }

try {
    Invoke-WebRequest -Uri $HealthUrl -Method GET -TimeoutSec 10 -ErrorAction Stop | Out-Null
    $result = Invoke-RestMethod -Uri $Endpoint -Method POST -Headers $headers -TimeoutSec 30 -ErrorAction Stop
    $line   = "[$Stamp] OK  file=$($result.file)"

    # Cleanup: keep only latest $KeepCount .sqlite files
    $allSqlite = Get-ChildItem -Path $BackupDir -Filter "*.sqlite" |
                 Sort-Object LastWriteTime -Descending
    $toDelete  = $allSqlite | Select-Object -Skip $KeepCount
    foreach ($f in $toDelete) {
        Remove-Item $f.FullName -Force
        Add-Content -Path $LogFile -Value "[$Stamp] DEL $($f.Name)" -Encoding UTF8
    }
} catch {
    $line   = "[$Stamp] ERR $($_.Exception.Message)"
}

Add-Content -Path $LogFile -Value $line -Encoding UTF8
Write-Output $line
