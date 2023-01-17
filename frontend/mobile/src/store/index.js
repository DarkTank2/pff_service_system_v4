import Vue from 'vue'
import Vuex from 'vuex'
import { FeathersVuex } from '../feathers-client'


import cashMethods from './cash'

import waiter from '@store/waiter'
import base from '@store/base'
import utilities from '@store/utilities'

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

const cash = {
  namespaced: true,
  state: {
    selectedOrderedItems: []
  },
  ...cashMethods
}

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    base,
    waiter,
    utilities,
    cash
  },
  plugins: [...servicePlugins]
})
