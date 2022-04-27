const increment = (state, payload) => {
  let item = state.selectedOrderedItems.find(({ id }) => id === payload.id)
  let { id, quantity, cashed } = payload
  if (!item) {
    item = { id, quantity, cashed, cashable: quantity - cashed, toBeCashed: 0 }
    state.selectedOrderedItems.push(item)
  }
  item.toBeCashed += 1
  if (item.toBeCashed > item.cashable) {
    item.toBeCashed = item.cashable
  }
}

const decrement = (state, payload) => {
  let item = state.selectedOrderedItems.find(({ id }) => id === payload.id)
  if (item) {
    item.toBeCashed -= 1
    if (item.toBeCashed <= 0) {
      state.selectedOrderedItems = state.selectedOrderedItems.filter(({ id }) => id !== item.id)
    }
  }
}

const clear = state => state.selectedOrderedItems = []

export default {
  increment,
  decrement,
  clear
}