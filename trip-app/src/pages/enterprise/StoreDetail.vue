<template>
    <div>
      <a-card style="margin-top: 16px" :bordered="false">
        <detail-list title="企业信息" :col="1">
          <detail-list-item term="企业名称">上海艺龙酒店</detail-list-item>
          <detail-list-item term="联系电话">18100000001</detail-list-item>
          <detail-list-item term="开业时间">2021</detail-list-item>
          <detail-list-item term="地址">上海黄浦区九江路595号 距离人民广场地铁站-14口370米</detail-list-item>
        </detail-list>
      </a-card>
      <a-divider style="margin-bottom: 16px"/>
      <a-card title="简介">
        <detail-list size="small" :col="1">
            <detail-list-item>
            艺龙酒店（上海外滩南京路步行街店）毗邻南京路步行街，世纪广场对面，酒店闹中取静，既可一步之遥享受南京路的繁华，又可后退一步，坐拥上海繁华街景，且可闲庭信步，打卡人民广场、杜莎夫人蜡像馆、外滩、豫园城隍庙、博物馆、新天地等上海著名景点，隔江眺望陆家嘴、东方明珠、上海中心，领略上海风情万种的魅力。
            </detail-list-item>
        </detail-list>
        <a-divider style="margin: 16px 0" />
        <detail-list size="small" :col="1">
            <detail-list-item>
                酒店交通极其便利，步行5分钟可达地铁1号、2号、8号线人民广场站14号口，与2号、10号线南京东路地铁站4号口，周边拥有5条地铁线，可直达各大机场、高铁站，30分钟车程可达上海迪士尼乐园，是您商务出行、休闲、旅游、亲子游的不二选择。
            </detail-list-item>
        </detail-list>
        <a-divider style="margin: 16px 0" />
        <detail-list size="small" :col="1">
            <detail-list-item>
                艺龙酒店是艺龙品牌系列的旗舰店，定位为中高端轻奢酒店，整体设计风格典雅现代、臻至高贵，荣获2020香港亚太设计师大赛酒店空间（方案类）至高奖项——至尊奖。酒店以不同的“城市温度”为艺术主题，让宾客感受每一座城的温度，书写每一座城的回忆，打造“心之所向，皆有心安之所”的舒适旅居之所。
            </detail-list-item>
        </detail-list>
        <a-divider style="margin: 16px 0" />
        <detail-list size="small" :col="1">
            <detail-list-item>
                酒店内设有150间全窗景房型，配备有大堂吧、中餐厅、创意茶吧、会议室、健身房、自助洗衣房、Spa水疗馆以及极具特色的环形休憩室。以“智慧悦行”、“臻至品质”、“艺龙温情”为三大价值点，关注细节，从顾客体验感受出发，优化设计了渐明渐暗光源、高颜值外置吹风机、蓝光消毒柜、马桶高压喷枪、一次性床封条等酒店运营微创新产品，用加强版隔音与高品质床品给您打造一个甜梦之旅，践行”懂您所想，享您所行“的价值主张，为驻足旅客，在繁忙拼搏的商旅及休闲的旅途中，打造如同归处的安心之所，成为伫于繁华之中的城市港湾。
            </detail-list-item>
        </detail-list>
      </a-card>
      <a-card style="margin-top:24px 0">
        <standard-table
            :columns="columns"
            :dataSource="dataSource"
            :selectedRows.sync="selectedRows"
            @clear="onClear"
            @change="onChange"
            @selectedRowChange="onSelectChange"
        >
            <div slot="description" slot-scope="{text}">
              {{text}}
            </div>
            <div slot="action" slot-scope="{text}">
              <a @click="handleOrder(text.key)">
                <a-icon type="form"/>预订
              </a>
            </div>
        </standard-table>
        <a-modal title="新增订单"
                ok-text="确认"
                cancel-text="取消"
                :visible="visible"
                :confirm-loading="confirmLoading"
                @ok="handleOk"
                @cancel="handleCancel"
        >
          <OrderForm :form="form"/>
        </a-modal>
      </a-card>
      <a-card style="margin-top: 24px" :bordered="false" title="风采展示">
        <a-carousel autoplay dots-class="slick-slide slick-dots slick-thumb">
            <div><img src='/static/img/abstract01.jpg'/></div>
            <div><img src='/static/img/abstract02.jpg'/></div>
            <div><img src='/static/img/abstract03.jpg'/></div>
            <div><img src='/static/img/abstract04.jpg'/></div>
        </a-carousel>
      </a-card>
    </div>
</template>

<script>
import DetailList from '@/components/tool/DetailList'
import StandardTable from '@/components/table/StandardTable'
import OrderForm from '../order/create/OrderForm'
import {order} from '@/services'
import {mapMutations} from 'vuex'

const DetailListItem = DetailList.Item

const columns = [
  {
    title: '房型',
    dataIndex: 'name',
  },
  {
    title: '日期',
    dataIndex: 'time',
    sorter: true
  },
  {
    title: '价格(￥)',
    dataIndex: 'price',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

const types = ['单人标间', '双人标间', '家庭套房', 'VIP套房']
let dataList = []
for (let i = 1; i <= 6; i++) {
  dataList.push({
    key: i,
    name: types[Math.floor(Math.random() * 10) % 4],
    time: '2021-' + (Math.floor(Math.random() * 11) + 1)
               + '-' + (Math.floor(Math.random() * 27) + 1),
    price: Math.floor(Math.random() * 200) + 300,
    description: '禁烟 有窗',
  })
}

export default {
  name: 'StoreDetail',
  components: {DetailListItem, DetailList, StandardTable, OrderForm},
  data () {
    return {
      columns: columns,
      dataSource: dataList,
      selectedRows: [],
      visible: false,
      confirmLoading: false,
      form: {},
      key: null
    }
  },
  methods: {
    ...mapMutations('order', ['setForm']),
    handleOk() {
      this.visible = false
      let data = this.dataSource.filter(item => item.key === this.key)[0]
      this.form.value = data.price * this.form.number
      console.log(this.form)
      this.setForm(this.form)
      // 发送到 rmp 平台
      const f = this.form
      // console.log('f.type', (f.type-'0'))
      f.type = types[(f.type-'0')]
      order.createOrder(f).then(res => {
        console.log(res)
      })
      this.form = {}
    },
    handleCancel() {
      this.visible = false
    },
    handleOrder(key) {
      console.log('预约', key)
      this.key = key
      this.visible = true
    },
    remove () {
      dataList = dataList.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.dataSource = dataList
      this.selectedRows = []
    },
    onClear() {
      console.log('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      console.log('你点击了状态栏表头')
    },
    onChange() {
      console.log('表格状态改变了')
    },
    onSelectChange() {
      console.log('选中行改变了')
    },
    handleMultiRemove() {
      this.remove()
    },
  },
}
</script>

<style lang="less" scoped>
.title {
color: @title-color;
font-size: 16px;
font-weight: 500;
margin-bottom: 16px;
}
.ant-carousel .slick-dots {
  height: auto;
}
.ant-carousel .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  height: 240px;
  max-width: 80%;
}
.ant-carousel .slick-thumb {
  bottom: -45px;
}
.ant-carousel .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>
