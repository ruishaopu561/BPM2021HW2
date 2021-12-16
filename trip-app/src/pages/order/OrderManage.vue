<template>
  <div>
    <a-card title="处理中订单">
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
          <a @click="payRecord(text.key)" style="margin-right:8px">
            <a-icon type="transaction" />支付
          </a>
          <a @click="editRecord(text.key)" style="margin-right:8px">
            <a-icon type="edit" />修改
          </a>
          <a @click="deleteRecord(text.key)" style="margin-right:8px">
            <a-icon type="delete" />删除
          </a>
          <a @click="handleRecordDetail(text.key)">
            <a-icon type="link"/>详情
          </a>
        </div>
      </standard-table>
      <a-modal title="修改订单"
        ok-text="确认"
        cancel-text="取消"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <OrderForm :form="editForm"/>
      </a-modal>
    </a-card>
    <a-divider style="margin-bottom: 8px"/>
    <a-card title="历史订单记录">
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null: 'fold'">
            <a-row >
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="订单编号"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-model="searchForm.no" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="商家名称"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-model="searchForm.storename" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="预约日期"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-date-picker @change="handleDatechange" style="width: 100%" placeholder="请输入日期" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="房型"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select @change="handleTypeChange" placeholder="请选择">
                  <a-select-option value="1">单人标间</a-select-option>
                  <a-select-option value="2">双人标间</a-select-option>
                  <a-select-option value="3">家庭套房</a-select-option>
                  <a-select-option value="4">VIP套房</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="数量"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input-number v-model="searchForm.number" style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="描述"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-model="searchForm.desc" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search()">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset()">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form>
      </div>
      <div>
        <a-space class="operator">
          <a-button @click="handleMultiRemove()">批量删除</a-button>
        </a-space>
        <standard-table
          :columns="columns"
          :dataSource="historyDataSource"
          :selectedRows.sync="selectedRows"
          @clear="onClear"
          @change="onChange"
          @selectedRowChange="onSelectChange"
        >
          <div slot="description" slot-scope="{text}">
            {{text}}
          </div>
          <div slot="action" slot-scope="{text}">
            <a @click="deleteHistoryRecord(text.key)" style="margin-right:8px">
              <a-icon type="delete"/>删除
            </a>
            <a @click="handleHistoryRecordDetail(text.key)">
              <a-icon type="link"/>详情
            </a>
          </div>
        </standard-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import OrderForm from '../order/create/OrderForm'
// import {order} from '@/services'
import {mapState, mapMutations} from 'vuex'

