
const setFetchPendingFlag = ({ commit }) => {
    return new Promise(resolve => {
        commit('setFetchPendingFlag', true)
        resolve()
    })
}
const resetFetchPendingFlag = ({ commit }) => {
    return new Promise(resolve => {
        commit('setFetchPendingFlag', false)
        resolve()
    })
}
const setNotification = ({ commit }, payload) => {
    console.log(payload)
    return new Promise((resolve, reject) => {
        if (!payload) {
            reject(new Error('Cannot set nothing as notification!'))
            return
        }
        commit('setNotification', { ...payload })
        resolve()
    })
}
const resetNotification = ({ commit }) => {
    return new Promise(resolve => {
        commit('setNotification', null)
        resolve()
    })
}

export default {
    setFetchPendingFlag,
    resetFetchPendingFlag,
    setNotification,
    resetNotification
}