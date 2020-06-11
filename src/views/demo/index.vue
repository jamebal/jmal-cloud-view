<template>
  <div id="dir-tree">
    <!--<file-tree :directoryTreeData="compressedFileData"></file-tree>-->
  </div>
</template>

<script>

  import $ from "jquery";

  import 'jquery.fancytree/dist/skin-lion/ui.fancytree.less';  // CSS or LESS

  import {createTree} from 'jquery.fancytree';

  import 'jquery.fancytree/dist/modules/jquery.fancytree.edit';
  import 'jquery.fancytree/dist/modules/jquery.fancytree.filter';

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

      const tree = createTree('#dir-tree', {
        extensions: ['edit', 'filter'],
        source: [ { "title": "Node 1", "key": "1" },
          {"title": "Folder 2","key": "2","folder": true,"children": [
              { "title": "Node 2.1", "key": "3" },
              { "title": "Node 2.2", "key": "4" }
            ]}
        ]
      });


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
  #dir-tree{
    height: 500px;
    width: 250px;
    overflow: auto;
  }
</style>

