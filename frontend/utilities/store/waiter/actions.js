const finalizeOrder = ({ dispatch, commit, getters, rootGetters }) => {
  return new Promise((resolve, reject) => {
    let data = getters.order.map(OI => {
      let { waiter, tableId } = OI
      if (!waiter) {
        waiter = rootGetters['config/name']
      }
      if (!waiter) {
        throw new Error('No name provided!')
      }
      if (!tableId) {
        tableId = 1
      }
      return { ...OI, waiter, tableId }
    })
    dispatch('utilities/setFetchPendingFlag', null, { root: true }).then(() => {
      dispatch('ordered-items/create', [data], { root: true }).then(result => {
        dispatch('utilities/resetFetchPendingFlag', null, { root: true })
        commit('clearOrder')
        dispatch('utilities/setNotification', { message: 'Abgesendet', timeout: 3000, type: 'success' }, { root: true })
        resolve(result)
      }).catch(err => {
        dispatch('utilities/resetFetchPendingFlag', null, { root: true })
        dispatch('utilities/setNotification', { message: `Fehler beim absenden der Items: ${err.message}`, timeout: -1, type: 'error' }, { root: true })
        reject(err)
      })
    })
  })
}

const quickCash = ({ dispatch, commit, getters, rootGetters }) => {
  return new Promise((resolve, reject) => {
    let tableId = 1
    let waiter = rootGetters['config/name']
    let data = getters.order.map(orderedItem => {
      return {
        ...orderedItem,
        cashed: orderedItem.quantity,
        finished: true,
        waiter,
        tableId
      }
    })
    if (data.length === 0) return
    dispatch('utilities/setFetchPendingFlag', null, { root: true }).then(() => {
      dispatch('ordered-items/create', [data], { root: true }).then((res) => {
        let additions = []
        data.forEach((item) => {
          let i = res.findIndex(orderedItem => {
            return orderedItem.itemId === item.itemId
              && orderedItem.quantity === item.quantity
              && orderedItem.comment === item.comment
          })
          if (item.additions.length > 0) {
            // perform addition adding for searched ordered item
            let { id: orderedItemId } = res.at(i)
            item.additions.forEach(addition => {
              additions.push({ orderedItemId, additionId: addition.id || addition, amount: 1 })
            })
          }
          res[i] = {} // remove ordered item, so that the same item can not be found anymore
        })
        if (additions.length > 0) {
          dispatch('ordered-items-have-additions/create', [additions], { root: true }).then(() => {
            dispatch('utilities/resetFetchPendingFlag', null, { root: true })
            commit('clearOrder')
            dispatch('utilities/setNotification', { message: 'Abgesendet', timeout: 3000, type: 'success' }, { root: true })
            resolve(res)
          }).catch(err => {
            dispatch('utilities/resetFetchPendingFlag', null, { root: true })
            dispatch('utilities/setNotification', { message: `Fehler beim absenden der Erweiterungen: ${err.message}`, timeout: -1, type: 'error' }, { root: true })
            reject()
          })
        } else {
          dispatch('utilities/resetFetchPendingFlag', null, { root: true })
          commit('clearOrder')
          dispatch('utilities/setNotification', { message: 'Abgesendet', timeout: 3000, type: 'success' }, { root: true })
          resolve(res)
        }
      }).catch(err => {
        dispatch('utilities/resetFetchPendingFlag', null, { root: true })
        dispatch('utilities/setNotification', { message: `Fehler beim absenden der Items: ${err.message}`, timeout: -1, type: 'error' }, { root: true })
        reject()
      })
    })
  })
}

export default {
  finalizeOrder,
  quickCash
}
