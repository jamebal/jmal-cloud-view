<template>
  <div>
    <fancy-tree v-if="source.length > 0" :directoryTreeData="source"></fancy-tree>
  </div>
</template>

<script>
  import FancyTree from"@/components/FancyTree"
  import api from '@/api/file-api'
  export default {
    components: {FancyTree},
    data() {
      return {
        source: []
      }
    },
    created() {
      api.listfiles({
        username: this.$store.state.user.name,
        path: "",
        tempDir: this.tempDir
      }).then(res => {
        this.source = res.data
        console.log(this.source)
      })
    },
    mounted() {
      api.listfiles({
        username: this.$store.state.user.name,
        path: "",
        tempDir: this.tempDir
      }).then(res => {
        this.source = res.data
      })
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
</style>

