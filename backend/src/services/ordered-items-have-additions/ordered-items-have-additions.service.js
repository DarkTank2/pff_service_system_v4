const { OrderedItemsHaveAdditions } = require('./ordered-items-have-additions.class')
const createModel = require('../../models/ordered-items-have-additions.model')
const hooks = require('./ordered-items-have-additions.hooks')
const logger = require('../../logger')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }
  
  // Initialize our service with any options it requires
  app.use('/sapi/ordered-items-have-additions', new OrderedItemsHaveAdditions(options, app))
  
  // Get our initialized service so that we can register hooks
  const service = app.service('sapi/ordered-items-have-additions')
  
  service.hooks(hooks)

  logger.info(`Service "sapi/ordered-items-have-additions" online`)
}