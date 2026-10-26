#!/bin/bash
# ========================================================
# Script de Diagnóstico e Auditoria de Portas e Containers
# VPS: 187.77.254.212
# MODO SEGURO: Apenas LEITURA, não altera nem para nada!
# ========================================================

echo "========================================================"
echo "🔍 DIAGNÓSTICO DO SERVIDOR VPS (187.77.254.212)"
echo "========================================================"
echo ""

# 1. Verificar se o Docker está rodando e quais containers estão ativos
echo "📦 1. CONTAINERS DOCKER EM EXECUÇÃO:"
echo "--------------------------------------------------------"
if command -v docker &> /dev/null; then
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "📦 TODOS OS CONTAINERS (INCLUSIVE PARADOS):"
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
else
    echo "⚠️ Docker não encontrado ou não está instalado."
fi
echo ""

# 2. Verificar se já existe Evolution API rodando
echo "💬 2. BUSCANDO POR INSTÂNCIAS DA EVOLUTION API OU WHATSAPP:"
echo "--------------------------------------------------------"
if command -v docker &> /dev/null; then
    EVO_FOUND=$(docker ps -a | grep -i -E "evolution|whatsapp|baileys|wpp" || true)
    if [ -n "$EVO_FOUND" ]; then
        echo "🚨 ATENÇÃO: Encontrado container(s) relacionado(s) a WhatsApp/Evolution:"
        echo "$EVO_FOUND"
    else
        echo "✅ Nenhuma Evolution API detectada no Docker."
    fi
fi
echo ""

# 3. Portas TCP atualmente abertas e em uso no sistema
echo "🔌 3. PORTAS TCP ATIVAS NO SISTEMA (netstat / ss):"
echo "--------------------------------------------------------"
if command -v ss &> /dev/null; then
    ss -tulpn | grep LISTEN
elif command -v netstat &> /dev/null; then
    netstat -tulpn | grep LISTEN
fi
echo ""

# 4. Checagem específica das portas mais usadas por APIs
echo "🎯 4. VERIFICAÇÃO ESPECÍFICA DE PORTAS COMUNS:"
echo "--------------------------------------------------------"
for PORT in 80 443 3000 3333 8080 8081 8082 8085 9000 5432 6379; do
    EM_USO=$(ss -tulpn | grep ":$PORT " || true)
    if [ -n "$EM_USO" ]; then
        echo "🔴 Porta $PORT: [EM USO] -> $EM_USO"
    else
        echo "🟢 Porta $PORT: [LIVRE]"
    fi
done

echo ""
echo "========================================================"
echo "✅ Diagnóstico concluído! Copie a saída e me envie aqui."
echo "========================================================"
