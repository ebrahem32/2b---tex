$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = 3000
$Url = "http://127.0.0.1:$Port/"
$LogsDir = Join-Path $ProjectRoot "logs"
$LogFile = Join-Path $LogsDir "desktop-launcher.log"
$NodeExe = (Get-Command node -ErrorAction Stop).Source

New-Item -ItemType Directory -Path $LogsDir -Force | Out-Null

function Write-LauncherLog {
  param([string]$Message)
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -LiteralPath $LogFile -Encoding UTF8 -Value "[$stamp] $Message"
}

function Test-LocalPort {
  param([int]$LocalPort)
  return [bool](Get-NetTCPConnection -LocalPort $LocalPort -State Listen -ErrorAction SilentlyContinue)
}

try {
  if (-not (Test-LocalPort $Port)) {
    Write-LauncherLog "Starting 2B Tex from $ProjectRoot"
    Start-Process -FilePath $NodeExe -ArgumentList @("start.js") -WorkingDirectory $ProjectRoot -WindowStyle Hidden
    Start-Sleep -Seconds 6
  } else {
    Write-LauncherLog "2B Tex already listening on port $Port"
  }

  Start-Process $Url
  Write-LauncherLog "Opened $Url"
} catch {
  Write-LauncherLog "Launcher failed: $($_.Exception.Message)"
  Add-Type -AssemblyName PresentationFramework
  [System.Windows.MessageBox]::Show("2B Tex could not start. Check logs\desktop-launcher.log", "2B Tex") | Out-Null
}
