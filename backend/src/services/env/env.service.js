const { ENV } = require('./env.class')
const hooks = require('./env.hooks')
const logger = require('../../logger')

module.exports = function (app) {
  const options = {}

  // Initialize our service with any options it requires
  app.use('/sapi/env', new ENV(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('sapi/env')

  service.hooks(hooks)

  logger.info(`Service "sapi/env" online`)
}