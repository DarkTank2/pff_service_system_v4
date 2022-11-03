import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    name: '',
    title: '',
    tableId: null,
    activeCategories: []
  },
  actions,
  getters,
  mutations
}