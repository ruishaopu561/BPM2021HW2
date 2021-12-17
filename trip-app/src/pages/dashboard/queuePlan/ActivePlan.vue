<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="20">
        <a-alert
          v-if="alertVisible"
          message="根据实时路况，发现更快的路线"
          type="success"
          closable
          :after-close="handleClose"
        />
      </a-col>
      <a-col :span="4">
        <a-button v-if="alertVisible" @click="routeChangeBtnClick">
          路线更新
        </a-button>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="起始点"
            :value="activePlan.source"
            class="demo-class"
          >
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="目的地"
            :value="activePlan.destination"
            class="demo-class"
          >
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <div id="container4"></div>
    </a-row>
    <a-row>
      <a-table
        v-if="activePlan.reservationList.length !== 0"
        :columns="columns"
        :data-source="activePlan.reservationList"
      >
        <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
        <div slot="operation" slot-scope="text, record, index">
          <a-button
            v-if="activePlan.reservationList.length !== 0"
            @click="() => modifyBtnClick(record, index)"
          >
            修改预定信息
          </a-button>
        </div>
      </a-table>
      <a-modal
        title="修改订单"
        ok-text="确认"
        cancel-text="取消"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <OrderForm :form="activeReservation" />
      </a-modal>
    </a-row>
    <a-row>
      <a-button type="primary" block @click="tripCompleteBtnClick">
        旅程完成
      </a-button>
    </a-row>
  </div>
</template>

<script>
import { drawRoute } from "@/utils/map";
import { mapMutations, mapState } from "vuex";
import OrderForm from "../../order/create/OrderForm";

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
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  name: "ActivePlan",
  components: { OrderForm },
  data() {
    return {
      map: null,
      columns,
      visible: false,
      activeReservation: null,
      activeReservationIndex: null,
      confirmLoading: false,
      alertVisible: false,
      activeGraph: null,
    };
  },
  computed: {
    ...mapState({
      activePlan: (state) => state.user.activePlan,
    }),
  },
  methods: {
    ...mapMutations(["modifyReservation", "changeRealRoutePoints", "addHistoryPlan"]),
    modifyBtnClick(record, index) {
      this.visible = true;
      this.activeReservation = record;
      this.activeReservationIndex = index;
    },
    handleOk() {
      this.visible = false;
      this.modifyReservation({
        reservation: this.activeReservation,
        reservationIndex: this.activeReservationIndex,
      });
    },
    handleCancel() {
      this.visible = false;
    },
    tripCompleteBtnClick() {
        this.addHistoryPlan()
        this.$router.push({path: '/dashboard/historyPlan'})
    },
    handleClose() {
      this.alertVisible = false;
    },
    routeChangeBtnClick() {
      this.alertVisible = false;
      this.changeRealRoutePoints();
      if (this.activeGraph) {
        // .setGeometries([])
        this.activeGraph.marker.setMap(null);
        this.activeGraph.polylineLayer.setMap(null);
        this.activeGraph = null;
      }
      let { marker, polylineLayer } = drawRoute(
        {
          pl: this.activePlan.points.pl,
          startPos: this.activePlan.points.startPos,
          endPos: this.activePlan.points.endPos,
          index: 0,
        },
        this.map
      );
      this.activeGraph = { marker, polylineLayer };
    },
  },
  mounted() {
    let center = new window.TMap.LatLng(
      (this.activePlan.points.startPos.lat +
        this.activePlan.points.endPos.lat) /
        2,
      (this.activePlan.points.startPos.lng +
        this.activePlan.points.endPos.lng) /
        2
    );
    this.map = new window.TMap.Map("container4", {
      rotation: 20, //设置地图旋转角度
      pitch: 0, //设置俯仰角度（0~45）
      zoom: 11, //设置地图缩放级别
      center: center, //设置地图中心点坐标
    });

    let { marker, polylineLayer } = drawRoute(this.activePlan.points, this.map);
    this.activeGraph = { marker, polylineLayer };

    // 创建信息窗
    // let info = new window.TMap.InfoWindow({
    //   map: this.map,
    //   position: this.map.getCenter(),
    // }).close();
    // this.map.on("click", (evt) => {
    //   // 获取click事件返回的poi信息
    //   let poi = evt.poi;
    //   if (poi) {
    //     // 拾取到POI
    //     // info.setContent(poi.name).setPosition(poi.latLng).open();
    //     this.curPoi = poi;
    //     if (this.inputFocus === "source") {
    //       console.log("source");
    //       this.source = poi;
    //     } else if (this.inputFocus === "destination") {
    //       console.log("destination");
    //       this.destination = poi;
    //     }
    //   } else {
    //     // 没有拾取到POI
    //     // info.close();
    //   }
    // });
  },
  created() {
    this.alertVisible =
      Object.keys(this.activePlan.realRoutePoints).length === 0 ? false : true;
  },
};
</script>
