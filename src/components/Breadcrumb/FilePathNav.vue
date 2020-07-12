<template>
  <el-breadcrumb class="app-breadcrumb" separator="">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in pathList" :key="item.path">
        <a v-if="index===0" class="home-link" @click.prevent="handleLink(item,index)"><svg-icon icon-class="home" style="font-size: 18px;"/></a>
        <!--<span v-if="index===pathList.length-1" class="no-redirect">{{ item.title }}</span>-->
        <!--<a v-if="index > 0 && index < pathList.length-1" @click.prevent="handleLink(item)">{{ item.title }}</a>-->
        <breadcrumb-file-path :pathList="pathList" :item="item" :index="index" @clickLink="handleLink"></breadcrumb-file-path>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script>
  import { strlen, substring10,substring } from '@/utils/number'
  import BreadcrumbFilePath from "@/components/Breadcrumb/BreadcrumbFilePath";
export default {
  name: 'FilePathNav',
  components: {
    BreadcrumbFilePath
  },
  props: {
    path:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pathList: []
    }
  },
  watch: {
    path(path){
      console.log('path', path)
      this.pathList = [{folder:'',path: '/'}]
      let list = path.split('/').filter((item)=>item.length>0)
      list.forEach((pathName,index)=>{
        const item = {
          folder: pathName,
          path: this.getPath(list,index)
        }
        this.pathList.push(item)
      })
    }
  },
  created() {
  },
  methods: {
    strLength(str) {
      return strlen(str)
    },
    substring10(str) {
      return substring10(str)
    },
    substring(str,n){
      return substring(str,n)
    },
    getPath(list,index){
      let path = '/'
      if(list && list.length > index){
        for (let i = 0; i <= index; i++) {
          path += list[i]+'/'
        }
      }
      return path
    },
    handleLink(item) {
      this.$emit('loadPath',item)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
