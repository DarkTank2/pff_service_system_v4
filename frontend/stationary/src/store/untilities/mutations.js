
const setFetchPendingFlag = (state, payload) => {
    if (payload !== true && payload !== false) {
        // payload is not valid
        return
    }
    state.fetchPendingFlag = payload
}

const setNotification = (state, payload) => {
    if (payload === null) {
        state.notification = null
        return
    }
    if (typeof payload !== 'object') {
        return
    }
    if (!payload.message || typeof payload.message !== 'string') {
        return
    }
    state.notification = payload
}

export default {
    setFetchPendingFlag,
    setNotification
}