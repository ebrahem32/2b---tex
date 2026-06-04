$LogFile   = Join-Path $PSScriptRoot "backups\auto-backup.log"
$BackupDir = Join-Path $PSScriptRoot "backups"
$Endpoint  = "http://localhost:3050/api/backup"
$Stamp     = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$KeepCount = 7

try {
    $result = Invoke-RestMethod -Uri $Endpoint -Method POST -TimeoutSec 15 -ErrorAction Stop
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
