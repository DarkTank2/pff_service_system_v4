const sum = state => {
  let sum = 0
  state.selection.forEach(({ item, extensions, selected }) => {
    const { price } = item
    let tmp = price * selected
    extensions.forEach(({ priceModifier }) => {
      tmp *= priceModifier
    })
    sum += tmp
  })
  return Math.round(sum * 100) / 100
}

export default {
  sum
}
