module.exports = {
  apps: [
    {
      name: "bms-api",
      script: "./dist/server.js",
      instances: 4, // Allocates exactly 4 CPU cores
      exec_mode: "cluster", // Enables Node.js cluster mode
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
