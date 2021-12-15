<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        :label="$t('payment')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
      >
        <a-input v-model="form.payaccount" value="1" placeholder="ant-design@alipay.com"/>
      </a-form-item>
      <a-form-item
        :label="$t('collection')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
      >
        <a-input-group :compact="true" style="display: inline-block; vertical-align: middle">
          <a-select defaultValue="alipay" style="width: 100px">
            <a-select-option value="alipay">{{$t('alipay')}}</a-select-option>
            <a-select-option value="wexinpay">{{$t('wechat')}}</a-select-option>
          </a-select>
          <a-input :style="{width: 'calc(100% - 100px)'}" :value="form.transaccount"/>
        </a-input-group>
      </a-form-item>
      <a-form-item
        :label="$t('collectionName')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
      >
        <a-input :value="form.storename" />
      </a-form-item>
      <a-form-item
        :label="$t('transferAmount')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
      >
        <a-input prefix="￥" :value="form.value" />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 17, offset: 7}">
        <a-button type="primary" @click="nextStep">{{$t('nextStep')}}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Step1',
  i18n: require('./i18n'),
  data() {
    return {
      form: {}
    }
  },
  computed: {
    ...mapState('order', ['moneyPay']),
  },
  mounted() {
    this.init()
  },
  methods: {
    nextStep () {
      this.$emit('nextStep')
    },
    init () {
      this.form = this.moneyPay
      this.form.payaccount = 'zhangsan@alipay.com'
      this.form.transaccount = 'yilongjiudian@alipay.com'
      console.log(this.form)
    }
  },
}
</script>

<style scoped>

</style>
