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
    <!-- <a-row>
      <a-table
        v-if="planDetail.reservationList.length !== 0"
        :columns="columns"
        :data-source="planDetail.reservationList"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
      </a-table>
    </a-row> -->
    <a-row>
      <a-card title="处理中订单">
        <!-- @selectedRowChange="onSelectChange" -->
        <!-- :selectedRows.sync="selectedRows" -->
        <standard-table
          :columns="columns"
          :dataSource="planDetail.reservationList"
        >
          <div slot="description" slot-scope="{ text }">
            {{ text }}
          </div>
          <div slot="action" slot-scope="{ text }">
            <!-- <a @click="deleteRecord(text.key)" style="margin-right: 8px">
              <a-icon type="delete" />删除
            </a> -->
            <a @click="handleRecordDetail(text.key)">
              <a-icon type="link" />详情
            </a>
          </div>
        </standard-table>
      </a-card>
    </a-row>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { mapMutations, mapState } from "vuex";
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
  name: "PlanDetail",
  components: { StandardTable },
  data() {
    return {
      columns,
    };
  },
  computed: {
    ...mapState({
      planDetail: (state) => state.user.planDetail,
    }),
  },
  methods: {
    ...mapMutations("order", ["setDetail"]),
    handleRecordDetail(key) {
      const detail = this.planDetail.reservationList.filter(
        (item) => item.key === key
      )[0];
      this.setDetail(detail);
      this.$router.push({ path: "/order/detail" });
    },
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

    setTimeout(() => {
      this.planDetail.reservationList.forEach((item) => {
        item.status = "已预约";
      });
      this.$message.success('预约状态已更新');
    }, 5000);

    // TODO: 显示酒店的marker
  },
};
</script>
