<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {},
  watch: {
    $route: function(to) {
      const path = to.path
      if (path.indexOf('/login') < 0) {
        if (path === '/_m' && this.$pc) {
          this.$router.push(path.split('_m')[0])
        } else if (path === '/' && !this.$pc) {
          this.$router.push('/_m')
        }
      }
    }
  }
}
</script>
