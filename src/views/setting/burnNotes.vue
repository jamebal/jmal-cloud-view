<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>阅后即焚笔记</span>
            <el-button round class="card-button" size="mini" type="primary" @click="create">创建笔记</el-button>
          </div>
        </div>
      </div>
      <table-list
        :border="false"
        :has-selection="false"
        :tableData="burnNoteList"
        :less-client-height="210"
        :loading="tableLoading"
        :tableHeader="tableHeader"
      ></table-list>
    </el-card>
  </div>
</template>

<script>

import { getBurnNotes, deleteBurnNote } from "@/api/burn-note"
import TableList from "@/components/table/TableList.vue";
import { parseTime } from '@/utils';

export default {
  components: {TableList},
  data() {
    return {
      burnNoteList: [],
      tableLoading: false,
      tableHeader: [
        {prop: 'isFile', label: '笔记类型', tag: true, align: 'center',
          formatData: (isFile)=> {
            if(isFile) {
              return [{name: '文件'}]
            } else {
              return [{name: '文本', type: 'info'}]
            }
          }
        },
        {prop: 'viewsLeft', label: '剩余查看次数', noScope: true, align: 'center'},
        {prop: 'expireAt', label: '过期时间', noScope: true, align: 'center',
          formatData: (expireAt) => {
            if (expireAt) {
              return $J.formatDate('Y-m-d', parseTime(expireAt))
            }
          }
        },
        {prop: 'createdTime', label: '创建时间', noScope: true, align: 'center',
          formatData: (createdTime) => {
            if (createdTime) {
              return $J.formatDate('Y-m-d', parseTime(createdTime))
            }
          }
        },
        {label: '操作', active: [
            {name: '删除', icon: 'el-icon-delete', color: '#ff4d4f', handle: (row) => this.handleDelete(row)},
          ],
        },
      ],
    }
  },
  mounted() {
    this.getBurnNotes()
  },
  methods: {
    getBurnNotes() {
      this.tableLoading = false
      getBurnNotes().then((res) => {
        this.burnNoteList = res.data;
      }).finally(() => {
        this.tableLoading = false
      })
    },
    create() {
      // 跳转到创建页面
      window.open("/b", '_blank')
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteBurnNote(row.id)
      })
    },
    deleteBurnNote(id) {
      deleteBurnNote(id).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.getBurnNotes()
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";
@import "src/styles/element-ui";

</style>
