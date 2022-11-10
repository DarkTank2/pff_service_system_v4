import Vue from 'vue'
import Vuex from 'vuex'
import { FeathersVuex } from '../feathers-client'

import base from '@store/base'
import utilities from '@store/untilities'

import subscriptions from './subscriptions'

Vue.use(Vuex)
Vue.use(FeathersVuex)

const requireModule = require.context(
  // The path where the service modules live
  '@store/services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
)
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    base,
    utilities,
    subscriptions
  },
  plugins: [...servicePlugins]
})
