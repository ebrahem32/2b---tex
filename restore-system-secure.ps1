param(
  [Parameter(Mandatory=$true)]
  [string]$BackupFile,
  [string]$RestoreDir = "D:\2B-Tex-Restore"
)

$ErrorActionPreference = "Stop"
$backupPass = [Environment]::GetEnvironmentVariable("BACKUP_PASS", "Process")
if ([string]::IsNullOrWhiteSpace($backupPass)) {
  $backupPass = [Environment]::GetEnvironmentVariable("BACKUP_PASS", "User")
}
if ([string]::IsNullOrWhiteSpace($backupPass)) {
  Write-Host "BACKUP_PASS is missing. Use the same backup password." -ForegroundColor Red
  exit 1
}
if (-not (Test-Path $BackupFile)) {
  Write-Host "Backup file not found." -ForegroundColor Red
  exit 1
}

$bytes = [IO.File]::ReadAllBytes($BackupFile)
$header = [Text.Encoding]::ASCII.GetString($bytes, 0, 9)
if ($header -ne "2BTEXENC1") {
  Write-Host "Unknown backup file format." -ForegroundColor Red
  exit 1
}

$salt = $bytes[9..24]
$iv = $bytes[25..40]
$cipher = $bytes[41..($bytes.Length - 1)]
$kdf = [Security.Cryptography.Rfc2898DeriveBytes]::new($backupPass, [byte[]]$salt, 200000, [Security.Cryptography.HashAlgorithmName]::SHA256)
$key = $kdf.GetBytes(32)
$aes = [Security.Cryptography.Aes]::Create()
$aes.KeySize = 256
$aes.Key = $key
$aes.IV = [byte[]]$iv
$decryptor = $aes.CreateDecryptor()
$plain = $decryptor.TransformFinalBlock([byte[]]$cipher, 0, $cipher.Length)

New-Item -ItemType Directory -Path $RestoreDir -Force | Out-Null
$zipPath = Join-Path $RestoreDir "2btex-restore.zip"
[IO.File]::WriteAllBytes($zipPath, $plain)
Expand-Archive -Path $zipPath -DestinationPath $RestoreDir -Force
Remove-Item $zipPath -Force

Write-Host "Backup restored to:" -ForegroundColor Green
Write-Host $RestoreDir
