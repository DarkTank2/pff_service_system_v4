const { Flavours } = require('./flavours.class')
const createModel = require('../../models/flavours.model')
const hooks = require('./flavours.hooks')
const logger = require('../../logger')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }
  
  // Initialize our service with any options it requires
  app.use('/sapi/flavours', new Flavours(options, app))
  
  // Get our initialized service so that we can register hooks
  const service = app.service('sapi/flavours')
  
  service.hooks(hooks)

  logger.info(`Service "sapi/flavours" online`)
}