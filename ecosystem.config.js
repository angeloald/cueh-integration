// make sure you fill this in

module.exports = {
  apps: [
    {
      name: "cu-eh-integration",
      script: "./index.js",
      autorestart: true,
      watch: true,
      max_memory_restart: "1G",
      node_args: "-r dotenv/config",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8000,
      },
    },
  ],
};
