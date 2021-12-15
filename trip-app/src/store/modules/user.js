import { getRoutePlanApi } from "./../../api/user";

export default {
  state: {
    MAP_API_KEY: "DCSBZ-RDRCD-MO54C-PT3VQ-NRP6J-T7BOJ",
    defaultStartPos: { lat: "31.025633", lng: "121.437096" },
    map: null,
    points: {},
  },
  getters: {},
  mutations: {
    setMap(state, map) {
      state.map = map;
    },
    setRoutePoint(state, points) {
        state.points = points
    }
  },
  actions: {
    async getRoutePlanAction({ state }, { startPos, endPos }) {
      if (startPos === null) startPos = state.defaultStartPos;
      console.log(
        `Route: ${JSON.stringify(startPos)} --> ${JSON.stringify(endPos)}`
      );
      let res = await getRoutePlanApi(startPos, endPos, state.MAP_API_KEY);
      return res.data;
    },
  },
};
