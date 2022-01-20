const addOrderedItem = (state, payload) => {
  state.order.push(payload)
}

const removeIndexedOrderedItem = (state, index) => {
  state.order = state.order.filter((item, i) => i !== index)
}

const clearOrder = state => {
  state.order = []
}

export default {
  addOrderedItem,
  removeIndexedOrderedItem,
  clearOrder
}
