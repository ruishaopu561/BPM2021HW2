<template>
  <div style="max-width: 500px; margin: 40px auto 0; text-align: center">
    <result :title="$t('planComplete')" :is-success="true" />
    <a-button style="margin-left: 8px" @click="checkQueuePlanBtnClick">{{$t('queuePlan')}}</a-button>
  </div>
</template>

<script>
import Result from '@/components/result/Result'
export default {
  name: 'PlanComplete',
  i18n: require('./i18n'),
  components: {Result},
  methods: {
    checkQueuePlanBtnClick() {
      this.$router.push({path: "/dashboard/queuePlan"})
    }
  }
}
</script>

<style scoped>

</style>