const columns = [
  {
    title: '订单编号',
    dataIndex: 'no'
  },
  {
    title: '商家名称',
    dataIndex: 'storename',
    sorter: true
  },
  {
    title: '预约日期',
    dataIndex: 'ordertime',
    sorter: true
  },
  {
    title: '房型',
    dataIndex: 'type',
    sorter: true
  },
  {
    title: '数量',
    dataIndex: 'number',
  },
  {
    title: '总价(￥)',
    dataIndex: 'value',
  },
  {
    title: '状态',
    dataIndex: 'status',
    needTotal: true,
  },
  {
    title: '描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

const stores = ['上海艺龙酒店',
               '上海陆家嘴丽呈酒店', 
               '秋果酒店', 
               '上海虹桥国家会展中心同派酒店',
               '上海铂尔曼酒店',
               '上海快捷酒店']
const types = ['单人标间', '双人标间', '家庭套房', 'VIP套房']
let dataList = []
let historyDataList = []

for (let i = 1; i <= 8; i++) {
  dataList.push({
    key: i+10,
    no: 'NO ' + (i+10),
    storename: stores[Math.floor(Math.random() * 10) % 4],
    ordertime: '2021-' + (Math.floor(Math.random() * 11) + 1)
               + '-' + (Math.floor(Math.random() * 27) + 1),
    status: '已预约',
    type: types[Math.floor(Math.random() * 10) % 4],
    number: Math.floor(Math.random() * 3) + 1,
    value: Math.floor(Math.random() * 300) + 500,
    description: '这是一段描述',
  })
  historyDataList.push({
    key: i,
    no: 'NO ' + i,
    storename: stores[Math.floor(Math.random() * 10) % 4],
    ordertime: '2021-' + (Math.floor(Math.random() * 11) + 1)
               + '-' + (Math.floor(Math.random() * 27) + 1),
    status: '已结束',
    type: types[Math.floor(Math.random() * 10) % 4],
    number: Math.floor(Math.random() * 3) + 1,
    value: Math.floor(Math.random() * 300) + 500,
    description: '这是一段描述',
  })
}

export default {
  name: 'historyOrder',
  components: {StandardTable, OrderForm},
  data () {
    return {
      advanced: true,
      columns: columns,
      dataSource: dataList,
      historyDataSource: historyDataList,
      selectedRows: [],
      visible: false,
      confirmLoading: false,
      searchForm: {
        no: '',
        storename: '',
        ordertime: '',
        type: 0,
        number: 0,
        value: 0,
        desc: ''
      },
      editForm: {},
      key: -1,
    }
  },
  computed: {
    ...mapState('order', ['history', 'form', 'payedId']),
    desc() {
      return this.$t('展示和查询历史订单')
    }
  },
  mounted() {
    this.init(20, this.form)

  },
  methods: {
    ...mapMutations('order', ['setDetail', 'setForm', 'setMoneyPay']),
    init(key) {
      console.log(this.form)
      if (this.form) {
        let data = {
          key: key,
          no: 'NO ' + key,
          storename: this.form.storename,
          ordertime: this.form.ordertime,
          status: '处理中',
          type: types[this.form.type - 1],
          number: this.form.number,
          value: this.form.value,
          description: '这是一段描述',
        }
        this.dataSource.push(data)
      } else {
        this.setForm(null)
      }
    },
    handleOk() {
      this.visible = false
      console.log(this.editForm)
      let oldOrder = this.dataSource.filter(item => item.key === this.key)[0]
      let data = {
        key: this.key,
        no: 'NO ' + this.key,
        storename: this.editForm.storename,
        ordertime: this.editForm.ordertime,
        status: '修改处理中',
        type: types[this.editForm.type - 1],
        number: this.editForm.number,
        value: oldOrder.value,
        description: '这是一段描述',
      }
      this.dataSource = this.dataSource.filter(item => item.key !== this.key)
      this.dataSource.push(data)

      // // 发送到 rmp 平台
      // const f = {
      //   ID: this.editForm.name,
      //   enterpriseID: this.editForm.storename,
      //   time: this.editForm.ordertime,
      //   number: this.editForm.number,
      //   status: 2,
      //   money: oldOrder.value,
      //   comment: '这是一段描述',
      //   type: types[this.editForm.type - 1],
      // }
      // order.updateOrder(f).then(res => {
      //   console.log(res)
      // })
      this.editForm = {}
    },
    handleCancel() {
      this.visible = false
    },
    payRecord(key) {
      let data = this.dataSource.filter(item => item.key === key)[0]
      console.log('data', data)
      this.setMoneyPay(data)
      this.$router.push({path:'/order/pay'})
      this.afterPay(key)
    },
    afterPay(key) {
      if (key !== -1) {
        let data = this.dataSource.filter(item => item.key === key)[0]
        this.dataSource = this.dataSource.filter(item => item.key !== key)
        if (data) {
          data.status = '已结束'
          this.historyDataSource.push(data)
        }
      }
    },
    editRecord(key) {
      this.key = key
      let data = this.dataSource.filter(item => item.key === key)[0]
      this.editForm = {
        storename: data.storename,
        number: data.number
      }
      this.visible = true
    },
    deleteRecord(key) {
      dataList = dataList.filter(item => item.key !== key)
      this.dataSource = dataList
      this.selectedRows = []
    },
    deleteHistoryRecord(key) {
      historyDataList = historyDataList.filter(item => item.key !== key)
      this.historyDataSource = historyDataList
      this.selectedRows = []
    },
    handleRecordDetail(key) {
      const detail = this.dataSource.filter(item => item.key === key)[0]
      this.setDetail(detail)
      this.$router.push({path:'/order/detail'})
    },
    handleHistoryRecordDetail(key) {
      const detail = this.historyDataSource.filter(item => item.key === key)[0]
      this.setDetail(detail)
      this.$router.push({path:'/order/detail'})
    },
    handleTypeChange(text) {
      this.searchForm.type = text
    },
    handleDatechange(_, dateString) {
      this.searchForm.date = dateString
    },
    search() {
      console.log(this.searchForm.no)
      console.log(this.searchForm.storename)
      console.log(this.searchForm.number)
      console.log(this.searchForm.type)
      console.log(this.searchForm.ordertime)
      console.log(this.searchForm.desc)
      var key = this.searchForm.storename
      if (key != '') {
        this.dataSource = dataList.filter(item => item.storename === key)
      } else {
        this.dataSource = dataList
      }
    },
    reset() {
      this.searchForm.no = ''
      this.searchForm.storename = ''
      this.searchForm.number = 0
      this.searchForm.type = 0
      this.searchForm.ordertime = ''
      this.searchForm.desc = ''
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
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
    }
  }
}
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
