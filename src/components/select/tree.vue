<template>
  <el-select
    ref="treeSelect"
    :value="valueTitle"
    :clearable="clearable"
    filterable
    :placeholder="placeholder"
    @clear="clearHandle"
    :filter-method="filterMethod"
  >
    <el-option :value="valueTitle" :label="valueTitle" class="options">
    </el-option>
      <el-tree  id="tree-option"
                ref="selectTree"
                :accordion="accordion"
                :data="options"
                :props="props"
                empty-text="未找到结果"
                :node-key="props.value"
                highlight-current
                default-expand-all
                :expand-on-click-node="false"
                :default-expanded-keys="defaultExpandedKey"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick">
      </el-tree>
  </el-select>
</template>

<script>
export default {
  name: "TreeSelect",
  props:{
    /* 配置项 */
    props:{
      type: Object,
      default:()=>{
        return {
          value:'id',             // ID字段名
          label: 'name',         // 显示名称
          children: 'children'    // 子级字段名
        }
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options:{
      type: Array,
      default: ()=>{ return [] }
    },
    /* 初始值 */
    value:{
      type: String,
      default: ''
    },
    /* 可清空选项 */
    clearable:{
      type:Boolean,
      default:()=>{ return true }
    },
    /* 自动收起 */
    accordion:{
      type:Boolean,
      default:()=>{ return false }
    },
    placeholder:{
      type:String,
      default:()=>{return "检索关键字"}
    }
  },
  data() {
    return {
      valueId:this.value,    // 初始值
      valueTitle:'',
      defaultExpandedKey:[]
    }
  },
  mounted(){
    this.initHandle()
  },
  methods: {
    // 初始化值
    initHandle(){
      if(this.valueId){
        this.$nextTick(() => {
          // 设置默认选中
          this.$refs.selectTree.setCurrentKey(this.valueId)
          const that = this
          setTimeout(function (){
            // 初始化显示
            that.valueTitle = that.$refs.selectTree.getNode(that.valueId).data[that.props.label]
          }, 100)
          // 设置默认展开
          this.defaultExpandedKey = [this.valueId]
        })
      } else {
        this.valueTitle = ''
      }
    },
    // 切换选项
    handleNodeClick(node){
      this.valueTitle = node[this.props.label]
      this.valueId = node[this.props.value]
      this.defaultExpandedKey = []
      this.$refs.treeSelect.blur()
      this.$emit('input', this.valueId)
    },
    // 清除选中
    clearHandle(){
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('input', '')
    },
    /* 清空选中样式 */
    clearSelected(){
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element)=>element.classList.remove('is-current'))
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    filterMethod(query){
      this.$refs.selectTree.filter(query);
    }
  },
  watch: {
    value(){
      this.valueId = this.value
      this.initHandle()
    }
  },
};
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
  display: none;
}
ul li >>>.el-tree .el-tree-node__content{
  height:auto;
  padding: 0 20px;
}
.el-tree-node__label{
  font-weight: normal;
}
.el-tree >>>.is-current .el-tree-node__label{
  color: #409EFF;
  font-weight: 700;
}
.el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
  color:#606266;
  font-weight: normal;
}
.selectInput{
  padding: 0 5px;
  box-sizing: border-box;
}
</style>
