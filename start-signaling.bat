@echo off
echo Starting LanguageHelp Signaling Server...
echo.
cd /d "%~dp0"
node server/signaling.js
pause
