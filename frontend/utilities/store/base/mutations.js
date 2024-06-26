const fetchName = (state) => {
  state.name = window.localStorage.getItem('waiterName')
}

const setName = (state, payload) => {
  window.localStorage.setItem('waiterName', payload)
  state.name = payload
}

const setTitle = (state, payload) => {
  state.title = payload
}

const setTableId = (state, payload) => {
  state.tableId = payload
}

const setCategoryVisibilityState = (state, payload) => {
  let tmp = [...state.activeCategories]
  tmp[payload.id] = payload.active
  state.activeCategories = tmp
}

export default {
  fetchName,
  setName,
  setTitle,
  setTableId,
  setCategoryVisibilityState
}
