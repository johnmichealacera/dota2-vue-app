const { defineConfig } = require('@vue/cli-service');

const backendUrl = (
  process.env.VUE_APP_DOTA_BACKEND_API || 'https://dota2-api-rust.onrender.com'
).replace(/\/$/, '');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
});
