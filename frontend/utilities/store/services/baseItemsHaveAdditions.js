import feathersClient, { makeServicePlugin, BaseModel } from '@feathers-client'

class BaseItemHasAddition extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'BaseItemHasAddition'
  // Define default properties here
  static instanceDefaults () {
    return {
      baseItemId: 0,
      additionId: 0
    }
  }
}
const servicePath = '/sapi/base-items-have-additions'
const servicePlugin = makeServicePlugin({
  Model: BaseItemHasAddition,
  service: feathersClient.service(servicePath),
  servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
})

export default servicePlugin
