export default {
  namespaced: true,
  state: {
    hostory: [],
    detail: null
  },
  getters: {
    history: state => {
      if (state.history) {
        return state.history
      }
    },
    detail: state => {
      if (state.detail) {
        return state.detail
      }
    },
  },
  mutations: {
    setHistory (state, history) {
      state.history = history
    },
    setDetail (state, detail) {
      state.detail = detail
    }
  }
}