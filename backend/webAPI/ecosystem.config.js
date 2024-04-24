require('dotenv').config();

module.exports = {
    apps: [
      {
        name: 'webapi',
        script: 'dist/index.js', // Compiled JavaScript file
        watch: true,
        ignore_watch: ['node_modules','uploads','*.csv','dist'],
        max_restarts: 10, // Maximum restarts within 60 seconds
        restart_delay: 1000, // Delay between restarts in milliseconds (1 second)
        instances: '1',
        exec_mode: 'cluster',
        autorestart: true,
        env: {
          NODE_ENV: 'production',
          OPENAPI_SPEC: process.env.OPENAPI_SPEC,
          PORT: process.env.PORT || 80,
          DATABASE_URL: process.env.DATABASE_URL,
          AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
          AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME,
          JWT_SECRET: process.env.JWT_SECRET,
          SESSION_SECRET: process.env.SESSION_SECRET,
          NOVU_API_KEY: process.env.NOVU_API_KEY,
          NOVU_IDENTIFIER: process.env.NOVU_IDENTIFIER,
          SITE_DOMAIN: process.env.SITE_DOMAIN,
        }
      },
    ],
  };
  