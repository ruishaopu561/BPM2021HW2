export default {
    namespaced: true,
    state: {
      hostory: [],
      detail: null,
      form: null,
      moneyPay: 0,
      payedId: -1
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
      },
      moneyPay: state => {
        if (state.moneyPay) {
          return state.moneyPay
        }
      },
      payedId: state => {
        if (state.payedId) {
          return state.payedId
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
      },
      setMoneyPay (state, money) {
        state.moneyPay = money
      },
      setPayedId (state, payedId) {
        state.payedId = payedId
      }
    }
  }