const addOrderedItem = (state, payload) => {
  let item = state.order.find(orderedItem => {
    let sameComment = orderedItem.comment === payload.comment
    let sameItemId = orderedItem.itemId === payload.itemId
    let sameAdditions = orderedItem.additions.length === payload.additions.length
    // TODO: compare content of additions, as of right now, there is no item with additions to buy
    return sameComment && sameItemId && sameAdditions
  })
  if (item) {
    item.quantity += payload.quantity
  } else {
    state.order.push(payload)
  }
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
