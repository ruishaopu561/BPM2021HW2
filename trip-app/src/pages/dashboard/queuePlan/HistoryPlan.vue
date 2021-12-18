<template>
  <div>
    <a-row :gutter="24">
      <a-col v-for="(item, index) in historyPlan" v-bind:key="index" :span="8">
        <a-card hoverable style="width: 100%">
          <img slot="cover" :src="imgPaths[item.id % 6]" />
          <detail-list :title="item.source + '->' + item.destination" :col="1">
            <detail-list-item term="起始点">{{ item.source }}</detail-list-item>
            <detail-list-item term="目的地">{{
              item.destination
            }}</detail-list-item>
            <detail-list-item>
              <a-button @click="handleRecordDetail({ item, index })">
                旅程详情
              </a-button>
            </detail-list-item>
          </detail-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import DetailList from "../../../components/tool/DetailList";

const DetailListItem = DetailList.Item;

const imgPaths = [
  "/static/img/trip1.jpg",
  "/static/img/trip2.jpg",
  "/static/img/trip3.jpg",
  "/static/img/trip4.jpg",
  "/static/img/trip5.jpg",
  "/static/img/trip6.jpg"
];

export default {
  name: "historyPlan",
  components: { DetailListItem, DetailList },
  data() {
    return {
      imgPaths,
    };
  },
  computed: {
    ...mapState({
      historyPlan: (state) => state.user.historyPlan,
      isPlanStart: (state) => state.user.isPlanStart,
    }),
  },
  methods: {
    ...mapMutations(["setHistoryDetail"]),
    handleRecordDetail({ item, index }) {
      this.setHistoryDetail(index);
      //   console.log(item);
      this.$router.push({ path: "/dashboard/historyDetail" });
    },
  },
};
</script>
