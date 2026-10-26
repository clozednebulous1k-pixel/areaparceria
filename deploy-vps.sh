#!/bin/bash
# ========================================================
# Script de Deploy e Configuração Automática na VPS
# IP VPS: 187.77.254.212
# Aplicação: AREA Material Elétrico - CRM & WhatsApp Suporte
# ========================================================

set -e

echo "========================================================"
echo "🚀 Iniciando configuração do CRM AREA na VPS (187.77.254.212)..."
echo "========================================================"

# 1. Atualizar pacotes do sistema
sudo apt-get update -y
sudo apt-get install -y curl git nginx ufw

# 2. Instalar Node.js LTS (v20) se não estiver instalado
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Criar diretório da aplicação
APP_DIR="/var/www/area-site"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

echo "📂 Diretório da aplicação: $APP_DIR"

# 4. Configurar Nginx para servir o site SPA (React Router) e porta 80
NGINX_CONF="/etc/nginx/sites-available/area-site"

sudo bash -c "cat > $NGINX_CONF" << 'EOF'
server {
    listen 80;
    server_name 187.77.254.212;

    root /var/www/area-site/dist;
    index index.html;

    # Suporte para rotas do React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de arquivos estáticos (CSS, JS, Imagens)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# Habilitar site no Nginx e reiniciar
sudo ln -sf /etc/nginx/sites-available/area-site /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# 5. Configurar Firewall (UFW)
sudo ufw allow 'Nginx Full'
sudo ufw allow 22/tcp

echo "========================================================"
echo "✅ Nginx configurado com sucesso em http://187.77.254.212/"
echo "========================================================"
echo "Para subir a nova versão gerada do seu computador:"
echo "1) No seu terminal do computador, rode:"
echo "   scp -r dist/* root@187.77.254.212:/var/www/area-site/dist/"
echo "   (ou scp -r * root@187.77.254.212:/var/www/area-site/)"
echo "========================================================"
