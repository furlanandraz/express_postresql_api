module.exports = {
  apps: [
    {
      name: 'server:api',
      script: 'server/index.js',
      watch: ['cache', 'clients', 'DAO', 'notifications', 'server'],
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'server:cache:listener',
      script: 'cache/index.js',
      watch: ['cache', 'clients', 'DAO', 'notifications', 'server'],
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    },
  ]
};
