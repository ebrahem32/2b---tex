@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not exist "ai-service\server.js" (
  echo خدمة مساعد 2B الذكي غير موجودة داخل ai-service.
  pause
  exit /b 1
)

set "NODE_EXE=%~dp0whatsapp-service\runtime\node-v20.11.1-win-x64\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=node"

cd /d "%~dp0ai-service"
echo تشغيل خدمة مساعد 2B الذكي...
"%NODE_EXE%" server.js
pause
