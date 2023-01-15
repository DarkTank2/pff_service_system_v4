import moment from "moment"
const updateKeybindings = (state, payload = []) => {
  if (!payload) {
    return
  }
  if (!Array.isArray(payload)) {
    payload = [payload]
  }
  payload.forEach(({ key, itemId }) => {
    if (state.keybindings.find(binding => key === binding.key)) {
      state.keybindings = [...state.keybindings.filter(binding => key !== binding.key)]
    }
    state.keybindings.push({ key, itemId })
  })
  setLocalStorage(state.keybindings)
}

const removeKeybinding = (state, payload = []) => {
  if (!payload) {
    return
  }
  if (!Array.isArray(payload)) {
    payload = [payload]
  }
  payload.forEach(({ key }) => {
    if (state.keybindings.find(binding => key === binding.key)) {
      state.keybindings = [...state.keybindings.filter(binding => key !== binding.key)]
    }
  })
  setLocalStorage(state.keybindings)
}

function setLocalStorage (keybindings) {
  window.localStorage.setItem('keybindings', JSON.stringify(keybindings))
  window.localStorage.setItem('keybindingsDate', moment().format())
}

export default {
  updateKeybindings,
  removeKeybinding
}