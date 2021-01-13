<template>
  <el-scrollbar style="height: 280px">
    <el-row>
      <el-col :span="4" v-for="(item, index) in iconList" :key="index">
        <el-card shadow="hover" class="al-card-border" :title="item">
          <div class="al-icon-picker-item" @click="select(item)">
            <svg-icon :icon-class="item"></svg-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>
<script>
export default {
  name: 'IconList',
  props: {
    iconList: {
      type: Array,
      default: []
    },
  },
  methods: {
    select(item) {
      this.$emit('select', item)
    }
  }
}
</script>
