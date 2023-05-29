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
const updateImmediateOrderMode = (state, payload) => {
  if (!payload) {
    return
  }
  state.immediateOrderMode = { ...payload }
  setLocalStorage(JSON.stringify(state.immediateOrderMode), 'immediateOrderMode')
}
const updateConfigMode = (state, payload) => {
  if (!payload) {
    return
  }
  state.configMode = { ...payload }
}
const updateDenseMode = (state, payload) => {
  if (!payload) {
    return
  }
  state.denseMode = { ...payload }
  setLocalStorage(JSON.stringify(state.denseMode), 'denseMode')
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

const updateDisplayFormat = (state, payload) => {
  if (!payload) {
    return
  }
  if (typeof payload !== 'string') {
    return
  }
  state.displayFormat = payload
  setLocalStorage(state.displayFormat, 'displayFormat')
}

const updateLayout = (state, payload) => {
  if (state.layout === null) {
    state.layout = []
  }
  if (!payload) {
    return
  }
  if (!Array.isArray(payload)) {
    return
  }
  payload.forEach(gridItem => {
    let storedGridItemIndex = state.layout.findIndex(({ i }) => i === gridItem.i)
    if (storedGridItemIndex === -1) {
      state.layout = [...state.layout, gridItem]
    } else {
      state.layout = [...state.layout]
      state.layout[storedGridItemIndex] = gridItem
    }
  })
  setLocalStorage(JSON.stringify(state.layout), 'layout')
}

function setLocalStorage (data, value) {
  window.localStorage.setItem(value, data)
  window.localStorage.setItem(`${value}Date`, moment().format())
}

export default {
  updateName,
  updateQuickMode,
  updateImmediateOrderMode,
  updateConfigMode,
  updateDenseMode,
  updateDisplayedItems,
  removeDisplayedItem,
  updateDisplayFormat,
  updateLayout
}