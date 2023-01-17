import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    fetchPendingFlag: false,
    notification: null
  },
  actions,
  getters,
  mutations
}