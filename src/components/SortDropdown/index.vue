<template>
  <el-dropdown
    size="medium"
    style="height: 40px;"
    @command="handleCommand"
  >
    <div>
      <el-button round type="text" class="sort">
        <svg-icon
          v-if="currentSortOrder === 'descending'"
          icon-class="sort-amount-down-solid"
        />
        <svg-icon v-else icon-class="sort-amount-up-alt-solid" />
        <span class="sort-name">{{ currentSortName }}</span>
      </el-button>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item in allSortOptions"
        :key="item.key"
        :command="item.command"
        :divided="item.order === 'ascending' && item.key !== 'name-asc'"
      >
        <span :class="{ 'al-file-sort-item': true, active: sortable.prop === item.prop && sortable.order === item.order }">
          <i :class="['al-file-sort-item-icon', (sortable.prop === item.prop && sortable.order === item.order) ? (sortable.order === 'ascending' ? 'el-icon-top' : 'el-icon-bottom') : '']" ></i>
          <span>{{ item.label }}</span>
        </span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'SortDropdown',
  props: {
    // 当前排序状态
    sortable: {
      type: Object,
      required: true,
      validator(value) {
        return value && typeof value.prop === 'string' && typeof value.order === 'string'
      }
    },
    // 排序选项配置
    sortOptions: {
      type: Array,
      default: () => [
        { command: 'orderName', prop: 'name', title: '名称' },
        { command: 'orderSize', prop: 'size', title: '大小' },
        { command: 'orderUploadDate', prop: 'uploadDate', title: '上传时间' },
        { command: 'orderUpdateDate', prop: 'updateDate', title: '修改时间' }
      ]
    }
  },
  computed: {
    // 生成完整的排序选项（包含顺序和倒序）
    allSortOptions() {
      return this.sortOptions.flatMap(option => [
        {
          key: `${option.prop}-asc`,
          command: `${option.command}-ascending`,
          prop: option.prop,
          order: 'ascending',
          title: option.title,
          label: `${option.title} - 顺序`
        },
        {
          key: `${option.prop}-desc`,
          command: `${option.command}-descending`,
          prop: option.prop,
          order: 'descending',
          title: option.title,
          label: `${option.title} - 倒序`
        }
      ])
    },
    // 当前排序字段的显示名称
    currentSortName() {
      const currentOption = this.sortOptions.find(option => option.prop === this.sortable.prop)
      return currentOption ? currentOption.title : ''
    },
    // 当前排序方向
    currentSortOrder() {
      return this.sortable.order
    }
  },
  methods: {
    handleCommand(command) {
      const [prop, order] = command.split('-')
      // 向父组件发送排序数据
      this.$emit('sort-change', prop, order)
    }
  }
}
</script>

<style scoped>
.sort {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sort-name {
  margin-left: 4px;
}

.al-file-sort-item {
  display: flex;
  align-items: center;
  width: 100%;
}

.al-file-sort-item.active {
  color: #409eff;
  font-weight: bold;
}

.al-file-sort-item-icon {
  margin-right: 8px;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* 确保图标和文字垂直对齐 */
.al-file-sort-item-icon >>> svg {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}
</style>
