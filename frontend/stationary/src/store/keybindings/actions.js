
const initKeybindings = ({ commit }) => {
  let savedKeybindings = window.localStorage.getItem('keybindings')
  if (savedKeybindings) {
    commit('updateKeybindings', JSON.parse(savedKeybindings))
  }
}

export default {
  initKeybindings
}