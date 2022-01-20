const { OrderedItems } = require('./ordered-items.class')
const createModel = require('../../models/ordered-items.model')
const hooks = require('./ordered-items.hooks')
const logger = require('../../logger')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }
  
  // Initialize our service with any options it requires
  app.use('/sapi/ordered-items', new OrderedItems(options, app))
  
  // Get our initialized service so that we can register hooks
  const service = app.service('sapi/ordered-items')
  
  service.hooks(hooks)

  logger.info(`Service "sapi/ordered-items" online`)
}