import Vue from 'vue'
import Vuex from 'vuex'
import { FeathersVuex } from '../feathers-client'

import waiterMethods from './waiter'

import cashMethods from './cash'

import base from '@store/base'
import utilities from '@store/untilities'

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

const waiter = {
  namespaced: true,
  state: {
    order: []
  },
  ...waiterMethods
}

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
