
const initName = ({ commit }) => {
  let savedName = window.localStorage.getItem('stationName')
  if (savedName) {
    commit('updateName', savedName)
  }
}
const initQuickMode = ({ commit }) => {
  let savedQuickMode = window.localStorage.getItem('quickMode')
  if (savedQuickMode) {
    commit('updateQuickMode', JSON.parse(savedQuickMode))
  }
}
const initDisplayedItems = ({ commit }) => {
  let savedDisplayedItems = window.localStorage.getItem('displayedItems')
  if (savedDisplayedItems) {
    commit('updateDisplayedItems', JSON.parse(savedDisplayedItems))
  }
}

export default {
  initName,
  initQuickMode,
  initDisplayedItems
}