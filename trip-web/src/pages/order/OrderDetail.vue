<template>
  <a-card style="margin-top: 16px" :bordered="false">
    <detail-list :col="1">
      <detail-list-item term="订单编号">{{ data.no }}</detail-list-item>
      <detail-list-item term="用户名称">{{ data.username }}</detail-list-item>
      <detail-list-item term="订房类型">{{ data.type }}</detail-list-item>
      <detail-list-item term="订房数量">{{ data.number }}</detail-list-item>
      <detail-list-item term="结束时间">{{ data.endtime }}</detail-list-item>
      <detail-list-item term="状态">{{ data.status }}</detail-list-item>
      <detail-list-item term="描述">{{ data.description }}</detail-list-item>
    </detail-list>
  </a-card>
</template>

<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item

export default {
  name: 'OrderDetail',
  components: {DetailListItem, DetailList},
  data () {
    return {
      data: ''
    }
  },
  methods: {
  },
  mounted() {
    this.data = this.$route.query.orderDetail
  }
}
</script>

<style lang="less" scoped>
.title {
    color: @title-color;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
}
</style>
