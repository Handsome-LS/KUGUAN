@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 24 or later is required. Please install it from https://nodejs.org/
  pause
  exit /b 1
)
node -e "if (Number(process.versions.node.split('.')[0]) < 24) process.exit(1)"
if errorlevel 1 (
  echo Please update Node.js to version 24 or later from https://nodejs.org/
  pause
  exit /b 1
)
echo Starting KUGUAN. Keep this window open while using the application.
node server.js
if errorlevel 1 (
  pause
  exit /b 1
)
