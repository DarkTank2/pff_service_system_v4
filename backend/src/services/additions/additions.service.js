const { Additions } = require('./additions.class')
const createModel = require('../../models/additions.model')
const hooks = require('./additions.hooks')
const logger = require('../../logger')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }

  // Initialize our service with any options it requires
  app.use('/sapi/additions', new Additions(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('sapi/additions')

  service.hooks(hooks)

  logger.info(`Service "sapi/additions" online`)
}