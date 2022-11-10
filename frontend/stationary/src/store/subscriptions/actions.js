
const initSubscriptions = ({ commit }) => {
  let savedSubscriptions = window.localStorage.getItem('subscriptions')
  if (savedSubscriptions) {
    commit('updateSubscription', JSON.parse(savedSubscriptions))
  }
}

export default {
  initSubscriptions
}