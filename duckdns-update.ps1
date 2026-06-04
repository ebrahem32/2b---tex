$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Logs = Join-Path $Root "logs"
New-Item -ItemType Directory -Force -Path $Logs | Out-Null
$LogFile = Join-Path $Logs "duckdns.log"

function Write-Log {
  param([string]$Message)
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  "[$stamp] $Message" | Add-Content -Path $LogFile -Encoding UTF8
}

function Get-EnvValue {
  param([string]$Name)
  $value = [Environment]::GetEnvironmentVariable($Name, "Process")
  if ([string]::IsNullOrWhiteSpace($value)) { $value = [Environment]::GetEnvironmentVariable($Name, "User") }
  if ([string]::IsNullOrWhiteSpace($value)) { $value = [Environment]::GetEnvironmentVariable($Name, "Machine") }
  return $value
}

$Domain = Get-EnvValue "DUCKDNS_DOMAIN"
$Token = Get-EnvValue "DUCKDNS_TOKEN"

if ([string]::IsNullOrWhiteSpace($Domain)) { $Domain = "2btex" }
$Domain = $Domain -replace "\.duckdns\.org$", ""

if ([string]::IsNullOrWhiteSpace($Token)) {
  Write-Log "DUCKDNS_TOKEN is missing. DuckDNS update skipped."
  exit 1
}

$Url = 'https://www.duckdns.org/update?domains=' + [uri]::EscapeDataString($Domain) + '&token=' + [uri]::EscapeDataString($Token) + '&ip='

try {
  $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 20
  $Content = [string]$Response.Content
  Write-Log ("DuckDNS update for {0}.duckdns.org => {1}" -f $Domain, $Content)
  if ($Content.Trim() -ne "OK") { exit 2 }
} catch {
  Write-Log ("DuckDNS update failed: {0}" -f $_.Exception.Message)
  exit 3
}
