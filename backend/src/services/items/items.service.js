const { Items } = require('./items.class')
const createModel = require('../../models/items.model')
const hooks = require('./items.hooks')
const logger = require('../../logger')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }
  
  // Initialize our service with any options it requires
  app.use('/sapi/items', new Items(options, app))
  
  // Get our initialized service so that we can register hooks
  const service = app.service('sapi/items')
  
  service.hooks(hooks)

  logger.info(`Service "sapi/items" online`)
}