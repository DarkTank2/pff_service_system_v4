const { Types } = require('./types.class')
const createModel = require('../../models/types.model')
const hooks = require('./types.hooks')
const logger = require('../../logger')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }
  
  // Initialize our service with any options it requires
  app.use('/sapi/types', new Types(options, app))
  
  // Get our initialized service so that we can register hooks
  const service = app.service('sapi/types')
  
  service.hooks(hooks)

  logger.info(`Service "sapi/types" online`)
}