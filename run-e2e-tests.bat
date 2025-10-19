@echo off
REM Script para rodar testes E2E AgendaBarber

cd /d "c:\Users\victo\OneDrive\Documentos\Projetos\SaaS-Barbearia\[APP]-AgendaBarber"

echo.
echo ========================================
echo  E2E TESTS - AgendaBarber SaaS
echo ========================================
echo.

REM Aguardar dev server estar pronto
echo [1/3] Aguardando dev server ficar pronto...
timeout /t 8

REM Rodar testes
echo [2/3] Iniciando testes E2E...
call npx playwright test e2e/comprehensive.spec.ts --headed

REM Gerar relatório
echo [3/3] Gerando relatório...
call npx playwright show-report

echo.
echo ========================================
echo  Testes finalizados!
echo ========================================
