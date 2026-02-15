module.exports = {
  apps: [{
    name: 'stp-arche-bot',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production'
    },
    // Log ayarları
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    merge_logs: true,
    // Crash durumunda tekrar başlatma
    restart_delay: 5000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
