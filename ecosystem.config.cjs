module.exports = {
  apps: [
    {
      name: 'api',
      script: 'index.js',
      watch: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'cache-listener',
      script: 'cache/index.js',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
