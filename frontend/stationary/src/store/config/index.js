import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    name: '',
    quickMode: false,
    configMode: { value: false },
    denseMode: { value: false },
    displayedItems: [],
    displayFormat: 's i, f', // size item-name, flavour, overwritten by init-action
    layout: null // set to null initially to check whether it is initialized ([]) or not initialized (null)
  },
  actions,
  getters,
  mutations
}