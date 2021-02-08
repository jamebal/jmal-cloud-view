<template>
  <div class="container">
    <el-card class="box-card table-search-header">
      <div slot="header">
        <div class="box-card-header">
          <el-form size="medium" class="search-form" ref="queryForm" label-width="77px"  :model="queryCondition" @submit.native.prevent>
            <el-row :gutter="10">
              <el-col :sm="12" :md="8">
                <el-form-item label="账号:">
                  <el-input clearable placeholder="请输入" v-model="queryCondition.username" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="9">
                <el-form-item label="时间:" prop="logTime">
                  <el-date-picker
                    v-model="pickerValue"
                    size="medium"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="7">
                <div class="el-form-actions">
                  <el-button class="card-btn-icon" size="medium" icon="el-icon-search" type="primary" @click="getLogList()">查询</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <table-list
        :less-client-height="280"
        :tableData="dataList"
        :loading="loading"
        :hasSelection="false"
        :tableHeader="tableHeader"
        :pagination="pagination"
        @pageChange="pageChange"
        @sortChange="sortChange"
      ></table-list>
    </el-card>

  </div>
</template>

<script>
import logApi from '@/api/log'
import TableList from "@/components/table/TableList";

export default {
  name: 'LogList',
  components: {
    TableList
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    tableHeader: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      dataList: [],
      loading: false,
      // 分页信息
      pagination: {
        pageIndex: 1,
        pageSize: 12,
        pageTotal: 0
      },
      // 查询条件
      queryCondition: {
        username: undefined,
        type: this.type,
        startTime: undefined,
        endTime: undefined
      },
      pickerValue: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  mounted() {
    this.getLogList()
  },
  methods: {
    //表格组件返回排序对象
    sortChange(data) {
      let column = data.backData;
      this.queryCondition.sortProp = column.prop
      this.queryCondition.sortOrder = column.order
      this.getLogList()
    },
    //分页导航
    pageChange(data) {
      this.pagination = data.backData;
      this.getLogList()
    },
    getLogList(){
      if (this.pickerValue.length > 0){
        this.queryCondition.startTime = this.pickerValue[0].getTime()
        this.queryCondition.endTime = this.pickerValue[1].getTime()
      }
      this.loading = true
      logApi.logList({
        page: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        ...this.queryCondition
      }).then(res => {
        this.dataList = res.data
        this.pagination.pageTotal = res.count
        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";
.box-card {
  max-width: 1440px;
}
/deep/.el-range-editor--medium {
    width: 100%;
}
</style>
