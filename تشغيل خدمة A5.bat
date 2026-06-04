@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not exist "a5-service\server.js" (
  echo خدمة A5 غير موجودة داخل a5-service.
  pause
  exit /b 1
)

set "NODE_EXE=%~dp0whatsapp-service\runtime\node-v20.11.1-win-x64\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=node"

cd /d "%~dp0a5-service"
echo تشغيل خدمة A5 للقراءة فقط...
"%NODE_EXE%" server.js
pause
