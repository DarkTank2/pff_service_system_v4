const { BaseItems } = require('./base-items.class')
const createModel = require('../../models/base-items.model')
const hooks = require('./base-items.hooks')
const logger = require('../../logger')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }
  
  // Initialize our service with any options it requires
  app.use('/sapi/base-items', new BaseItems(options, app))
  
  // Get our initialized service so that we can register hooks
  const service = app.service('sapi/base-items')
  
  service.hooks(hooks)

  logger.info(`Service "sapi/base-items" online`)
}