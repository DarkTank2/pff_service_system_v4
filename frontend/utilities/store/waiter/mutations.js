const addOrderedItem = (state, payload) => {
  state.order.push(payload)
}

const incrementAtIndex = (state, index) => {
  state.order.at(index).quantity += 1
}
const decrementAtIndex = (state, index) => {
  state.order.at(index).quantity -= 1
  if (state.order.at(index).quantity <= 0) {
    state.order = state.order.filter((item, i) => i !== index)
  }
}

const removeIndexedOrderedItem = (state, index) => {
  state.order = state.order.filter((item, i) => i !== index)
}

const clearOrder = state => {
  state.order = []
}

export default {
  addOrderedItem,
  incrementAtIndex,
  decrementAtIndex,
  removeIndexedOrderedItem,
  clearOrder
}
