export default {
    namespaced: true,
    state: {
      hostory: [],
      detail: null,
      form: null
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
      form: state => {
        if (state.form) {
          return state.form
        }
      }
    },
    mutations: {
      setHistory (state, history) {
        state.history = history
      },
      setDetail (state, detail) {
        state.detail = detail
      },
      setForm (state, form) {
        state.form = form
      }
    }
  }