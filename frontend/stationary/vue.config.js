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
        '@feathers-client':  path.resolve('./src/feathers-client.js'),
        '@': path.resolve('./src/components')
      },
      extensions: ['.js', '.vue', '.json']
    }
  },
  publicPath: '/stationary/'
}
