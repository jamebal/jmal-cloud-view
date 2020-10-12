<template>
  <!-- 列表 -->
  <div class="commonTable">

    <el-table
      ref="refTable"
      v-loading="options.loading"
      stripe
      :border="options.border"
      :data="dataSource"
      :height="options.height"
      :max-height="tableHeight"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      :row-style="rowClass"
      :cell-style="options.cellstyle"
      :cell-class-name="options.cellClassName"
      :header-cell-style="options.headerCellStyle"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <!--selection选择框-->
      <el-table-column v-if="options.mutiSelect" type="selection" style="width:50px" align="center"></el-table-column>
      <!--数据源-->
      <template v-for="(column, index) in columnsList">
        <!-- sortable 对应列是否可以排序 -->
        <el-table-column
          v-if="!column.button&&!column.type"
          :key="index"
          :sortable="column.hasSort"
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
          :width="column.width"
        >
          <template slot-scope="scope">
            <span v-if="column.render">
              {{ column.render(scope.row) }}
            </span>
            <span v-else>{{ scope.row[column.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="column.button"
          :key="index"
          header-align="center"
          :sortable="column.hasSort"
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
          :width="column.width"
        >
          <template slot-scope="scope">

            <!-- render button -->
            <template v-for="(btn, i) in column.group">
              <el-button
                :key="i"
                class="theme-btn"
                :type="btn.type"
                :size="btn.size || 'mini'"
                :icon="btn.icon"
                :disabled="btn.disabled"
                :plain="btn.plain"
                :class=" btn.class"
                @click.stop="btn.onClick(scope.row, scope.$index)"
              >{{ btn.name }}</el-button>

            </template>

          </template>
        </el-table-column>
        <!-- 多级表头 -->
        <el-table-column
          v-if="column.type === 'column'"
          :key="index"
          :label="column.label"
          :align="column.align"
          :width="column.width"
        >
          <div v-for="(item, i) in column.multistage" :key="i">
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :align="item.align"
              :width="item.width"
            >
            </el-table-column>
          </div>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="pagination"
      ref="commonPage"
      background
      :total="pagination.total"
      :current-page.sync="pagination.pageIndex"
      :page-sizes="pagination.pageSizes||[5, 10, 20, 50, 100, 500]"
      layout="total, sizes, prev, pager, next, jumper"
      class="commonPagination"
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
    ></el-pagination>
  </div>
  <!-- style="margin-top: 20px;text-align: center" -->
</template>
<script>
export default {
  name: 'Tables',
  components: {
    //
  },
  props: {
    dataSource: {// 表格数据源 默认为空数组
      type: Array,
      default: () => []
    },
    options: {
      mutiSelect: false, // 是否显示复选框
      index: true,
      indexWidth: 70,
      initTable: true, // 是否一挂载就加载数据
      border: false
    }, // // 表格参数控制 maxHeight、stripe 等等...
    columns: {// 表格的字段展示 默认为空数组
      type: Array,
      default: () => []
    },
    fetch: Function, // 获取数据的函数
    pagination: Object // 分页，不传则不显示

  },
  data() {
    return {
      selectRow: [],
      selectData: [],
      tableHeight: null
    }
  },
  computed: {
    columnsList() {
      const columns = this.columns
      const columnsList = []
      columns.forEach((item, index) => {
        if (item.isShow) {
          columnsList.push(item)
        }
      })
      return columnsList
    }

  },
  watch: {
    //
    selectData(data) { // 存储选中的row
      this.selectRow = []
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(this.dataSource.indexOf(item))
        })
      }
    },
    tableHeight(oldData, newData) {
      // console.log(oldData);
      // console.log(newData);
    }
  },
  created() {
    // 传入的options覆盖默认设置
    this.$parent.options = Object.assign({
      maxHeight: 500,
      stripe: true, // 是否为斑马纹
      border: true
    }, this.options)
    this.options.initTable && this.fetch()
  },
  mounted() {
    this.$nextTick(function() {
      if (this.$refs.commonPage) {
        this.tableHeight = window.innerHeight - this.$refs.refTable.$el.getBoundingClientRect().top - this.$refs.commonPage.$el.offsetHeight - 10
      } else {
        this.tableHeight = window.innerHeight - this.$refs.refTable.$el.getBoundingClientRect().top - 10
      }

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        if (self.$refs.commonPage) {
          self.tableHeight = window.innerHeight - self.$refs.refTable.$el.getBoundingClientRect().top - self.$refs.commonPage.$el.offsetHeight - 10
        } else {
          self.tableHeight = window.innerHeight - self.$refs.refTable.$el.getBoundingClientRect().top - 10
          // console.log(self.$refs.refTable)
        }
      }
    })
  },
  methods: {
    onClick(row, index) {
      this.$emit('click', row, index)
    },
    table_index(index) {
      return (this.pagination.noIndex - 1) * this.pagination.pageSize + index + 1
    },
    handleSizeChange(size) { // 切换每页显示的数量
      this.pagination.pageSize = size
      this.fetch()
    },
    handleIndexChange(current) { // 切换页码
      this.pagination.pageIndex = current
      this.fetch()
    },
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection)
      this.selectData = selection
    },
    handleRowClick(row, event, column) {
      this.$emit('row-click', row, event, column)
      if (this.options.mutiSelect) {
        this.$refs.refTable.toggleRowSelection(row)
      }
    },
    btn_click() {

    },
    rowClass({ row, rowIndex }) {
      if (this.selectRow.includes(rowIndex)) {
        return { 'color': '#F5F5F5' }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .redirect {
    color: #97a8be;
  }
  .no-redirect {
    color: #000000;
    cursor: text;
  }

  .el-breadcrumb {
    font-size: 20px;
    line-height: 46px;
  }
  .newFileMenu ul {
    list-style: none;
    padding-inline-start: 0px;
    margin-top: 0;
    margin-bottom: 0;
  }

  .button-class {
    cursor: pointer;
  }

  .button-class:hover {
    border-radius: 5px;
    background-color: #409eff14;
  }

  .newFileMenu li {
    margin: 0;
    padding: 0;
    font-size: 16px;
  }
  .newFileMenu li:hover {
    border-radius: 5px;
    background-color: #409eff14;
  }
  .newFileMenu li > .menuitem {
    cursor: pointer;
    line-height: 44px;
    margin-left: 10%;
  }
  .newFileMenu li > .menuitem > .text {
    margin-left: 5%;font-weight: normal;
  }
  .el-button.is-circle {
    border-radius: 50%;
    padding: 9px;
  }
  /deep/.svg-icon {
    font-size: 28px;
  }
  /deep/.el-table th>.cell {
    padding-left: 15px;
  }
</style>
