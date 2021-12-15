import { getRoutePlanApi } from "./../../api/user";

export default {
  state: {
    MAP_API_KEY: "DCSBZ-RDRCD-MO54C-PT3VQ-NRP6J-T7BOJ",
    defaultStartPos: { lat: "31.025633", lng: "121.437096" },
    map: null,
    newPlan: {
      // points: { pl, startPos, endPos }
      source: "",
      destination: "",
      points: {},
      reservationList: [],
    },
    queuePlan: [],
    activePlan: {},
    historyPlan: [],
  },
  getters: {},
  mutations: {
    setMap(state, map) {
      state.map = map;
    },
    setRoutePoint(state, points) {
      state.newPlan.points = points;
    },
    addReservation(state, newReservation) {
      state.newPlan.reservationList.push(newReservation);
      console.log(state.newPlan.reservationList);
    },
    addNewPlan(state) {
      console.log(JSON.stringify(state.newPlan));
      state.queuePlan.push(state.newPlan);
      state.newPlan = {
        points: {},
        reservationList: [],
      };
    },
    setSource(state, source) {
      state.newPlan.source = source;
    },
    setDestination(state, destination) {
      state.newPlan.destination = destination;
    },
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
