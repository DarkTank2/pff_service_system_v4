import moment from "moment"
const updateSubscription = (state, payload = []) => {
  if (!payload) {
    return
  }
  if (Array.isArray(payload)) {
    // payload is an array so add all from payload to state
    state.subscriptions = [...new Set([...state.subscriptions, ...payload])]
  } else {
    // single id to update
    if (state.subscriptions.includes(payload)) {
      // already subscribed => unsubscribe
      state.subscriptions = state.subscriptions.filter(id => id !== payload)
    } else {
      // add subscription
      state.subscriptions = [...state.subscriptions, payload]
    }
  }
  setLocalStorage(state.subscriptions)
}

const removeSubscription = (state, payload = []) => {
  if (!payload) {
    return
  }
  if (!Array.isArray(payload)) {
    payload = [payload]
  }
  state.subscriptions = [...new Set(state.subscriptions.filter(id => !payload.includes(id)))]
  setLocalStorage(state.subscriptions)
}

function setLocalStorage (subscriptions) {
  window.localStorage.setItem('subscriptions', JSON.stringify(subscriptions))
  window.localStorage.setItem('subscriptionDate', moment().format())
}

export default {
  updateSubscription,
  removeSubscription
}