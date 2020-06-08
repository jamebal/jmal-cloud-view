<template>
  <div class="dir-tree">
    <file-tree :directoryTreeData="compressedFileData"></file-tree>
  </div>
</template>

<script>
  import api from '@/api/file-api'
  import FileTree from"@/components/FileTree"
  export default {
    components: {FileTree},
    data() {
      return {
        compressedFileData: []
      }
    },
    mounted() {
      api.listfiles({
        username: this.$store.state.user.name,
        path: "",
        tempDir: this.tempDir
      }).then(res => {
        this.compressedFileData = res.data
      })
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .dir-tree{
    height: 500px;
    width: 250px;
    overflow: auto;
  }
</style>


<!--<template>-->
<!--  <a-directory-tree-->
<!--    :treeData="treeData"-->
<!--    :replaceFields="replaceFields"-->
<!--    :loadData="onLoadData"-->
<!--    @select="onSelect"-->
<!--    @expand="onExpand">-->
<!--  </a-directory-tree>-->
<!--</template>-->
<!--<script>-->
<!--  import api from '@/api/file-api'-->
<!--  import IconFile from "@/components/Icon/IconFile"-->
<!--  import { iconClass,suffix } from '@/utils/file-type'-->
<!--  export default {-->
<!--    components: {IconFile},-->
<!--    mounted() {-->
<!--      this.listFile()-->
<!--    },-->
<!--    data(){-->
<!--      return ({-->
<!--        treeData: [],-->
<!--        replaceFields: {-->
<!--          key: 'path',-->
<!--          title: 'name',-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    methods: {-->
<!--      listFile(){-->
<!--        api.listfiles({-->
<!--          username: this.$store.state.user.name,-->
<!--          path: "",-->
<!--        }).then(res => {-->
<!--          this.treeData = res.data.map(data => {-->
<!--            data.slots = { icon: 'meh' }-->
<!--            return data-->
<!--          })-->
<!--        })-->
<!--      },-->
<!--      onLoadData(treeNode){-->
<!--        return new Promise(resolve => {-->
<!--          if (treeNode.dataRef.children) {-->
<!--            resolve();-->
<!--            return;-->
<!--          }-->
<!--          api.listfiles({-->
<!--            username: this.$store.state.user.name,-->
<!--            path: treeNode.dataRef.path,-->
<!--          }).then(res => {-->
<!--            treeNode.dataRef.children = res.data-->
<!--            this.treeData = [...this.treeData]-->
<!--            resolve()-->
<!--          })-->
<!--        });-->
<!--      },-->
<!--      onSelect(keys, event) {-->
<!--        console.log('Trigger Select', keys, event);-->
<!--      },-->
<!--      onExpand() {-->
<!--        console.log('Trigger Expand');-->
<!--      },-->
<!--    },-->
<!--  };-->
<!--</script>-->
