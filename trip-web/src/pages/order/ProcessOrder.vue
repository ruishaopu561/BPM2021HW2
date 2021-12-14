<template>
  <a-card>
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
              label="用户名称"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-input v-model="searchForm.username" placeholder="请输入" />
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
              label="订单状态"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-select @change="handleStatusChange" placeholder="请选择">
                <a-select-option value="1">预约中</a-select-option>
                <a-select-option value="2">已处理</a-select-option>
              </a-select>
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
        <a-button @click="handleMultiAddress()">批量处理</a-button>
      </a-space>
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
        <div slot="action" slot-scope="{record}">
          <a @click="address(record.key)" style="margin-right: 8px">
            <a-icon type="edit"/>处理
          </a>
          <a @click="finish(record.key)" style="margin-right: 8px">
            <a-icon type="check"/>完成
          </a>
          <a @click="deleteRecord(record.key)" style="margin-right: 8px">
            <a-icon type="delete"/>删除
          </a>
          <a @click="handleRecordDetail(record.key)">
            <a-icon type="link"/>详情
          </a>
        </div>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {mapMutations} from 'vuex'

const columns = [
  {
    title: '订单编号',
    dataIndex: 'no'
  },
  {
    title: '用户名称',
    dataIndex: 'username',
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

const users = ['张三', '李四', '王五', '马六']
const types = ['单人标间', '双人标间', '家庭套房', 'VIP套房']
const statuss = ['预约中', '已处理']
let dataList = []

for (let i = 1; i < 8; i++) {
  dataList.push({
    key: i,
    no: 'NO ' + i,
    username: users[Math.floor(Math.random() * 10) % 4],
    ordertime: '2021-' + (Math.floor(Math.random() * 11) + 1)
               + '-' + (Math.floor(Math.random() * 27) + 1),
    status: statuss[Math.floor(Math.random() * 10) % 2],
    type: types[Math.floor(Math.random() * 10) % 4],
    number: Math.floor(Math.random() * 3) + 1,
    description: '这是一段描述',
  })
}

export default {
  name: 'processOrder',
  components: {StandardTable},
  data () {
    return {
      advanced: true,
      columns: columns,
      dataSource: dataList,
      selectedRows: [],
      searchForm: {
        no: '',
        username: '',
        date: '',
        status: '',
        type: 0,
        number: 0,
        desc: ''
      }
    }
  },
  computed: {
    desc() {
      return this.$t('展示和修改处理中的订单')
    }
  },
  methods: {
    ...mapMutations('order', ['setHistory', 'setDetail']),
    address(key) {
      for(var i=0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].key == key) {
          this.dataSource[i].status = statuss[1]
        }
      }
    },
    finish(key) {
      // 如果要不断添加到历史订单页面的话，每次添加之前都要确保历史订单页面关闭
      let data = this.dataSource.filter(item => item.key === key)[0]
      this.dataSource = this.dataSource.filter(item => item.key !== key)
      if (data.status === statuss[0]) {
        this.$message.warn('该订单还未处理')
      } else {
        data.status = '已结束'
        this.setHistory(data)
      }
    },
    deleteRecord(key) {
      dataList = dataList.filter(item => item.key !== key)
      this.dataSource = dataList
      this.selectedRows = this.selectedRows.filter(item => item.key !== key)
    },
    handleRecordDetail(key) {
      const detail = this.dataSource.filter(item => item.key === key)[0]
      this.setDetail(detail)
      this.$router.push({path:'/order/detail'})
    },
    handleTypeChange(text) {
      this.searchForm.type = text
    },
    handleStatusChange(status) {
      this.searchForm.status = statuss[status - 1]
      console.log(this.searchForm.status)
    },
    handleDatechange(_, dateString) {
      this.searchForm.date = dateString
    },
    search() {
      var key = this.searchForm.status
      if (key != '') {
        this.dataSource = dataList.filter(item => item.status === key)
      } else {
        this.dataSource = dataList
      }
    },
    reset() {
      this.searchForm.no = ''
      this.searchForm.username = ''
      this.searchForm.number = 0
      this.searchForm.status = 0
      this.searchForm.type = 0
      this.searchForm.date = ''
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
    handleMenuClick () {
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
