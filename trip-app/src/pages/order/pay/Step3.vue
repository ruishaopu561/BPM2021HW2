<template>
  <div style="max-width: 500px; margin: 40px auto 0; text-align: center">
    <result :title="$t('success')" :is-success="true" />
    <!-- <a-button type="primary" @click="doOnceAgin">{{$t('doAgain')}}</a-button> -->
    <a-button type="primary" @click="bacKToOrder" style="margin-left: 8px">回到出行中计划页面</a-button>
  </div>
</template>

<script>
import Result from '@/components/result/Result'
export default {
  name: 'Step3',
  i18n: require('./i18n'),
  components: {Result},
  methods: {
    doOnceAgin () {
      this.$emit('finish')
    },
    bacKToOrder() {
      this.$router.push({path: '/dashboard/activePlan'})
    }
  }
}
</script>

<style scoped>

</style>
