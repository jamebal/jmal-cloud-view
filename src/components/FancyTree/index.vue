<template>
  <div id="dir-tree">
  </div>
</template>

<script>

  import { iconClass,suffix } from '@/utils/file-type'
  import 'jquery.fancytree/dist/skin-win8/ui.fancytree.less';
  import {createTree} from 'jquery.fancytree';
  import api from '@/api/file-api'
  export default {
    name: "FancyTree",
    props: {
      directoryTreeData: {
        type: Array,
        default: () => []
      },
    },
    data(){
      return {
        tree:{}
      }
    },
    watch: {
      directoryTreeData(newVal,oldVal) {
        this.loadTreeData(newVal,true)
      }
    },
    mounted() {
      this.loadTreeData(this.directoryTreeData)
    },
    computed: {
    },
    methods: {
      loadTreeData(treeData,reLoad) {
        api.listfiles({
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          path: treeData[0].path,
        }).then(res => {
          treeData.map(data => {
            let oldname = data.name
            let pathlist = data.path.split("\/")
            data.name = pathlist[pathlist.length-2]
            data.expanded = true
            data.children = res.data.map(doc => {
              if(oldname === doc.name){
                doc.active = true
              }
              doc.key = doc.path
              doc.title = doc.name
              doc.folder = doc.isFolder
              doc.lazy = doc.isFolder
              return doc
            })
            return data;
          })
          if(reLoad){
            this.tree.reload(this.convert(treeData))
          }else{
            this.initTree(this.convert(treeData))
          }
        })
      },
      initTree(treeData){
        this.tree = createTree('#dir-tree', {
          icon: (event,data)=> this.icon(event,data),
          source: this.convert(treeData),
          lazyLoad: (event,data)=> this.lazyLoad(event,data),
          click: (event,data)=> this.click(event,data),
          activate: (event,data)=> this.activate(event,data),
          loadChildren: function(event, data) {
            // console.log('loadChildren',data)
          },
        });
      },
      icon(event,data) {
        return { html: this.loadSvg(this.findIconClass(data.node.data)) }
      },
      findIconClass(file){
        if(file.isFolder){
          return 'folder'
        }
        if(file.contentType.indexOf('video') > -1){
          return 'video'
        }
        if(file.contentType.indexOf('image') > -1){
          return 'image'
        }
        if(file.contentType.indexOf('audio') > -1){
          return 'audio'
        }
        let suffix = file.suffix;
        if(!suffix && file.name){
          suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
        }
        if(iconClass.has(suffix)){
          return iconClass.get(suffix)
        }
        return 'file'
      },
      loadSvg(svgName){
        let src = require(`@/icons/svg/${svgName}.svg`)
        return `<svg class="tree-icon">${src.default.render()}<use xlink:href="#icon-${svgName}"/></svg>`
      },
      lazyLoad(event, data){
        let nodeData = data.node.data
        data.result = this.lazyLoadData(nodeData)
      },
      lazyLoadData(data){
        const that = this
        return new Promise(function(resolve) {
          api.listfiles({
            username: that.$store.state.user.name,
            path: data.path,
          }).then(res => {
            resolve(that.convert(res.data))
          })
        })
      },
      click(event, data){
        this.$emit('treeNodeClick',data.node.data)
      },
      activate(event, data){

      },
      convert(data){
        return data.map(doc => {
          doc.key = doc.path
          doc.title = doc.name
          doc.folder = doc.isFolder
          doc.lazy = doc.isFolder
          return doc
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #dir-tree{
  }
  /deep/ul.fancytree-container {
    border: unset;
  }
  /deep/.tree-icon{
    position: relative;
    width: 20px;
    height: 20px;
    margin-top: -3px;
    margin-left: -2px;
    padding: 2px;
  }
</style>

