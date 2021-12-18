<template>
  <div>
    <remote-script
      src="https://map.qq.com/api/gljs?v=1.exp&libraries=view&key=DCSBZ-RDRCD-MO54C-PT3VQ-NRP6J-T7BOJ"
    ></remote-script>
    <a-row :gutter="[16, 16]">
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="起始点"
            :value="historyDetail.source"
            class="demo-class"
          >
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="目的地"
            :value="historyDetail.destination"
            class="demo-class"
          >
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
      <a-col>
        <a-card title="历史订单">
          <standard-table
            :columns="columns"
            :dataSource="historyDetail.reservationList"
          >
            <div slot="description" slot-scope="{ text }">
              {{ text }}
            </div>
            <div slot="action" slot-scope="{ text }">
              <a @click="handleRecordDetail(text.key)">
                <a-icon type="link" />详情
              </a>
            </div>
          </standard-table>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
      <a-col>
        <div id="container5"></div>
      </a-col>
    </a-row>
    <!-- <a-row :gutter="[16, 16]">
      <a-col>
        <div id="container6"></div>
      </a-col>
    </a-row> -->
    <a-row>
      <a-col>
        <a-button type="primary" block @click="tripReviewBtnClick">
          旅程回顾
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { drawRoute } from "@/utils/map";
import { mapMutations, mapState } from "vuex";

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
  name: "historyDetail",
  components: { StandardTable },
  data() {
    return {
      map: null,
      columns,
      activeReservation: null,
      activeReservationKey: null,
      confirmLoading: false,
      alertVisible: false,
      activeGraph: null,
    };
  },
  computed: {
    ...mapState({
      historyDetail: (state) => state.user.historyDetail,
    }),
  },
  methods: {
    ...mapMutations([]),
    ...mapMutations("order", ["setDetail", "setMoneyPay"]),
    handleRecordDetail(key) {
      const detail = this.historyDetail.reservationList.filter(
        (item) => item.key === key
      )[0];
      this.setDetail(detail);
      this.$router.push({ path: "/order/detail" });
    },
    tripReviewBtnClick() {
      // 初始化地图
      // var map = new window.TMap.Map("container6", {
      //   center: new window.TMap.LatLng(40.04374524409231, 116.2865218786128), // 设置中心点
      //   zoom: 17, // 设置地图缩放比例
      // });
      this.map.setCenter(this.historyDetail.points.startPos);
      this.map.setZoom(14);

      let test = 0

      function getAngle(position1, position2) {
        let lng1 = position1.lng;
        let lat1 = position1.lat;
        let lng2 = position2.lng;
        let lat2 = position2.lat;
        let dRotateAngle = Math.atan2(
          Math.abs(lng2 - lng1),
          Math.abs(lat2 - lat1)
        );
        if (lng2 >= lng1) {
          if (lat2 > lat1) {
            dRotateAngle = dRotateAngle + 1 - 1
          } else {
            dRotateAngle = Math.PI - dRotateAngle;
          }
        } else {
          if (lat2 >= lat1) {
            dRotateAngle = 2 * Math.PI - dRotateAngle;
          } else {
            dRotateAngle = Math.PI + dRotateAngle;
          }
        }
        dRotateAngle = (dRotateAngle * 180) / Math.PI;
        let ret = -((dRotateAngle % 90) - test) % 90;
        test = ret
        return ret
      }

      let lookFromList = this.historyDetail.points.pl.map((item, index) => ({
        position: new window.TMap.LatLng(item.lat, item.lng, 1000),
        rotation: [0, 0, 0], // 地图在水平面上的旋转角度
        percentage: (index + 1) / this.historyDetail.points.pl.length, // 动画过程中该关键帧的百分比
      }));
      lookFromList.splice(0, 0, {
        position: new window.TMap.LatLng(
          this.historyDetail.points.startPos.lat,
          this.historyDetail.points.startPos.lng,
          1000
        ),
        rotation: [0, 0, 0], // 地图在水平面上的旋转角度
        percentage: 0,
      });

      // for (let item, index in lookFromList) {
      //   if (index === 0) {
      //     continue
      //   }
      //   lookFromList[index].rotation =
      // }

      // lookFromList.forEach((item, index) => {
      //   if (index === 0) {
      //     lookFromList[index] = item;
      //   } else {
      //     lookFromList[index] = {
      //       ...item,
      //       rotation: [
      //         0,
      //         0,
      //         getAngle(
      //           lookFromList[index - 1].position,
      //           lookFromList[index].position
      //         ),
      //       ],
      //     };
      //   }
      // });

      var keyFrames = lookFromList.map((lookFrom) => {
        var position = lookFrom.position;
        var rotation = lookFrom.rotation;
        var percentage = lookFrom.percentage;
        // getMapViewWhenLookFrom指定观察者所在位置及三轴方向上的旋转角度。
        // position为观察者位置，需明确高度；rotation为XYZ三轴上的旋转角度，格式为[x, y, z]，默认为[0, 0, 0]。
        var keyFrame = this.map.getMapViewWhenLookFrom(position, rotation);
        keyFrame.percentage = percentage;
        return keyFrame;
      });

      // map.startAnimation 文档地址：https://lbs.qq.com/webApi/javascriptGL/glDoc/docIndexMap
      // 开始动画，通过keyFrames定义关键帧
      this.map.startAnimation(keyFrames, {
        // duration: this.historyDetail.points.pl.length * 1000, // 动画周期时长，单位为ms
        duration: 90 * 1000,
        loop: 1, // 动画周期循环次数，若为Infinity则无限循环，默认为1
      });
    },
  },
  mounted() {
    let center = new window.TMap.LatLng(
      (this.historyDetail.points.startPos.lat +
        this.historyDetail.points.endPos.lat) /
        2,
      (this.historyDetail.points.startPos.lng +
        this.historyDetail.points.endPos.lng) /
        2
    );
    this.map = new window.TMap.Map("container5", {
      rotation: 20, //设置地图旋转角度
      pitch: 0, //设置俯仰角度（0~45）
      zoom: 11, //设置地图缩放级别
      center: center, //设置地图中心点坐标
    });

    let { marker, polylineLayer } = drawRoute(
      this.historyDetail.points,
      this.map
    );
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
      Object.keys(this.historyDetail.realRoutePoints).length === 0
        ? false
        : true;
  },
};
</script>
