const { Service } = require('feathers-sequelize')
const env = require('../../env.json')

exports.ENV = class ENV {
  constructor (options) {
      this.options = options || {}
      this.env = env
      this.env.id = '_env'
  }

  async find(params) {
    return [this.env];
  }
  async get(id, params) {
      return this.env
  }
  async create(data, params) {}
  async update(id, data, params) {
      // only by admin -> hook TBD
  }
  async patch(id, data, params) {}
  async remove(id, params) {}
  setup(app, path) {
      this.app = app
  }
}