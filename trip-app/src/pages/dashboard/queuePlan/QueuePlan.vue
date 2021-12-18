<template>
  <div>
    <a-row :gutter="24">
      <a-col v-for="(item, index) in queuePlan" v-bind:key="index" :span="8">
        <a-card hoverable style="width: 100%">
          <img slot="cover" :src="imgPaths[item.id % 3]" />
          <detail-list :title="item.source + '->' + item.destination" :col="1">
            <detail-list-item term="起始点">{{ item.source }}</detail-list-item>
            <detail-list-item term="目的地">{{
              item.destination
            }}</detail-list-item>
            <detail-list-item>
              <a-button @click="handleRecordDetail({ item, index })"
                >详情</a-button
              >
              <a-button
                type="primary"
                @click="handleStartTripBtnClick({ item, index })"
                >开始行程</a-button
              >
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
];

export default {
  name: "QueuePlan",
  components: { DetailListItem, DetailList },
  data() {
    return {
      imgPaths,
    };
  },
  computed: {
    ...mapState({
      queuePlan: (state) => state.user.queuePlan,
      isPlanStart: (state) => state.user.isPlanStart,
    }),
  },
  methods: {
    ...mapMutations(["setPlanDetail", "setActivePlan", "setPlanStart"]),
    handleRecordDetail({ item, index }) {
      this.setPlanDetail(index);
      //   console.log(item);
      this.$router.push({ path: "/dashboard/planDetail" });
    },
    handleStartTripBtnClick({ item, index }) {
      if (this.isPlanStart) {
        // TODO: 使用message box表示已有行程在进行
        this.$message.info('请先完成进行中的行程');
        return;
      }
      this.setPlanStart();
      this.setActivePlan(index);
      //   console.log(item);
      this.$router.push({ path: "/dashboard/activePlan" });
    },
  },
};
</script>
