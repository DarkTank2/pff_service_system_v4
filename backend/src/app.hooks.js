// Application hooks that run for every service
const loggerHook = require('./hooks/logger.hook')

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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
