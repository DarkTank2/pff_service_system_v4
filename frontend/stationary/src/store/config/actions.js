const init = (attr) => {
  initName(attr)
  initQuickMode(attr)
  initDenseMode(attr)
  initDisplayedItems(attr)
  initDisplayFormat(attr)
  initLayout(attr)
}


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
const initDenseMode = ({ commit }) => {
  let savedDenseMode = window.localStorage.getItem('denseMode')
  if (savedDenseMode) {
    commit('updateDenseMode', JSON.parse(savedDenseMode))
  }
}
const initDisplayedItems = ({ commit }) => {
  let savedDisplayedItems = window.localStorage.getItem('displayedItems')
  if (savedDisplayedItems) {
    commit('updateDisplayedItems', JSON.parse(savedDisplayedItems))
  }
}
const initDisplayFormat = ({ commit }) => {
  let savedFormat = window.localStorage.getItem('displayFormat')
  if (savedFormat) {
    commit('updateDisplayFormat', savedFormat)
  } else {
    commit('updateDisplayFormat', 's i, f')
  }
}
const initLayout = ({ commit }) => {
  let savedLayout = window.localStorage.getItem('layout')
  if (savedLayout) {
    commit('updateLayout', JSON.parse(savedLayout))
  }
}

export default {
  init,
  initName,
  initQuickMode,
  initDenseMode,
  initDisplayedItems,
  initDisplayFormat,
  initLayout
}