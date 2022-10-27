import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import axios from 'axios'
// import io from 'socket.io-client'
// import socketio from '@feathersjs/socketio-client'
import { iff, discard } from 'feathers-hooks-common'
import feathersVuex from 'feathers-vuex'

// const socket = io(`${window.location.origin}`, { transports: ['websocket'], upgrade: false, path: '/sws' })
// const socket = io(`localhost:9090`, { transports: ['websocket'], upgrade: false, path: '/sws' })
// const apiUrl = process.env.API_URL
// console.log(window.location.hostname)
// let restClient = rest(`http://localhost:9090`)
let restClient = rest(`${window.location.origin}`)
const transport = restClient.axios(axios)

const feathersClient = feathers()
  .configure(transport)
  // .configure(socketio(socket))
  .hooks({
    before: {
      all: [
        iff(
          context => ['create', 'update', 'patch'].includes(context.method),
          discard('__id', '__isTemp')
        ),
        iff(
          context => ['create', 'update', 'patch'].includes(context.method),
          discard('createdAt', 'updatedAt')
        )
      ]
    }
  })

// feathersClient.io.on('connect', () => {
//   // eslint-disable-next-line no-console
//   console.log('Successfully connected to backend')
// })
// feathersClient.io.on('disconnect', () => {
//   // eslint-disable-next-line no-console
//   console.log('Disconnected from backend, trying to reconnect...')
//   feathersClient.io.open()
// })
  

export default feathersClient

// Setting up feathers-vuex
const { makeServicePlugin, BaseModel, models, FeathersVuex } = feathersVuex(
  feathersClient,
  {
    idField: 'id' // Must match the id field in your database table/collection
  }
)

export { makeServicePlugin, BaseModel, models, FeathersVuex }
