@echo off
:: Configuración de Git
git config --global user.name "david18012003"
git config --global user.email "bravocarmen264@gmail.com"

:: Añadir todos los archivos
git add .

:: Crear mensaje de commit con fecha y hora
for /f %%i in ('powershell -command "Get-Date -Format yyyy-MM-dd_HH:mm:ss"') do set fecha=%%i
git commit -m "Actualizacion automatica: %fecha%"

:: Hacer push
git push origin main
