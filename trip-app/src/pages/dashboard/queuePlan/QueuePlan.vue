<template>
  <div>
    <a-row :gutter="24">
      <a-col v-for="item in dataSource" v-bind:key="item.key" :span="8">
        <a-card hoverable style="width: 100%">
          <img slot="cover" :src="item.img" />
          <detail-list :title="item.username" :col="1">
            <detail-list-item term="酒店名称">{{
              item.username
            }}</detail-list-item>
            <detail-list-item term="联系电话">{{
              item.phone
            }}</detail-list-item>
            <detail-list-item term="地址">{{ item.address }}</detail-list-item>
            <detail-list-item term="房间状态">{{
              item.status
            }}</detail-list-item>
            <detail-list-item>
              <a @click="handleRecordDetail(item.key)">
                <a-icon type="link" />详情
              </a>
            </detail-list-item>
          </detail-list>
          <!-- <div slot="action" class="ant-card-actions">
            <a @click="handleRecordDetail(item.key)">
              <a-icon type="link"/>详情
            </a>
          </div> -->
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DetailList from "../../../components/tool/DetailList";

const DetailListItem = DetailList.Item;

const storeList = [];
const users = [
  "上海艺龙酒店",
  "上海陆家嘴丽呈酒店",
  "秋果酒店",
  "上海虹桥国家会展中心同派酒店",
  "上海铂尔曼酒店",
  "上海快捷酒店",
];
const imgPaths = [
  "/static/img/abstract01.jpg",
  "/static/img/abstract02.jpg",
  "/static/img/abstract03.jpg",
  "/static/img/abstract04.jpg",
];

export default {
  name: "QueuePlan",
  data() {
      return {
      }
  },
  computed: {
      ...mapState({
          queuePlan: (state) => state.user.queuePlan
      })
  }
};
</script>
