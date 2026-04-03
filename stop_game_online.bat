@echo off
setlocal

powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'multiplayer_server\.py' -or $_.CommandLine -match 'localtunnel' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }" >nul 2>nul

echo Server und Tunnel wurden beendet (falls sie liefen).
pause
