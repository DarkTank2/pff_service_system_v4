const setSum = state => {
  let sum = 0
  state.selection.forEach(({ item, extensions, selected }) => {
    const { price } = item
    let tmp = price * selected
    extensions.forEach(({ priceModifier }) => {
      tmp *= priceModifier
    })
    sum += tmp
  })
  sum = Math.round(sum * 100) / 100
  state.sum = sum
  return sum
}

const addOrderedItem = (state, payload) => {
  if (state.selection.map(({ id }) => id).includes(payload.id)) return
  state.selection.push(payload)
  state.sum = setSum(state)
}

const clearOrderedItems = state => {
  state.selection.forEach(item => {
    item.selected = 0
  })
  state.selection = []
  state.sum = setSum(state)
}

export default {
  addOrderedItem,
  clearOrderedItems,
  setSum
}
