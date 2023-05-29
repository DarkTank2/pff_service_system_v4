
const name = state => {
    return state.name
}
const quickMode = state => {
  return state.quickMode
}
const immediateOrderMode = state => {
  return state.immediateOrderMode
}
const configMode = state => {
  return state.configMode
}
const denseMode = state => {
  return state.denseMode
}
const displayedItems = state => {
  return state.displayedItems
}
const displayFormat = state => {
  return state.displayFormat
}
const layout = state => {
  return state.layout
}

const formatItem = state => {
  return ({ baseItemName, sizeName, flavourName }) => {
    let format = state.displayFormat
    format = format.replace('s', '$1')
      .replace('i', '$2')
      .replace('f', '$3')
    return format.replace('$1', sizeName).replace('$2', baseItemName).replace('$3', flavourName)
  }
}

export default {
  name,
  quickMode,
  immediateOrderMode,
  configMode,
  denseMode,
  displayedItems,
  displayFormat,
  formatItem,
  layout
}