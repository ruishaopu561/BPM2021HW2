<template>
  <div>
    <a-row :gutter="24">
      <a-col v-for="item in dataSource" v-bind:key="item.key" :span="8">
        <a-card hoverable style="width:100%">
          <img slot="cover" :src="item.img"/>
          <detail-list :title="item.username" :col="1">
            <detail-list-item term="酒店名称">{{ item.username }}</detail-list-item>
            <detail-list-item term="联系电话">{{ item.phone }}</detail-list-item>
            <detail-list-item term="地址">{{ item.address }}</detail-list-item>
            <detail-list-item term="房间状态">{{ item.status }}</detail-list-item>
            <detail-list-item >
              <a @click="handleRecordDetail(item.key)">
                <a-icon type="link"/>详情
              </a>
            </detail-list-item>
          </detail-list>
          <div slot="action" class="ant-card-actions">
            <a @click="handleRecordDetail(item.key)">
              <a-icon type="link"/>详情
            </a>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import DetailList from '../../components/tool/DetailList'
import {mapMutations} from 'vuex'

const DetailListItem = DetailList.Item

const storeList = []
const users = ['上海艺龙酒店',
               '上海陆家嘴丽呈酒店', 
               '秋果酒店', 
               '上海虹桥国家会展中心同派酒店',
               '上海铂尔曼酒店',
               '上海快捷酒店']
const imgPaths = ['/static/img/abstract01.jpg',
                  '/static/img/abstract02.jpg',
                  '/static/img/abstract03.jpg',
                  '/static/img/abstract04.jpg']

for (let i = 1; i <= 6; i++) {
  storeList.push({
    key: i,
    username: users[i - 1],
    starttime: '2021-' + (Math.floor(Math.random() * 11) + 1)
               + '-' + (Math.floor(Math.random() * 27) + 1),
    phone: 18012345678,
    address: '这里是地址*********',
    status: '有空房',
    img: imgPaths[i % 4]
  })
}

console.log(storeList)

export default {
  name: 'StoreRecommend',
  components: {DetailListItem, DetailList},
  data () {
    return {
      dataSource: storeList
    }
  },
  methods: {
    ...mapMutations('order', ['setDetail']),
    handleRecordDetail(key) {
      const detail = this.dataSource.filter(item => item.key === key)[0]
      this.setDetail(detail)
      this.$router.push({path:'/enterprise/detail'})
    }
  }
}
</script>

<style scoped>

</style>
