// Application hooks that run for every service
const loggerHook = require('./hooks/logger.hook')
const prepareErrorHook = require('./hooks/prepareError.hook')
const errorHook = require('./hooks/error.hook')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [loggerHook],
    update: [loggerHook],
    patch: [loggerHook],
    remove: [loggerHook]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [prepareErrorHook, errorHook],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
