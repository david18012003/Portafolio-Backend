@echo off
setlocal enabledelayedexpansion

:: Configurar Git (opcional si ya está hecho)
git config --global user.name "david18012003"
git config --global user.email "bravocarmen264@gmail.com"

echo ===============================
echo 📝 Iniciando commit automático...
echo ===============================

:: Añadir archivos
git add .
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al hacer git add.
    exit /b
)

:: Crear mensaje con fecha y hora
for /f %%i in ('powershell -command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set fecha=%%i

:: Hacer commit
git commit -m "Actualizacion automatica: %fecha% - %date% - %time% backend"
IF %ERRORLEVEL% EQU 0 (
    echo ✅ Commit realizado con éxito: %fecha%
) ELSE (
    echo ⚠️ No hubo cambios para hacer commit o hubo un error.
)

:: Hacer push
git push origin main
IF %ERRORLEVEL% EQU 0 (
    echo ✅ Push enviado correctamente al repositorio.
) ELSE (
    echo ❌ Error al hacer push. Verifica tu conexión o autenticación.
)

pause
