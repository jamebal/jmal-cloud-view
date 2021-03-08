<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

const pcList = ['/','/s']
const mobileList = ['/_m','/_m/','/s_m','/s_m/']
export default {
  name: 'App',
  components: {},
  watch: {
    $route: function(to) {
      const path = to.path
      if(pcList.includes(path) && !this.$pc){
        this.$router.push({path: path+'_m', query: to.query})
      }
      if(mobileList.includes(path) && this.$pc){
        this.$router.push({path: path.split('_m')[0], query: to.query})
      }
    }
  }
}
</script>
