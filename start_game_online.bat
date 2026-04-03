@echo off
setlocal

cd /d "%~dp0"

if not exist "multiplayer_server.py" (
  echo Fehler: multiplayer_server.py wurde in diesem Ordner nicht gefunden.
  pause
  exit /b 1
)

where py >nul 2>nul
if %errorlevel%==0 (
  set "PY_CMD=py -3"
) else (
  set "PY_CMD=python"
)

start "MAGDNUMBER Server" cmd /k %PY_CMD% multiplayer_server.py
timeout /t 2 >nul
start "MAGDNUMBER Tunnel" cmd /k npx --yes localtunnel --port 8080 --subdomain alaxl-magdnumber-game26

echo.
echo Gestartet.
echo Link fuer Handy:
echo Nimm die URL aus dem Tunnel-Fenster (Zeile: "your url is: ...")
echo und haenge /online.html an.
echo Beispiel: https://DEINE-URL.loca.lt/online.html
echo.
echo Wenn 503 oder 502 erscheint: Tunnel-Fenster schliessen und diese Datei erneut starten.
echo.
pause
