<template>
  <div class="container">
    <table-list
      ref="tableList"
      :less-client-height="245"
      :tableData="dataList"
      :loading="loading"
      :hasSelection="false"
      :border="false"
      :tableHeader="tableHeader"
    ></table-list>
  </div>
</template>

<script>
import TableList from "@/components/table/TableList"
import {mapState} from "vuex";

export default {
  name: 'TaskProgress',
  components: {
    TableList
  },
  props: {
    data: {
      type: Array,
      default: []
    },
  },
  computed: {
    ...mapState(['message'])
  },
  data() {
    return {
      dataList: [],
      loading: false,
      tableHeader: [
        {prop: 'type', width: 100, label: '任务类型'},
        {prop: 'name', minWidth: 100, label: '名称'},
        {prop: 'progress', width: 100, label: '进度'},
      ]
    }
  },
  watch: {
    data(val) {
      this.dataList = val
    },
    message(msg) {
      if (msg.event === 'msg/taskProgress') {
        const taskProgress = msg.data.body
        const index = this.dataList.findIndex(item => item.taskId === taskProgress.taskId)
        if (index > -1) {
          if (taskProgress.progress) {
            this.dataList[index].progress = taskProgress.progress
          } else {
            this.dataList.splice(index, 1)
          }
        } else {
          if (taskProgress.progress) {
            this.dataList.push(taskProgress)
          }
        }
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 !important;
}
</style>
