<template>
  <page-layout :avatar="currUser.avatar">
    <div class="components-input-demo-presuffix"></div>
    <br />
    <!-- // FIXME: 地图div会和展开的navigation重叠，导致用不了navigation -->
    <div id="container2"></div>
    <div>
      POI:
      <span>{{
        curPoi.name + "(" + curPoi.latLng.lat + "," + curPoi.latLng.lng + ")"
      }}</span>
    </div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col>
        <a-button :loading="loading" type="primary" @click="nextStep">{{
          $t("submit")
        }}</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">{{
          $t("preStep")
        }}</a-button>
      </a-col>
    </a-row>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import { mapActions, mapMutations, mapState } from "vuex";
import { drawRoute } from "@/utils/map";

export default {
  name: "Enterprise",
  components: { PageLayout },
  i18n: require("./i18n"),
  data() {
    return {
      curPoi: {
        name: "",
        latLng: {
          lat: null,
          lng: null,
        },
      },
      activeGraph: null,
      loading: false,
      map: null,
    };
  },
  computed: {
    ...mapState("account", { currUser: "user" }),
    ...mapState("setting", ["lang"]),
    ...mapState({
      defaultStartPos: (state) => state.user.defaultStartPos,
      points: (state) => state.user.points,
    }),
  },
  methods: {
    nextStep() {
      let _this = this;
      _this.loading = true;
      setTimeout(function () {
        _this.$emit("nextStep");
      }, 1500);
    },
    prevStep() {
      this.$emit("prevStep");
    },
  },
  created() {},
  mounted() {
    let center = new window.TMap.LatLng(
      this.points.endPos.lat,
      this.points.endPos.lng
    );
    this.map = new window.TMap.Map("container2", {
      rotation: 20, //设置地图旋转角度
      pitch: 0, //设置俯仰角度（0~45）
      zoom: 14, //设置地图缩放级别
      center: center, //设置地图中心点坐标
    });

    let infoWindowList = Array(10);

    let { marker } = drawRoute(this.points, this.map);
    marker.on("click", (evt) => {
        console.log(evt.geometry);
      infoWindowList.forEach((infoWindow) => {
        infoWindow.close();
      });
      infoWindowList.length = 0;
      infoMarkers.setGeometries([]);

      // 在地图显示范围内以给定的关键字搜索地点
      search
        .searchNearby({
          //   keyword: document.getElementById("keyword").value,
          keyword: "酒店",
          center: evt.geometry.position,
          //   bounds: this.map.getBounds(),
          radius: 100
        })
        .then((result) => {
            console.log(result)
          result.data.forEach((item, index) => {
            var geometries = infoMarkers.getGeometries();
            var infoWindow = new window.TMap.InfoWindow({
              map: this.map,
              position: item.location,
              content: `<h3>${item.title}</h3><p>地址：${item.address}</p><p>电话：${item.tel}</p>`,
              offset: { x: 0, y: -50 },
            }); // 新增信息窗体显示地标的名称与地址、电话等信息
            infoWindow.close();
            infoWindowList[index] = infoWindow;
            geometries.push({
              id: String(index), // 点标注数据数组
              position: item.location,
            });
            infoMarkers.updateGeometries(geometries); // 绘制地点标注
            infoMarkers.on("click", (e) => {
              infoWindowList[Number(e.geometry.id)].open();
            }); // 点击标注显示信息窗体
          });
        });
    });

    let search = new window.TMap.service.Search({ pageSize: 10 });

    let infoMarkers = new window.TMap.MultiMarker({
      map: this.map,
      geometries: [],
    });
  },
  watch: {},
};
</script>

<style lang="less">
@import "index";
</style>
