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

export default {
  fetchName,
  setName,
  setTitle,
  setTableId
}
