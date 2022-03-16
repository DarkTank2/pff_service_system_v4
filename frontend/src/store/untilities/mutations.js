
const setFetchPendingFlag = (state, payload) => {
    if (payload !== true && payload !== false) {
        // payload is not valid
        return
    }
    state.fetchPendingFlag = payload
}

export default {
    setFetchPendingFlag
}