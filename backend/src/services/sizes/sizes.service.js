const { Sizes } = require('./sizes.class')
const createModel = require('../../models/sizes.model')
const hooks = require('./sizes.hooks')
const logger = require('../../logger')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }
  
  // Initialize our service with any options it requires
  app.use('/sapi/sizes', new Sizes(options, app))
  
  // Get our initialized service so that we can register hooks
  const service = app.service('sapi/sizes')
  
  service.hooks(hooks)

  logger.info(`Service "sapi/sizes" online`)
}