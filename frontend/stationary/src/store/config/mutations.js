import moment from "moment"
const updateName = (state, payload = '') => {
  if (!payload) {
    return
  }
  state.name = payload
  setLocalStorage(state.name, 'stationName')
}

const updateQuickMode = (state, payload) => {
  if (!payload) {
    return
  }
  state.quickMode = { ...payload }
  setLocalStorage(JSON.stringify(state.quickMode), 'quickMode')
}

const updateDisplayedItems = (state, payload = []) => {
  if (!payload) {
    return
  }
  if (!Array.isArray(payload)) {
    payload = [payload]
  }
  payload.forEach(baseItemId => {
    if (state.displayedItems.includes(baseItemId)) {
      state.displayedItems = state.displayedItems.filter(i => i !== baseItemId)
    } else {
      state.displayedItems.push(baseItemId)
    }
  })
  setLocalStorage(JSON.stringify(state.displayedItems), 'displayedItems')
}
const removeDisplayedItem = (state, payload = []) => {
  if (!payload) {
    return
  }
  if (!Array.isArray(payload)) {
    payload = [payload]
  }
  state.displayedItems = [...new Set(state.displayedItems.filter(id => !payload.includes(id)))]
  setLocalStorage(JSON.stringify(state.displayedItems), 'displayedItems')
}

function setLocalStorage (data, value) {
  window.localStorage.setItem(value, data)
  window.localStorage.setItem(`${value}Date`, moment().format())
}

export default {
  updateName,
  updateQuickMode,
  updateDisplayedItems,
  removeDisplayedItem
}