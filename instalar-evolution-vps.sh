#!/bin/bash
# ========================================================
# Script para Instalar e Subir SOMENTE a Evolution API (WhatsApp)
# VPS: 187.77.254.212
# ========================================================

set -e

echo "========================================================"
echo "🚀 Instalando Docker e Evolution API na VPS..."
echo "========================================================"

# 1. Atualizar pacotes
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release ufw

# 2. Instalar Docker se não existir
if ! command -v docker &> /dev/null; then
    echo "📦 Instalando Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# 3. Instalar Docker Compose plugin se não existir
if ! docker compose version &> /dev/null; then
    echo "📦 Instalando Docker Compose Plugin..."
    apt-get install -y docker-compose-plugin
fi

# 4. Criar diretório exclusivo da Evolution API
mkdir -p /root/evolution-api
cd /root/evolution-api

# 5. Criar o docker-compose.yml oficial da Evolution API
cat << 'EOF' > docker-compose.yml
version: '3.8'

services:
  evolution-api:
    image: atendai/evolution-api:v2.2.2
    container_name: evolution_api
    restart: always
    ports:
      - "8080:8080"
    environment:
      - SERVER_TYPE=http
      - SERVER_PORT=8080
      - SERVER_URL=http://187.77.254.212:8080
      - CORS_ORIGIN=*
      - CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
      - CORS_CREDENTIALS=true

      # Chave de segurança para sua API
      - AUTHENTICATION_API_KEY=AreaEletricaSecKey2026!

      # Persistência das sessões do WhatsApp
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=local
      - DATABASE_SAVE_DATA_INSTANCE=true
      - DATABASE_SAVE_DATA_NEW_MESSAGE=true

      # Detalhes da sessão
      - CONFIG_SESSION_PHONE_CLIENT=AREA Material Eletrico
      - CONFIG_SESSION_PHONE_NAME=Chrome
      - QRCODE_LIMIT=30
    volumes:
      - evolution_instances:/evolution/instances

volumes:
  evolution_instances:
EOF

# 6. Liberar porta 8080 no Firewall
ufw allow 8080/tcp
ufw allow 22/tcp
ufw --force enable

# 7. Subir o container
echo "🔄 Baixando e iniciando Evolution API..."
docker compose down || true
docker compose pull
docker compose up -d

echo "========================================================"
echo "✅ Evolution API rodando com sucesso!"
echo "📍 URL da API: http://187.77.254.212:8080"
echo "🔑 API Key: AreaEletricaSecKey2026!"
echo "========================================================"
docker ps
