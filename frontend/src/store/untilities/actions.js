
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

export default {
    setFetchPendingFlag,
    resetFetchPendingFlag
}