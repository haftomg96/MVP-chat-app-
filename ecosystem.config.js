module.exports = {
  apps: [
    {
      name: 'chat-app',
      script: 'server.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 9080,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 9080,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 9080,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:username/chat-app.git',
      path: '/var/www/chat-app',
      'post-deploy':
        'npm install && npm run build && npx prisma migrate deploy && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'mkdir -p /var/www/chat-app',
    },
    staging: {
      user: 'deploy',
      host: 'staging-server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:username/chat-app.git',
      path: '/var/www/chat-app-staging',
      'post-deploy':
        'npm install && npm run build && npx prisma migrate deploy && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': 'mkdir -p /var/www/chat-app-staging',
    },
  },
}
