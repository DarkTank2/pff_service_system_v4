import feathersClient, { makeServicePlugin, BaseModel } from '@feathers-client'

class Table extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Table'
  // Define default properties here
  static instanceDefaults () {
    return {
      name: 'New table'
    }
  }
}
const servicePath = '/sapi/tables'
const servicePlugin = makeServicePlugin({
  Model: Table,
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
