<template>
  <div id="app">
    <viewer v-show="false" 
            :options="options"
            :images="images"
            @inited="inited"
            class="viewer" ref="viewer"
    >
      <template scope="scope">
        <img v-for="src in scope.images" :src="src" :key="src">
        {{scope.options}}
      </template>
    </viewer>
    <button type="button" @click="show">Show</button>
  </div>
</template>
<script>
// /filepreview/1583564534768屏幕快照 22.png?jmal-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJXRUIiLCJpc3MiOiJTZXJ2aWNlIiwiZXhwIjoxNTg2MDY5NDUyLCJpYXQiOjE1ODU0NjQ2NTIsInVzZXJuYW1lIjoiam1hbCJ9.V49aAZ-lI7T4P_eFW-eeI4OMIylOyGUZxyrxv55Xthk&fileIds=5e71989499db019a5747ad95
// /filepreview/1583563260541image-20200304202759093.png?jmal-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJXRUIiLCJpc3MiOiJTZXJ2aWNlIiwiZXhwIjoxNTg2MDY5NDUyLCJpYXQiOjE1ODU0NjQ2NTIsInVzZXJuYW1lIjoiam1hbCJ9.V49aAZ-lI7T4P_eFW-eeI4OMIylOyGUZxyrxv55Xthk&fileIds=5e71989499db019a5747ad97
  import 'viewerjs/dist/viewer.css'
  export default {
    data() {
      return {
        options: {
          initialViewIndex: 0,
          button: true, //右上角关闭按钮
          navbar: 2,
          title: 0,
          toolbar: 0,
          keyboard: false,
          ready: function (e) {
            console.log(e.type);
          },
          show: function (e) {
            console.log(e.type);
          },
          shown: function (e) {
            console.log(e.type);
          },
          hide: function (e) {
            console.log(e.type);
          },
          hidden: function (e) {
            console.log(e.type);
          },
          view: function (e) {
            console.log(e.type);
          },
          viewed: function (e) {
            console.log(e.type);
          },
          zoom: function (e) {
            console.log(e.type);
          },
          zoomed: function (e) {
            console.log(e.type);
          }
        },
        images: ['/filepreview/1583564534768屏幕快照 22.png?jmal-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJXRUIiLCJpc3MiOiJTZXJ2aWNlIiwiZXhwIjoxNTg2MDY5NDUyLCJpYXQiOjE1ODU0NjQ2NTIsInVzZXJuYW1lIjoiam1hbCJ9.V49aAZ-lI7T4P_eFW-eeI4OMIylOyGUZxyrxv55Xthk&fileIds=5e71989499db019a5747ad95',
         '/filepreview/1583563260541image-20200304202759093.png?jmal-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJXRUIiLCJpc3MiOiJTZXJ2aWNlIiwiZXhwIjoxNTg2MDY5NDUyLCJpYXQiOjE1ODU0NjQ2NTIsInVzZXJuYW1lIjoiam1hbCJ9.V49aAZ-lI7T4P_eFW-eeI4OMIylOyGUZxyrxv55Xthk&fileIds=5e71989499db019a5747ad97']  
      }
    },
    methods: {
      inited (viewer) {
        this.$viewer = viewer
      },
      show (viewIndex) {
        let index = 0
        if(viewIndex){
          index = viewIndex
        }
        this.$viewer.index = index
        console.log(this.$viewer)
        this.$viewer.show()
      }
    }
  }
</script>