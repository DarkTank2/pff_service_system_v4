const getName = (state) => {
  return state.name
}
const getTableId = state => {
  return state.tableId
}
const getCategoryActiveState = state => {
  return state.activeCategories
}
const firstActiveCategory = state => {
  let mostActiveCategoryId = -1
  state.activeCategories.forEach((val, i, o) => {
    if (mostActiveCategoryId === -1 && i > 0) {
      mostActiveCategoryId = i
    }
    if (i > 0 && o[i] >= o[mostActiveCategoryId]) {
      mostActiveCategoryId = i
    }
  })
  return mostActiveCategoryId
}

export default {
  getName,
  getTableId,
  getCategoryActiveState,
  firstActiveCategory
}
