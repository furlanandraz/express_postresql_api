module.exports = {
  apps: [
    {
      name: 'app:server',
      script: 'server/index.js',
      watch: ['clients', 'DAO', 'notifications', 'server'],
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'cache:listen',
      script: 'cache/index.js',
      watch: ['cache'],
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    },
  ]
};
