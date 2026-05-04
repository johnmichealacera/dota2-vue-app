const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://dota2-api-backend.onrender.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
})
