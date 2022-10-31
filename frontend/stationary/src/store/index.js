import Vue from 'vue'
import Vuex from 'vuex'
import { FeathersVuex } from '../feathers-client'

import baseMutations from '@store/base/mutations'
import baseGetters from '@store/base/getters'
import baseActions from '@store/base/actions'

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
    utilities
  },
  plugins: [...servicePlugins]
})
