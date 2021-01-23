<template>
  <el-select
    ref="treeSelect"
    :size="size"
    v-model="valueTitles"
    :clearable="clearable"
    multiple
    :collapse-tags="collapseTags"
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
        default-expand-all
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
    },
    size: {
      type: String,
      default: 'small'
    },
    collapseTags: {
      type:Boolean,
      default:()=>{ return false }
    },
    // 选择后收起下拉框
    selectPackUp: {
      type:Boolean,
      default:()=>{ return false }
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
          const that = this
          setTimeout(function (){
            if(that.valueIds.length > 0){
              that.valueTitles = that.$refs.selectTree.getCheckedNodes().map(node => node.name)
            } else {
              that.valueTitles = []
            }
          }, 100)
        })
      } else {
        this.valueTitles = []
      }
    },
    selectNode(props, data){
      this.valueIds = data.checkedKeys
      this.$emit('input', this.valueIds)
      if(this.selectPackUp){
        this.$refs.treeSelect.blur()
      }
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
  display: none;
}
</style>
