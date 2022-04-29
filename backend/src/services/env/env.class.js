const { Service } = require('feathers-sequelize')
const env = require('../../env.json')
const fs = require('fs')
const path = require('path')

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
      console.log('Updating env...')
      console.log(data)
      this.env = data
      fs.writeFileSync(path.join(process.cwd(), 'src', 'env.json'), JSON.stringify(data))
      return Promise.resolve(data)
  }
  async patch(id, data, params) {
      console.log('Patching env...')
      console.log(data)
      this.env = data
      fs.writeFileSync(path.join(process.cwd(), 'src', 'env.json'), JSON.stringify(data))
      return Promise.resolve(data)
  }
  async remove(id, params) {}
  setup(app, path) {
      this.app = app
  }
}