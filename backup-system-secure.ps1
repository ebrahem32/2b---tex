param(
  [string]$OutputDir = "D:\2B-Tex-Secure-Backups"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backupPass = [Environment]::GetEnvironmentVariable("BACKUP_PASS", "Process")
if ([string]::IsNullOrWhiteSpace($backupPass)) {
  $backupPass = [Environment]::GetEnvironmentVariable("BACKUP_PASS", "User")
}
if ([string]::IsNullOrWhiteSpace($backupPass)) {
  Write-Host "BACKUP_PASS is missing. Set it as a Windows environment variable before backup." -ForegroundColor Red
  Write-Host '$env:BACKUP_PASS="strong-backup-password"'
  exit 1
}

New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipPath = Join-Path $OutputDir "2btex-backup-$stamp.zip"
$encPath = Join-Path $OutputDir "2btex-backup-$stamp.zip.2benc"
$manifestPath = Join-Path $OutputDir "2btex-backup-$stamp.txt"
$tempDir = Join-Path $env:TEMP "2btex-backup-$stamp"

New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$git = "C:\Program Files\Git\cmd\git.exe"
if (-not (Test-Path $git)) {
  $git = "git"
}
$trackedFiles = & $git -C $projectRoot -c core.quotePath=false ls-files
if (-not $trackedFiles) {
  Write-Host "No Git tracked files found. Backup stopped." -ForegroundColor Red
  exit 1
}

foreach ($relative in $trackedFiles) {
  $source = Join-Path $projectRoot $relative
  if (-not (Test-Path $source)) { continue }
  $target = Join-Path $tempDir $relative
  New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
  Copy-Item -Path $source -Destination $target -Force
}

Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $zipPath -Force

$plain = [IO.File]::ReadAllBytes($zipPath)
$salt = New-Object byte[] 16
$iv = New-Object byte[] 16
$rng = [Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($salt)
$rng.GetBytes($iv)
$rng.Dispose()
$kdf = [Security.Cryptography.Rfc2898DeriveBytes]::new($backupPass, $salt, 200000, [Security.Cryptography.HashAlgorithmName]::SHA256)
$key = $kdf.GetBytes(32)
$aes = [Security.Cryptography.Aes]::Create()
$aes.KeySize = 256
$aes.Key = $key
$aes.IV = $iv
$encryptor = $aes.CreateEncryptor()
$cipher = $encryptor.TransformFinalBlock($plain, 0, $plain.Length)
$header = [Text.Encoding]::ASCII.GetBytes("2BTEXENC1")
[IO.File]::WriteAllBytes($encPath, $header + $salt + $iv + $cipher)

Remove-Item $zipPath -Force
Remove-Item $tempDir -Recurse -Force

@"
2B Tex encrypted backup
Created: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Project: $projectRoot
File: $encPath
Database included: backend\data\2btex.sqlite
Password source: BACKUP_PASS environment variable
"@ | Set-Content -Path $manifestPath -Encoding UTF8

Write-Host "Encrypted backup created:" -ForegroundColor Green
Write-Host $encPath
