<template>
  <div class="container">
    <el-card class="box-card table-search-header">
      <div slot="header">
        <div class="box-card-header">
          <el-form size="medium" class="search-form" ref="queryForm" label-width="77px" :model="queryCondition"
                   @submit.native.prevent>
            <el-row :gutter="10">
              <el-col v-if="!isLoginType" :sm="12" :md="isLoginType ? 8 : 4">
                <el-form-item label="日志类型:">
                  <el-select v-model="typeValue" style="width: 100%" :disabled="isLoginType" placeholder="请选择日志类型" @change="selectType">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="isLoginType ? 8 : 5">
                <el-form-item label="账号:">
                  <el-input clearable placeholder="请输入" v-model="queryCondition.username" @keyup.enter.native="queryLogList" @clear="queryLogList"/>
                </el-form-item>
              </el-col>
              <el-col v-if="!isLoginType" :sm="12" :md="isLoginType ? 8 : 5">
                <el-form-item label="ip:">
                  <el-input clearable placeholder="请输入" v-model="queryCondition.ip" @keyup.enter.native="queryLogList" @clear="queryLogList"/>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="isLoginType ? 8 : 5">
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
              <el-col :sm="12" :md="isLoginType ? 8 : 5">
                <div class="el-form-actions">
                  <el-radio-group v-model="queryCondition.excludeUsername" size="medium" @change="queryLogList">
                    <el-radio-button :label="undefined">所有人</el-radio-button>
                    <el-radio-button label="other">其他人</el-radio-button>
                  </el-radio-group>
                  <el-button class="card-btn-icon" size="medium" icon="el-icon-search" type="primary"
                             @click="queryLogList">查询
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <table-list
        ref="tableList"
        :less-client-height="245"
        :tableData="dataList"
        :loading="loading"
        :hasSelection="false"
        :tableHeader="tableHeader"
        :page-index="pageIndex"
        :pagination="pagination"
        @pageChange="pageChange"
        @sizeChange="pageChange"
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
      pageIndex: 1,
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      options: [{
        value: 'LOGIN',
        label: '登录'
      }, {
        value: 'OPERATION',
        label: '操作'
      }, {
        value: 'ARTICLE',
        label: '文章'
      }, {
        value: 'WEBDAV',
        label: 'WebDAV'
      }],
      typeValue: this.type,
      isLoginType: this.type === 'LOGIN',
      // 查询条件
      queryCondition: {
        excludeUsername: 'other',
        username: undefined,
        ip: undefined,
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
      this.queryLogList()
    },
    //分页导航
    pageChange(data) {
      this.pagination = data.backData;
      this.getLogList()
    },
    selectType() {
      this.queryCondition.type = this.typeValue
      if (this.typeValue === 'ARTICLE') {
        this.tableHeader[0].disabled = true
        this.tableHeader[1].disabled = true
        this.tableHeader[3].disabled = true
        this.tableHeader[5].minWidth = 200
      } else {
        this.tableHeader[0].disabled = false
        this.tableHeader[1].disabled = false
        this.tableHeader[3].disabled = false
        this.tableHeader[5].minWidth = 105
      }
      this.queryLogList()
    },
    queryLogList() {
      if (this.queryCondition.username) {
        this.queryCondition.excludeUsername = null;
      } else {
        this.queryCondition.excludeUsername = 'other';
      }
      this.$refs.tableList.initPageIndex()
      this.getLogList()
    },
    getLogList() {
      if (this.pickerValue != null && this.pickerValue.length > 0) {
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

>>> .el-range-editor--medium {
  width: 100%;
}
</style>
