module.exports = {
  apps: [
    {
      name: "lorem314.io-v30",
      script: "pnpm start --port 3314",

      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      env: {
        NODE_ENV: "production",
      },
    },
  ],
}
