const updateSelection = ({ dispatch, state }, prop) => {
  return new Promise((resolve, reject) => {
    let promises = []
    state.selection.forEach(OI => {
      OI[prop] = (OI[prop] + OI.selected) > OI.quantity ? OI.quantity : OI[prop] + OI.selected
      promises.push(dispatch('ordered-items/update', [OI.id, JSON.parse(JSON.stringify(OI)), {}], { root: true }))
      OI.selected = 0
    })
    Promise.all(promises).then((data) => {
      state.selection = []
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}

export default {
  updateSelection
}
