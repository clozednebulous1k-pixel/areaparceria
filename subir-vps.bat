@echo off
REM ========================================================
REM Script Windows para Compilar e Subir para a VPS
REM IP VPS: 187.77.254.212
REM ========================================================

echo ========================================================
echo 1. Gerando build de producao otimizada...
echo ========================================================
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao compilar o projeto! Verifique os erros acima.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo 2. Enviando arquivos compilados para a VPS (187.77.254.212)...
echo ========================================================
echo Digite a senha da sua VPS quando solicitado:
scp -r dist/* root@187.77.254.212:/var/www/area-site/dist/

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [DICA] Se o diretorio remoto ainda nao existir, rode antes o script deploy-vps.sh na VPS
    echo ou envie o projeto completo via:
    echo scp deploy-vps.sh root@187.77.254.212:/root/
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo [SUCESSO] Build publicada na VPS!
echo Acesse no navegador: http://187.77.254.212/
echo ========================================================
pause
