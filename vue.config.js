const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const VueLoaderPlugin = require('vue-loader/lib/plugin');


module.exports = {
  publicPath: '/',
   // eslint-loader 是否在保存的时候检查
   lintOnSave: false,
    // 生产环境 sourceMap
   productionSourceMap: false,
   configureWebpack: (config)=>{ // 去除console
    if(process.env.NODE_ENV === 'production'){
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  pwa: {
    iconPaths: {
      favicon32     : 'favicon.ico',
      favicon16     : 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon      : 'favicon.ico',
      msTileImage   : 'favicon.ico'
    },
   
  },
  // devServer: {
  //   // 项目运行时候的端口号
  //   port: 6060
  // }
}

