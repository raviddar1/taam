@echo off
cd /d "%~dp0"

:: Check if port 3000 is in use
netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel% == 0 (
  echo Next.js server already running on port 3000
) else (
  start cmd /k "npm run dev"
  timeout /t 4 /noisy >nul
)

:: Open Chrome with autoplay enabled
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist %CHROME% set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if not exist %CHROME% set CHROME=chrome

start "" %CHROME% --autoplay-policy=no-user-gesture-required --disable-features=Translate --disable-translate "http://localhost:3000"
