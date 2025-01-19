module.exports = {
  apps: [
    {
      name: 'server:api',
      script: 'server/index.js',
      watch: true,
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'server:cache:listener',
      script: 'cache/index.js',
      watch: true,
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    },
  ]
};
