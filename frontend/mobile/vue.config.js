const path = require('path')
module.exports = {
  transpileDependencies: [
    'vuetify',
    'feathers-vuex'
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@store': path.resolve('../utilities/store'),
        '@config': path.resolve('../utilities/config'),
        '@components': path.resolve('../utilities/components'),
        '@': path.resolve('./src/components')
      },
      extensions: ['.js', '.vue', '.json']
    }
  }
}
