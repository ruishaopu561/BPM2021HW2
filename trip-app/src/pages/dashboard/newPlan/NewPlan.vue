<template>
  <a-card :bordered="false">
    <a-steps class="steps" :current="current">
      <a-step :title="$t('selectRoute')" />
      <a-step :title="$t('selectEnterprise')" />
      <a-step :title="$t('complete')" />
    </a-steps>
    <div class="content">
      <!-- // TODO: 需要手动销毁 -->
      <keep-alive>
        <Map v-if="current === 0" @nextStep="nextStep"></Map>
      </keep-alive>
      <Enterprise
        v-if="current === 1"
        @nextStep="nextStep"
        @prevStep="prevStep"
      ></Enterprise>
      <step3 v-if="current === 2" @prevStep="prevStep" @finish="finish"></step3>
    </div>
  </a-card>
</template>

<script>
import Map from "./Map";
import Enterprise from "./Enterprise";
import Step3 from "./Step3";

export default {
  name: "StepForm",
  i18n: require("./i18n"),
  components: { Map, Enterprise, Step3 },
  data() {
    return {
      current: 0,
    };
  },
  computed: {
    desc() {
      return this.$t("pageDesc");
    },
  },
  methods: {
    nextStep() {
      if (this.current < 2) {
        this.current += 1;
      }
    },
    prevStep() {
      if (this.current > 0) {
        this.current -= 1;
      }
    },
    finish() {
      this.current = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.steps {
  max-width: 950px;
  margin: 16px auto;
}
</style>
