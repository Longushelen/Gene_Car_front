const webpack = require("webpack");
const path = require('path')

module.exports = {
  runtimeCompiler: true,
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/result/' : '/',
  outputDir: path.resolve(__dirname, '../webapp/result'),  
  devServer: {  
    proxy: {
      '/api' : {
        target: "http://localhost:9080",
        changeOrigin: true,
        logLevel: "debug",
      }
    },
    port: 8080,
    host: "0.0.0.0", 
  }, 
  configureWebpack: {
    devtool: "source-map",
    plugins: [
      new webpack.ProvidePlugin({
        Swiper: "swiper",
      }),
    ],
  },
}
