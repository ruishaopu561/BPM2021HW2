<template>
  <page-layout :avatar="currUser.avatar">
    <div class="components-input-demo-presuffix">
      <a-row type="flex" justify="space-around" align="middle">
        <a-col :span="10">
          <a-input
            size="large"
            v-model="source.name"
            placeholder="请输入起始点"
            @focus.native="inputFocus = 'source'"
            @blur.native="inputFocus = ''"
          />
        </a-col>
        <a-col :span="10">
          <a-input
            size="large"
            v-model="destination.name"
            placeholder="请输入目的地"
            @focus.native="inputFocus = 'destination'"
            @blur.native="inputFocus = ''"
          />
        </a-col>
        <a-col :span="1">
          <a-button
            type="primary"
            shape="circle"
            icon="search"
            @click="onSearch"
          />
        </a-col>
      </a-row>
      <!-- <a-input ref="userNameInput"  >
        <a-tooltip slot="suffix" title="Extra information">
          <a-icon type="info-circle" style="color: rgba(0, 0, 0, 0.45)" />
        </a-tooltip>
      </a-input> -->
    </div>
    <br />
    <!-- // FIXME: 地图div会和展开的navigation重叠，导致用不了navigation -->
    <div id="container"></div>
    <!-- <div>
      POI:
      <span>{{
        curPoi.name + "(" + curPoi.latLng.lat + "," + curPoi.latLng.lng + ")"
      }}</span>
    </div> -->
    <a-row type="flex" justify="space-around" align="middle">
      <a-col>
        <a-button type="primary" @click="nextStep">{{
          $t("nextStep")
        }}</a-button>
      </a-col>
    </a-row>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import { mapActions, mapMutations, mapState } from "vuex";
import { request, METHOD } from "@/utils/request";
import { routePlanToPolygon, drawRoute } from "@/utils/map";

export default {
  name: "Map",
  components: { PageLayout },
  i18n: require("./i18n"),
  data() {
    return {
      loading: true,
      activities: [],
      source: "",
      destination: "",
      map: null,
      curPoi: {
        name: "",
        latLng: {
          lat: null,
          lng: null,
        },
      },
      inputFocus: "",
      activeGraph: null,
    };
  },
  computed: {
    ...mapState("account", { currUser: "user" }),
    ...mapState("setting", ["lang"]),
    ...mapState({
      defaultStartPos: (state) => state.user.defaultStartPos,
    }),
  },
  methods: {
    ...mapMutations([
      "setMap",
      "setRoutePoint",
      "setSource",
      "setDestination",
      "setRealRoutePoint",
      "setDurationAndFeeAndDistance",
      "setRealRouteDurationAndFeeAndDistance",
    ]),
    ...mapActions(["getRoutePlanAction", "getRealRoutePlanAction"]),
    // async onSearch() {
    //   if (this.activeGraph) {
    //     // .setGeometries([])
    //     this.activeGraph.marker.setMap(null);
    //     this.activeGraph.polylineLayer.setMap(null);
    //     this.activeGraph = null;
    //   }
    //   let source = this.source.latLng;
    //   let destination = this.destination.latLng;
    //   let route = { startPos: source, endPos: destination };
    //   let ret = await this.getRoutePlanAction(route);

    //   let pl = routePlanToPolygon(ret.result.routes[0].polyline);

    //   let { marker, polylineLayer } = drawRoute(
    //     { pl, startPos: route.startPos, endPos: route.endPos, index: 0 },
    //     this.map
    //   );
    //   this.activeGraph = { marker, polylineLayer };
    //   this.setSource(this.source.name);
    //   this.setDestination(this.destination.name);
    //   this.setRoutePoint({ pl, startPos: source, endPos: destination });
    // },
    async onSearch() {
      if (this.activeGraph) {
        // .setGeometries([])
        this.activeGraph.marker.setMap(null);
        this.activeGraph.polylineLayer.setMap(null);
        this.activeGraph = null;
      }
      let source = this.source.latLng;
      let destination = this.destination.latLng;
      let route = { startPos: source, endPos: destination };
      let ret = await this.getRealRoutePlanAction(route);

      console.log(`Number of Route: ${ret.result.routes.length}`)

      let durations = ret.result.routes.map((r) => r.duration);
      let minDurationIndex = durations.indexOf(Math.min(...durations));
      let maxDurationIndex = durations.indexOf(Math.max(...durations));

      let pl = routePlanToPolygon(ret.result.routes[maxDurationIndex].polyline);
      let { marker, polylineLayer } = drawRoute(
        { pl, startPos: route.startPos, endPos: route.endPos, index: 0 },
        this.map
      );
      this.activeGraph = { marker, polylineLayer };
      this.setSource(this.source.name);
      this.setDestination(this.destination.name);
      this.setRoutePoint({ pl, startPos: source, endPos: destination });
      this.setDurationAndFeeAndDistance({
        duration: ret.result.routes[maxDurationIndex].duration,
        fee: ret.result.routes[maxDurationIndex].taxi_fare,
        distance: ret.result.routes[maxDurationIndex].distance,
      });

      console.log(minDurationIndex, maxDurationIndex)

      // TODO: minDuration = -infinite ?
      if (maxDurationIndex !== minDurationIndex) {
        let pl = routePlanToPolygon(
          ret.result.routes[minDurationIndex].polyline
        );
        // this.activeGraph = { marker, polylineLayer };
        this.setRealRoutePoint({ pl, startPos: source, endPos: destination });
        // TODO:
        this.setRealRouteDurationAndFeeAndDistance({
          duration: ret.result.routes[minDurationIndex].duration,
          fee: ret.result.routes[minDurationIndex].taxi_fare,
          distance: ret.result.routes[minDurationIndex].distance,
        });
      }
    },
    nextStep() {
      this.$emit("nextStep");
    },
  },
  created() {
    request("/user/welcome", METHOD.GET).then(
      (res) => (this.welcome = res.data)
    );
    request("/work/activity", METHOD.GET).then(
      (res) => (this.activities = res.data)
    );
  },
  mounted() {
    let center = new window.TMap.LatLng(31.025633, 121.437096);
    this.map = new window.TMap.Map("container", {
      rotation: 20, //设置地图旋转角度
      pitch: 0, //设置俯仰角度（0~45）
      zoom: 14, //设置地图缩放级别
      center: center, //设置地图中心点坐标
    });

    // 创建信息窗
    // let info = new window.TMap.InfoWindow({
    //   map: this.map,
    //   position: this.map.getCenter(),
    // }).close();
    this.map.on("click", (evt) => {
      // 获取click事件返回的poi信息
      let poi = evt.poi;
      if (poi) {
        // 拾取到POI
        // info.setContent(poi.name).setPosition(poi.latLng).open();
        this.curPoi = poi;
        if (this.inputFocus === "source") {
          console.log("source");
          this.source = poi;
        } else if (this.inputFocus === "destination") {
          console.log("destination");
          this.destination = poi;
        }
      } else {
        // 没有拾取到POI
        // info.close();
      }
    });
    this.setMap(this.map);
  },
  watch: {
    inputFocus(value) {},
  },
};
</script>

<style lang="less">
@import "index";
</style>
