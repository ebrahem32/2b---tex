@echo off
chcp 65001 >nul
cd /d "%~dp0backend"
echo تشغيل قاعدة بيانات 2B Tex
echo.
where node >nul 2>nul
if errorlevel 1 (
  if exist "%~dp0whatsapp-service\runtime\node-v20.11.1-win-x64\node.exe" (
    set "NODE_EXE=%~dp0whatsapp-service\runtime\node-v20.11.1-win-x64\node.exe"
    set "NPM_EXE=%~dp0whatsapp-service\runtime\node-v20.11.1-win-x64\npm.cmd"
  ) else (
    echo Node.js غير موجود. ثبت Node.js أو شغل Runtime المحمول إن وجد.
    pause
    exit /b 1
  )
) else (
  set "NODE_EXE=node"
  set "NPM_EXE=npm"
)
if not exist node_modules (
  echo تثبيت ملفات backend لأول مرة...
  "%NPM_EXE%" install
  if errorlevel 1 (
    echo فشل تثبيت ملفات backend.
    pause
    exit /b 1
  )
)
echo الرابط:
echo http://localhost:3050/api/health
echo.
"%NODE_EXE%" server.js
pause
