<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        :message="$t('note')"
        style="margin-bottom: 24px;"
      />
      <a-form-item
        :label="$t('payment')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
        class="stepFormText"
      >
        {{ form.payaccount }}
      </a-form-item>
      <a-form-item
        :label="$t('collection')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
        class="stepFormText"
      >
        {{ form.transaccount }}
      </a-form-item>
      <a-form-item
        :label="$t('collectionName')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
        class="stepFormText"
      >
        {{ form.storename }}
      </a-form-item>
      <a-form-item
        :label="$t('transferAmount')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 17}"
        class="stepFormText"
      >
        ￥ {{ form.value }}
      </a-form-item>
      <a-form-item :wrapperCol="{span: 17, offset: 7}">
        <a-button :loading="loading" type="primary" @click="nextStep">{{$t('submit')}}</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">{{$t('preStep')}}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'Step2',
  i18n: require('./i18n'),
  data () {
    return {
      loading: false,
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
    ...mapMutations('order', ['setPayedId']),
    nextStep () {
      let _this = this
      _this.loading = true
      setTimeout(function () {
        _this.$emit('nextStep')
      }, 1500)
      this.setPayedId(this.form.key)
    },
    prevStep () {
      this.$emit('prevStep')
    },
    init () {
      this.form = this.moneyPay
      this.form.payaccount = 'zhangsan@alipay.com'
      this.form.transaccount = 'yilongjiudian@alipay.com'
      console.log(this.form)
    }
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;
    :global {
      .ant-form-item-label,
      .ant-form-item-control {
        line-height: 22px;
      }
    }
  }
</style>
