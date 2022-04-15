import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Category extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Category'
  // Define default properties here
  static instanceDefaults () {
    return {
      name: 'New category',
      typeId: 2,
      color: 'blue darken-3'
    }
  }
}
const servicePath = '/sapi/categories'
const servicePlugin = makeServicePlugin({
  Model: Category,
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
