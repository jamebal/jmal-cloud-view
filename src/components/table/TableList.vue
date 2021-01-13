<!-- 费用报销编辑弹框 -->
<template>
  <div class="table-temp">
    <el-table
      :data="tableData"
      :max-height="tableMaxHeight"
      row-key="id"
      border
      size="medium"
      fit
      highlight-current-row
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column v-if="hasSelection" type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="" align="center" fixed></el-table-column>
      <!-- prop: 字段名name, label: 展示的名称, fixed: 是否需要固定(left, right), minWidth: 设置列的最小宽度(不传默认值), active: 是否有操作列
      active.name: 操作列字段名称, active.clickFun: 操作列点击事件, formatData: 格式化内容-->
      <el-table-column
        v-for="(item, key) in tableHeader"
        v-if="!item.disabled"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :fixed="item.fixed"
        :width="item.width"
        :min-widitem="item.minWidth"
        :align="item.align || 'center'"
        :sort-orders="['ascending', 'descending']"
        :sortable="item.sortable"
        :show-overflow-tooltip="true"
        tooltip-effect="dark"
      >
          <template slot-scope="scope">
            {{ !item.formatData && !item.active ? scope.row[item.prop] : ''}}
            <div v-if="item.active">
              <el-button
                v-for="(o, key) in item.active"
                :style="{color: o.color}"
                :key="key"
                @click="o.handle(scope.row)"
                :type="o.type || 'text'"
                :icon="o.icon"
                size="medium"
              >{{o.name}}</el-button>
            </div>
            <div v-if="item.formatData">
              <div v-if="item.tag">
                <el-tag size="mini" v-for="tagname in item.formatData(scope.row[item.prop])" :key="tagname">{{tagname}}</el-tag>
              </div>
              <div v-else-if="item.icon">
                <svg-icon :icon-class="item.formatData(scope.row[item.prop])"></svg-icon>
              </div>
              <div v-else>
                <span else>{{ item.formatData(scope.row[item.prop]) || scope.row[item.prop]}}</span>
              </div>
            </div>
          </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        hide-on-single-page
        background
        layout="total, prev, pager, next"
        :current-page="pagination.pageIndex"
        :page-size="pagination.pageSize"
        :total="pagination.pageTotal"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableList',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    lessClientHeight: {
      type: Number,
      default: 0
    },
    tableHeader: {
      type: Array,
      default: function() {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasSelection: {
      type: Boolean,
      default: true
    },
    pagination: {
      type: Object,
      default: {
        pageIndex: 0,
        pageSize: 15,
        pageTotal: 0
      }
    }
  },
  data() {
    return {
      tableMaxHeight: document.documentElement.clientHeight,
      multipleSelection: [],
      newPagination: {
        pageIndex: 0,
        pageSize: 15,
        pageTotal: 0
      }
    };
  },
  mounted() {
    this.setMaxHeight()
    let that = this
    window.onresize = function (){
      that.setMaxHeight()
    }
  },
  methods: {
    setMaxHeight(){
      this.tableMaxHeight = document.documentElement.clientHeight - this.lessClientHeight
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('selectFun', { backData: this.multipleSelection });
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.pagination, 'pageIndex', val);
      //调用父组件方法
      this.$emit('pageChange', { backData: this.pagination});
    },
    // row:本行数据，route：要跳转的路由路径，跳转要传的参数routeId
    handleActive(row, route, routeId) {
      this.$router.push({
        path: '/' + route,
        query: {
          id: row[routeId]
        }
      });
    },
    // 后端排序
    sortChange(column) {
      //调用父组件方法
      this.$emit('sortChange', { backData: column });
    },
  }
}
</script>

<style lang="scss" scoped>
.table-temp {
  /deep/.el-table {
    thead {
      color: #262626;
    }
    th {
      background-color: #fafafa;
    }
    .caret-wrapper {
      height: 16px;
    }
    .sort-caret.ascending {
      top: -4px;
    }
    .sort-caret.descending {
      bottom: -2px;
    }
    .el-tag {
      margin: 0 2px;
    }
    .el-button {
      padding: 0;
    }
  }
  /deep/.el-pagination {
    margin-top: 15px;
    text-align: center;
  }
}
</style>
