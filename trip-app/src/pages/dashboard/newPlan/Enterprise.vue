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
    <a-card v-if="activeMarker !== null" hoverable style="width: 100%">
      <img slot="cover" :src="activeMarker.img" />
      <detail-list :title="activeMarker.username" :col="1">
        <detail-list-item term="酒店名称">{{
          activeMarker.username
        }}</detail-list-item>
        <detail-list-item term="联系电话">{{
          activeMarker.phone
        }}</detail-list-item>
        <detail-list-item term="地址">{{
          activeMarker.address
        }}</detail-list-item>
        <detail-list-item term="房间状态">{{
          activeMarker.status
        }}</detail-list-item>
        <detail-list-item>
          <a @click="handleRecordDetail(activeMarker)">
            <a-icon type="link" />查看房間信息
          </a>
        </detail-list-item>
      </detail-list>
    </a-card>
    <a-table
      v-if="newPlan.reservationList.length !== 0"
      :columns="columns"
      :data-source="newPlan.reservationList"
    >
      <a slot="name" slot-scope="text">{{ text }}</a>
    </a-table>
    <br />
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
import { mapMutations, mapState } from "vuex";
import { drawRoute } from "@/utils/map";

import DetailList from "../../../components/tool/DetailList";

const DetailListItem = DetailList.Item;

const columns = [
  {
    title: "酒店名称",
    dataIndex: "storename",
    key: "storename",
  },
  {
    title: "计划入住时间",
    dataIndex: "ordertime",
    key: "ordertime",
  },
  {
    title: "房型",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "预约人",
    dataIndex: "name",
    key: "name",
  },
];

const imgPaths = [
  "/static/img/abstract01.jpg",
  "/static/img/abstract02.jpg",
  "/static/img/abstract03.jpg",
  "/static/img/abstract04.jpg",
];

export default {
  name: "Enterprise",
  components: { PageLayout, DetailListItem, DetailList },
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
      activeMarker: null,
      markerList: [],
      columns,
    };
  },
  computed: {
    ...mapState("account", { currUser: "user" }),
    ...mapState("setting", ["lang"]),
    ...mapState({
      defaultStartPos: (state) => state.user.defaultStartPos,
      newPlan: (state) => state.user.newPlan,
    }),
  },
  methods: {
    ...mapMutations("order", ["setDetail"]),
    ...mapMutations(["addNewPlan"]),
    nextStep() {
      let _this = this;
      _this.loading = true;
      this.addNewPlan()
      setTimeout(function () {
        _this.$emit("nextStep");
      }, 1500);
    },
    prevStep() {
      this.$emit("prevStep");
    },
    handleRecordDetail(activeMarker) {
      this.setDetail(activeMarker);
      this.$router.push({
        path: "/enterprise/detail",
      });
    },
  },
  created() {},
  async mounted() {
    let center = new window.TMap.LatLng(
      (this.newPlan.points.startPos.lat + this.newPlan.points.endPos.lat) / 2,
      (this.newPlan.points.startPos.lng + this.newPlan.points.endPos.lng) / 2
    );
    this.map = new window.TMap.Map("container2", {
      rotation: 20, //设置地图旋转角度
      pitch: 0, //设置俯仰角度（0~45）
      zoom: 14, //设置地图缩放级别
      center: center, //设置地图中心点坐标
    });

    let infoWindowList = Array(10);

    let search = new window.TMap.service.Search({ pageSize: 10 });

    let infoMarkers = new window.TMap.MultiMarker({
      map: this.map,
      geometries: [],
    });

    let { marker } = drawRoute(this.newPlan.points, this.map);
    marker.on("click", (evt) => {
      //   console.log(evt.geometry);
      this.markerList = [];
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
          radius: 100,
        })
        .then((result) => {
          //   console.log(result);
          result.data.forEach((item, index) => {
            this.markerList.push({
              key: index + 1,
              username: item.title,
              starttime:
                "2021-" +
                (Math.floor(Math.random() * 11) + 1) +
                "-" +
                (Math.floor(Math.random() * 27) + 1),
              phone: item.tel,
              address: item.address,
              status: "有空房",
              img: imgPaths[index % 4],
            });
            var geometries = infoMarkers.getGeometries();
            var infoWindow = new window.TMap.InfoWindow({
              map: this.map,
              position: item.location,
              content: `<h3>${item.title}</h3><p>地址：${item.address}</p><p>电话：${item.tel}</p><p></p>`,
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
              this.activeMarker = this.markerList[Number(e.geometry.id)];
            }); // 点击标注显示信息窗体
          });
        });
      // console.log(this.markerList);
    });
  },
  watch: {},
};
</script>

<style lang="less">
@import "index";
</style>
