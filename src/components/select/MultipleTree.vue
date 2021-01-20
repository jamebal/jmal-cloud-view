<template>
  <el-select
    ref="treeSelect"
    size="mini"
    :value="valueTitles"
    :clearable="clearable"
    multiple
    collapse-tags
    :placeholder="placeholder"
    @clear="clearHandle"
    @remove-tag="removeTag"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
      <el-tree
        class="multiple-tree"
        ref="selectTree"
        node-key="id"
        :data="options"
        :props="props"
        icon-class="-"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        :check-strictly="true"
        :highlight-current="false"
        :default-expand-all="true"
        :default-checked-keys="value"
        show-checkbox
        @check="selectNode"
      >
      </el-tree>
  </el-select>
</template>

<script>
export default {
  name: "MultipleTreeSelect",
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
      type: Array,
      default: ()=>{ return [] }
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
      default:()=>{return "请选择"}
    }
  },
  data() {
    return {
      valueIds: this.value,    // 初始值
      valueTitles: [],
      data: [],
    }
  },
  mounted(){
    this.initHandle()
  },
  methods: {
    // 初始化值
    initHandle(){
      if(this.valueIds){
        this.$nextTick(() => {
          this.$refs.selectTree.setCheckedKeys(this.valueIds)
          if(this.valueIds.length > 0){
            this.valueTitles = this.$refs.selectTree.getCheckedNodes().map(node => node.name)
          } else {
            this.valueTitles = []
          }
        })
      }
      this.initScroll()
    },
    // 初始化滚动条
    initScroll(){
      this.$nextTick(()=>{
        let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => ele.style.width = 0)
      })
    },
    selectNode(props, data){
      this.valueIds = data.checkedKeys
      this.valueTitles = data.checkedNodes.map(node => node.name)
      this.$emit('input', this.valueIds)
    },
    // 移除选中项
    removeTag(name) {
      this.valueTitles = this.valueTitles.filter(valueTitle => valueTitle !== name)
      let checkKeys = this.$refs.selectTree.getCheckedKeys();
      let removeKey = this.$refs.selectTree.getCheckedNodes().filter(node => node.name === name)[0].id
      checkKeys = checkKeys.filter(key => key !== removeKey)
      this.valueIds = checkKeys
      this.$refs.selectTree.setCheckedKeys(checkKeys)
      this.$emit('input', this.valueIds)
    },
    // 清除选中
    clearHandle(){
      this.valueTitles = []
      this.valueIds = []
      this.$refs.selectTree.setCheckedKeys([])
      this.$emit('input', this.valueIds)
    }
  },
  watch: {
    value(value){
      this.valueIds = value
      this.initHandle()
    }
  },
};
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected{
  font-weight: normal;
}
</style>
