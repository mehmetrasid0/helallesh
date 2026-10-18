@echo off
for /f "tokens=*" %%a in ('powershell -Command "(Get-NetIPAddress -InterfaceAlias 'Wi-Fi' -AddressFamily IPv4 -ErrorAction SilentlyContinue).IPAddress | Select-Object -First 1"') do set CURRENT_IP=%%a
if "%CURRENT_IP%"=="" set CURRENT_IP=localhost
echo [Helallesh] Binding to Wi-Fi IP: %CURRENT_IP%
set REACT_NATIVE_PACKAGER_HOSTNAME=%CURRENT_IP%
npx expo start --host lan
