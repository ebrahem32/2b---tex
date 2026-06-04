$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$LogsDir = Join-Path $ProjectRoot "logs"
$NodeExe = Join-Path $ProjectRoot "whatsapp-service\runtime\node-v20.11.1-win-x64\node.exe"
$BackendDir = Join-Path $ProjectRoot "backend"
$BackendServer = Join-Path $BackendDir "server.js"
$FrontendServer = Join-Path $ProjectRoot "server.js"
$CloudflaredExe = Join-Path $ProjectRoot "cloudflared.exe"
$DuckDnsUpdater = Join-Path $ProjectRoot "duckdns-update.ps1"

$BackendLog = Join-Path $LogsDir "backend.log"
$FrontendLog = Join-Path $LogsDir "frontend.log"
$CloudflaredLog = Join-Path $LogsDir "cloudflared.log"
$DuckDnsLog = Join-Path $LogsDir "duckdns.log"

New-Item -ItemType Directory -Path $LogsDir -Force | Out-Null

function Write-Log {
  param([string]$Path, [string]$Message)
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -LiteralPath $Path -Encoding UTF8 -Value "[$stamp] $Message"
}

function Test-Port {
  param([int]$Port)
  return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

function Start-CloudflareTunnel {
  if (-not (Test-Path $CloudflaredExe)) {
    Write-Log $CloudflaredLog "cloudflared.exe not found: $CloudflaredExe"
    return
  }
  Write-Log $CloudflaredLog "Starting cloudflared tunnel to http://localhost:3000"
  Start-Process -FilePath $CloudflaredExe -ArgumentList @("tunnel", "--url", "http://localhost:3000") -WorkingDirectory $ProjectRoot -WindowStyle Hidden -RedirectStandardOutput $CloudflaredLog -RedirectStandardError (Join-Path $LogsDir "cloudflared.err.log")
}

function Get-SystemCredentialValue {
  param([string]$Name)
  $value = [Environment]::GetEnvironmentVariable($Name, "Process")
  if ([string]::IsNullOrWhiteSpace($value)) { $value = [Environment]::GetEnvironmentVariable($Name, "User") }
  if ([string]::IsNullOrWhiteSpace($value)) { $value = [Environment]::GetEnvironmentVariable($Name, "Machine") }
  return $value
}

if (-not (Test-Path $NodeExe)) {
  Write-Log $BackendLog "Node runtime not found: $NodeExe"
  Write-Log $FrontendLog "Node runtime not found: $NodeExe"
  exit 1
}

if (-not (Test-Port 3050)) {
  if (Test-Path $BackendServer) {
    Write-Log $BackendLog "Starting backend on port 3050"
    Start-Process -FilePath $NodeExe -ArgumentList "server.js" -WorkingDirectory $BackendDir -WindowStyle Hidden -RedirectStandardOutput $BackendLog -RedirectStandardError (Join-Path $LogsDir "backend.err.log")
  } else {
    Write-Log $BackendLog "Backend server file not found: $BackendServer"
  }
} else {
  Write-Log $BackendLog "Backend already running on port 3050"
}

$SystemUser = Get-SystemCredentialValue "SYSTEM_USER"
$SystemPass = Get-SystemCredentialValue "SYSTEM_PASS"

if ([string]::IsNullOrWhiteSpace($SystemUser) -or [string]::IsNullOrWhiteSpace($SystemPass)) {
  Write-Log $FrontendLog "SYSTEM_USER or SYSTEM_PASS is missing. Frontend/proxy was not started."
} elseif (-not (Test-Port 3000)) {
  Write-Log $FrontendLog "Starting frontend/proxy on port 3000"
  Start-Process -FilePath $NodeExe -ArgumentList "server.js" -WorkingDirectory $ProjectRoot -WindowStyle Hidden -RedirectStandardOutput $FrontendLog -RedirectStandardError (Join-Path $LogsDir "frontend.err.log")
} else {
  Write-Log $FrontendLog "Frontend/proxy already running on port 3000"
}

if (Test-Path $DuckDnsUpdater) {
  Write-Log $DuckDnsLog "Running DuckDNS update"
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $DuckDnsUpdater | Out-Null
} else {
  Write-Log $DuckDnsLog "DuckDNS updater not found: $DuckDnsUpdater"
}

$CloudflaredRunning = [bool](Get-Process cloudflared -ErrorAction SilentlyContinue)
if (-not $CloudflaredRunning) {
  Start-CloudflareTunnel
} else {
  Write-Log $CloudflaredLog "cloudflared is already running"
}

while ($true) {
  Start-Sleep -Seconds 60
  if (-not (Get-Process cloudflared -ErrorAction SilentlyContinue)) {
    Write-Log $CloudflaredLog "cloudflared stopped; restarting"
    Start-CloudflareTunnel
  }
}
