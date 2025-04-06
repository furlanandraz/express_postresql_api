module.exports = {
  apps: [
    {
      name: 'app:server',
      script: 'server/index.js',
      watch: [ 'server', 'modules/clients', 'modules/DAO'],
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    /*{
      name: 'cache:listen',
      script: 'cache/index.js',
      watch: ['cache'],
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    },*/
  ]
};
