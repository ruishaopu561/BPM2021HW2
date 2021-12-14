import { getRoutePlanApi }from './../../api/user'

export default {
  state: {
    MAP_API_KEY: "DCSBZ-RDRCD-MO54C-PT3VQ-NRP6J-T7BOJ",
    defaultStartPos: {lat: "31.025633" , lng: "121.437096"}
  },
  getters: {},
  mutations: {},
  actions: {
      async getRoutePlanAction ({state}, {startPos, endPos}) {
        if (startPos === null) 
            startPos = state.defaultStartPos
        console.log(startPos, endPos)
        let res = await getRoutePlanApi(startPos, endPos, state.MAP_API_KEY)
        return res.data
      }
  }
};
