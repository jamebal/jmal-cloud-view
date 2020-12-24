<template>
  <div>
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :limit="1">
      <el-button size="small" type="text">点击上传</el-button>
    </el-upload>
    <el-tooltip class="item" effect="dark" placement="bottom">
      <el-input :autosize="{ minRows: 2, maxRows: 4}" type="textarea" width="100%" v-model="currentValue" @change="change"></el-input>
      <div slot="content">
        <el-image style="width: 150px;" :src="currentValue" fit="contain"></el-image>
      </div>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  name: 'UploadImageInput',
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
    value(val) {
      this.currentValue = val
    }
  },
  methods: {
    change() {
      this.$emit('input', this.currentValue)
    }
  }
}
</script>
