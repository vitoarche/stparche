#!/bin/bash
# STP&ARCHE Bot - VPS Deploy Script (Ubuntu/Debian)
set -e

echo "=== STP&ARCHE Bot Deploy ==="

# 1. Sistem güncellemeleri
echo "[1/6] Sistem güncelleniyor..."
sudo apt update && sudo apt upgrade -y

# 2. Node.js 20 LTS kur (yoksa)
if ! command -v node &> /dev/null; then
    echo "[2/6] Node.js kuruluyor..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "[2/6] Node.js zaten kurulu: $(node -v)"
fi

# 3. yt-dlp kur
echo "[3/6] yt-dlp kuruluyor..."
sudo apt install -y python3 python3-pip ffmpeg
sudo pip3 install -U yt-dlp 2>/dev/null || pip3 install -U yt-dlp --break-system-packages

# 4. PM2 kur (yoksa)
if ! command -v pm2 &> /dev/null; then
    echo "[4/6] PM2 kuruluyor..."
    sudo npm install -g pm2
    pm2 startup
else
    echo "[4/6] PM2 zaten kurulu"
fi

# 5. Build tools (better-sqlite3 için gerekli)
echo "[5/6] Build tools kuruluyor..."
sudo apt install -y build-essential python3

# 6. Proje bağımlılıkları
echo "[6/6] npm install ve build..."
npm install --production=false
npm run build

# Log dizini oluştur
mkdir -p logs

echo ""
echo "=== Deploy tamamlandı! ==="
echo ""
echo "Sonraki adımlar:"
echo "  1. .env dosyanı oluştur:  cp .env.example .env && nano .env"
echo "  2. Komutları deploy et:   npx ts-node src/deploy.ts"
echo "  3. Botu başlat:           pm2 start ecosystem.config.js"
echo "  4. Logları izle:          pm2 logs stp-arche-bot"
echo "  5. PM2'yi kaydet:         pm2 save"
echo ""
