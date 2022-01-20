const { BaseItemsHaveAdditions } = require('./base-items-have-additions.class')
const createModel = require('../../models/base-items-have-additions.model')
const hooks = require('./base-items-have-additions.hooks')
const logger = require('../../logger')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }
  
  // Initialize our service with any options it requires
  app.use('/sapi/base-items-have-additions', new BaseItemsHaveAdditions(options, app))
  
  // Get our initialized service so that we can register hooks
  const service = app.service('sapi/base-items-have-additions')
  
  service.hooks(hooks)

  logger.info(`Service "sapi/base-items-have-additions" online`)
}