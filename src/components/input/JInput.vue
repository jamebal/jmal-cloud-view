<template>
  <el-tooltip class="item" effect="dark" placement="bottom">
    <el-input autosize type="textarea" width="100%" v-model="currentValue"></el-input>
    <div slot="content" v-if="value.length > 0">
      <el-image v-if="value === 'img'" style="width: 150px;" :src="value" fit="contain"></el-image>
      <a v-if="value === 'url'" :href="value">{{value}}</a>
    </div>
  </el-tooltip>
</template>
<script>
export default {
  name: 'JInput',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  watch: {
    currentValue(val) {
      console.log('890')
      this.$emit("update:value", val);
    }
  }
}
</script>
