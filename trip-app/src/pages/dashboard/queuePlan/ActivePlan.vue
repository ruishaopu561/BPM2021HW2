<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="20">
        <a-alert
          v-if="alertVisible"
          message="根据实时路况，发现通行时间更短的路线"
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
    <!-- <a-row>
      <a-table
        v-if="activePlan.reservationList.length !== 0"
        :columns="columns"
        :data-source="activePlan.reservationList"
      div slot="operation" slot-scope="text, record, index">
          <a-button
            v-if="activePlan.reservationList.length !== 0"
            @click="() => modifyBtnClick(record, index)a-button>
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
    </a-row> -->
    <a-row>
      <a-card title="处理中订单">
        <!-- @selectedRowChange="onSelectChange" -->
        <!-- :selectedRows.sync="selectedRows" -->
        <standard-table
          :columns="columns"
          :dataSource="activePlan.reservationList"
        >
          <div slot="description" slot-scope="{ text }">
            {{ text }}
          </div>
          <div slot="action" slot-scope="{ text }">
            <a @click="payRecord(text.key)" style="margin-right: 8px">
              <a-icon type="transaction" />支付
            </a>
            <a
              @click="modifyBtnClick(text, text.key)"
              style="margin-right: 8px"
            >
              <a-icon type="edit" />修改
            </a>
            <!-- <a @click="deleteRecord(text.key)" style="margin-right: 8px">
              <a-icon type="delete" />删除
            </a> -->
            <a @click="handleRecordDetail(text.key)">
              <a-icon type="link" />详情
            </a>
          </div>
        </standard-table>
        <a-modal
          title="修改订单"
          ok-text="确认"
          cancel-text="取消"
          :visible="visible"
          :confirm-loading="confirmLoading"
          @ok="handleOk"
          @cancel="handleCancel"
        >
          <OrderForm :form="tempReservation" />
        </a-modal>
      </a-card>
    </a-row>
    <a-row>
      <a-button
        v-if="allPaid"
        type="primary"
        block
        @click="tripCompleteBtnClick"
      >
        旅程完成
      </a-button>
    </a-row>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
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
    title: "数量",
    dataIndex: "number",
  },
  {
    title: "总价(￥)",
    dataIndex: "value",
  },
  {
    title: "状态",
    dataIndex: "status",
    needTotal: true,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "ActivePlan",
  components: { OrderForm, StandardTable },
  data() {
    return {
      map: null,
      columns,
      visible: false,
      activeReservation: null,
      activeReservationKey: null,
      confirmLoading: false,
      alertVisible: false,
      activeGraph: null,
      tempReservation: null,
    };
  },
  computed: {
    ...mapState({
      activePlan: (state) => state.user.activePlan,
    }),
    allPaid() {
      for (let item of this.activePlan.reservationList) {
        if (item.status !== "已支付") {
          return false;
        }
      }
      return true;
    },
  },
  methods: {
    ...mapMutations([
      "modifyReservation",
      "changeRealRoutePoints",
      "addHistoryPlan",
      "setPlanFinish",
    ]),
    ...mapMutations("order", ["setDetail", "setMoneyPay"]),
    modifyBtnClick(text, key) {
      this.visible = true;
      this.activeReservation = text;
      this.activeReservationKey = key;
      this.tempReservation = JSON.parse(JSON.stringify(this.activeReservation));
      console.log(this.activeReservation)
    },
    async handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.confirmLoading = false;
        this.visible = false;
        this.activeReservation.status = "等待商家处理修改";
      }, 1000);
      setTimeout(() => {
        this.activeReservation.ordertime = this.tempReservation.ordertime
        this.activeReservation.status = "已修改";
        this.modifyReservation({
          reservation: this.tempReservation,
          reservationKey: this.activeReservationKey,
        });
        this.$message.success('修改状态已更新');
      }, 5000);
    },
    handleCancel() {
      this.visible = false;
    },
    tripCompleteBtnClick() {
      this.addHistoryPlan();
      this.setPlanFinish();
      this.$router.push({ path: "/dashboard/historyPlan" });
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
    payRecord(key) {
      let data = this.activePlan.reservationList.filter(
        (item) => item.key === key
      )[0];
      // console.log("data", data);
      this.setMoneyPay(data);
      this.$router.push({ path: "/order/pay" });
      setTimeout(() => {
        this.afterPay(key);
      }, 1000);
    },
    afterPay(key) {
      if (key !== -1) {
        let reservation = this.activePlan.reservationList.filter(
          (item) => item.key === key
        )[0];
        reservation.status = "已支付";
        this.modifyReservation({
          reservation: this.activeReservation,
          reservationKey: this.activeReservationKey,
        });
        // this.dataSource = this.dataSource.filter((item) => item.key !== key);
        // if (data) {
        //   data.status = "已结束";
        //   this.historyDataSource.push(data);
        // }
      }
    },
    // deleteRecord(key) {
    //   console.log(key);
    //   this.activePlan.reservationList = this.activePlan.reservationList.filter((item) => item.key !== key);
    //   // this.dataSource = dataList;
    //   // this.selectedRows = [];
    // },
    handleRecordDetail(key) {
      const detail = this.activePlan.reservationList.filter(
        (item) => item.key === key
      )[0];
      this.setDetail(detail);
      this.$router.push({ path: "/order/detail" });
    },
    // handleHistoryRecordDetail(key) {
    //   const detail = this.historyDataSource.filter(
    //     (item) => item.key === key
    //   )[0];
    //   this.setDetail(detail);
    //   this.$router.push({ path: "/order/detail" });
    // },
    // handleTypeChange(text) {
    //   this.searchForm.type = text;
    // },
    // handleDatechange(_, dateString) {
    //   this.searchForm.date = dateString;
    // },
    // search() {
    //   console.log(this.searchForm.no);
    //   console.log(this.searchForm.storename);
    //   console.log(this.searchForm.number);
    //   console.log(this.searchForm.type);
    //   console.log(this.searchForm.ordertime);
    //   console.log(this.searchForm.desc);
    //   var key = this.searchForm.storename;
    //   if (key != "") {
    //     this.historyDataSource = historyDataList.filter(
    //       (item) => item.storename === key
    //     );
    //   } else {
    //     this.historyDataSource = historyDataList;
    //   }
    // },
    // reset() {
    //   this.searchForm.no = "";
    //   this.searchForm.storename = "";
    //   this.searchForm.number = 0;
    //   this.searchForm.type = 0;
    //   this.searchForm.ordertime = "";
    //   this.searchForm.desc = "";
    // },
    // toggleAdvanced() {
    //   this.advanced = !this.advanced;
    // },
    // remove() {
    //   dataList = dataList.filter(
    //     (item) =>
    //       this.selectedRows.findIndex((row) => row.key === item.key) === -1
    //   );
    //   this.dataSource = dataList;
    //   this.selectedRows = [];
    // },
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
