<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form>
      <a-form-item
        label="姓名"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-input v-model="form.name" placeholder="用户姓名、昵称" />
      </a-form-item>
      <a-form-item
        label="商家名称"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-input v-model="form.storename" placeholder="商家名称"/>
      </a-form-item>
      <a-form-item
        label="预订日期"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-date-picker @change="handleDatechange" style="width:100%" placeholder="请输入日期" />
      </a-form-item>
      <a-form-item
        label="房间类型"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-select @change="handleTypeChange" placeholder="请选择">
          <a-select-option value="1">单人标间</a-select-option>
          <a-select-option value="2">双人标间</a-select-option>
          <a-select-option value="3">家庭套房</a-select-option>
          <a-select-option value="4">VIP套房</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="预订数量"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-input-number :min="0" :max="100"  v-model="form.number" />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
export default {
  name: 'OrderForm',
  i18n: require('./i18n'),
  props: ['form'],
  data () {
    return {
      value: 1
    }
  },
  computed: {
    desc() {
      return this.$t('pageDesc')
    }
  },
  methods: {
    handleTypeChange(key) {
      this.form.type = key
    },
    handleDatechange(_, dateString) {
      this.form.ordertime = dateString
      console.log(this.form.ordertime)
    }
  }
}
</script>

<style scoped>

</style>
