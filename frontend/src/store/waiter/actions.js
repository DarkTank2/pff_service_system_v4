const finalizeOrder = ({ dispatch, commit, getters }) => {
  return new Promise((resolve, reject) => {
    let promises = []
    getters.order.forEach(OI => {
      promises.push(dispatch('ordered-items/create', OI, { root: true }))
    })
    Promise.all(promises).then(result => {
      commit('clearOrder')
      resolve(result)
    }).catch(err => reject(err))
  })
}

export default {
  finalizeOrder
}
