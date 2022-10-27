import Vue from 'vue'
import Vuex from 'vuex'
import { FeathersVuex } from '@config/feathers-client'
import baseMutations from '@store/base/mutations'
import baseGetters from '@store/base/getters'
import baseActions from '@store/base/actions'

import waiterGetters from './waiter/getters'
import waiterActions from './waiter/actions'
import waiterMutations from './waiter/mutations'

import cashMethods from './cash'

import utilityMethods from '@store/untilities'

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

const base = {
  namespaced: true,
  state: {
    name: '',
    title: '',
    tableId: null
  },
  mutations: baseMutations,
  getters: baseGetters,
  actions: baseActions
}

const waiter = {
  namespaced: true,
  state: {
    order: []
  },
  mutations: waiterMutations,
  getters: waiterGetters,
  actions: waiterActions
}

const cash = {
  namespaced: true,
  state: {
    selectedOrderedItems: []
  },
  ...cashMethods
}

const utilities = {
  namespaced: true,
  state: {
    fetchPendingFlag: false,
    notification: null
  },
  ...utilityMethods
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
