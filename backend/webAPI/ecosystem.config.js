module.exports = {
    apps: [
      {
        name: 'webapi',
        script: 'dist/index.js', // Compiled JavaScript file
        watch: true,
        ignore_watch: ['node_modules'],
        max_restarts: 10, // Maximum restarts within 60 seconds
        restart_delay: 1000, // Delay between restarts in milliseconds (1 second)
        instances: 'max',
        exec_mode: 'cluster',
        autorestart: true,
        max_memory_restart: '512M',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  