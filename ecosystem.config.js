module.exports = {
  apps: [{
    name: 'echo-chat',
    script: 'serve',
    env: {
      PM2_SERVE_PATH: './build',
      PM2_SERVE_PORT: 3000,
      PM2_SERVE_SPA: 'true',
      NODE_ENV: 'production',
    },
    watch: true,
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    max_memory_restart: '1G',
  }]
};
