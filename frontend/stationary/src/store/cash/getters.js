const list = state => state.selectedOrderedItems
const get = state => id => state.selectedOrderedItems.find(({ id: orderedItemId }) => orderedItemId === id) || null

export default {
  list,
  get
}