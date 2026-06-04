@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PORTABLE_NODE=%~dp0whatsapp-service\runtime\node-v20.11.1-win-x64\node.exe"

echo تشغيل نظام 2B Tex على الشبكة...
echo.

where node >nul 2>nul
if %errorlevel%==0 (
  node server.js
) else if exist "%PORTABLE_NODE%" (
  "%PORTABLE_NODE%" server.js
) else (
  echo لم يتم العثور على Node.js.
  echo ثبت Node.js أو تأكد من وجود النسخة المحمولة داخل whatsapp-service\runtime.
  pause
  exit /b 1
)

pause
