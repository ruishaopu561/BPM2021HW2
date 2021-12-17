<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="起始点"
            :value="planDetail.source"
            class="demo-class"
          >
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="目的地"
            :value="planDetail.destination"
            class="demo-class"
          >
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <div id="container3"></div>
    </a-row>
    <a-row>
      <a-table
        v-if="planDetail.reservationList.length !== 0"
        :columns="columns"
        :data-source="planDetail.reservationList"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { drawRoute } from "@/utils/map";

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
    title: "房型数目",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "预约人",
    dataIndex: "name",
    key: "name",
  },
];

export default {
  name: "HistoryPlan",
  data() {
    return {
        columns
    };
  },
  computed: {
    ...mapState({
      planDetail: (state) => state.user.planDetail,
    }),
  },
  async mounted() {
    let center = new window.TMap.LatLng(
      (this.planDetail.points.startPos.lat +
        this.planDetail.points.endPos.lat) /
        2,
      (this.planDetail.points.startPos.lng +
        this.planDetail.points.endPos.lng) /
        2
    );
    this.map = new window.TMap.Map("container3", {
      rotation: 20, //设置地图旋转角度
      pitch: 0, //设置俯仰角度（0~45）
      zoom: 14, //设置地图缩放级别
      center: center, //设置地图中心点坐标
    });

    let { marker } = drawRoute(this.planDetail.points, this.map);

    // TODO: 显示酒店的marker
  },
};
</script>
