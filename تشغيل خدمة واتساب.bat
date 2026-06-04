@echo off
chcp 65001 >nul
cd /d "%~dp0whatsapp-service"

set "NODE_EXE=node"
set "NPM_CMD=npm"
set "RUNTIME_DIR=%cd%\runtime"
set "NODE_DIR=%cd%\runtime\node-v20.11.1-win-x64"
set "PORTABLE_NODE_EXE=%cd%\runtime\node-v20.11.1-win-x64\node.exe"
set "PORTABLE_NPM_CMD=%cd%\runtime\node-v20.11.1-win-x64\npm.cmd"

where npm >nul 2>nul
if errorlevel 1 (
  set "NODE_EXE=%PORTABLE_NODE_EXE%"
  set "NPM_CMD=%PORTABLE_NPM_CMD%"
  set "PATH=%NODE_DIR%;%PATH%"
  if not exist "%PORTABLE_NPM_CMD%" (
    echo Preparing portable Node.js for WhatsApp service...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $dir='%cd%\runtime'; $zip=Join-Path $dir 'node.zip'; New-Item -ItemType Directory -Force -Path $dir | Out-Null; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip' -OutFile $zip; Expand-Archive -Force -Path $zip -DestinationPath $dir; Remove-Item $zip -Force"
    if errorlevel 1 (
      echo Could not prepare Node.js automatically. Check internet connection or install Node.js LTS, then run this file again.
      pause
      exit /b 1
    )
  )
)

if not exist node_modules\express (
  echo Installing WhatsApp service dependencies...
  call "%NPM_CMD%" install
)

echo Starting 2B Tex WhatsApp service...
call "%NODE_EXE%" server.js
pause
