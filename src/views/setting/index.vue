<template>
  <div class="app-container" v-wechat-title="title">
    <el-tabs type="border-card" :value="tabsDefault" @tab-click="tabClick">
      <el-tab-pane
        :key="item.name"
        v-for="item in tabs"
        :label="item.label"
        :name="item.name"
      >
        <span v-if="item.name === 'cusomerInfo'" slot="label"><i class="el-icon-user"></i>{{item.label}}</span>
        <div v-if="item.name === 'cusomerInfo'">
          <cusomer-info v-if="userInfo" :userInfo="userInfo" @isAdmin="isAdmin"></cusomer-info>
        </div>
        <span v-if="item.name === 'cusomerManager'" slot="label"><i class="el-icon-user-solid"></i>{{item.label}}</span>
        <div v-if="item.name === 'cusomerManager'">
          <cusomer-manager></cusomer-manager>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { getInfo, userUpdate} from '@/api/user'
  import cusomerInfo from '@/views/setting/tabs/cusomerInfo'
  import cusomerManager from '@/views/setting/tabs/cusomerManager'

  export default {
    components: {
      cusomerInfo,cusomerManager
    },
    data() {
      return {
        title: "设置",
        tabs: [
          {name: 'cusomerInfo', label:'个人信息'},
        ],
        adminTabs: [
          {name: 'cusomerManager', label:'用户管理'}
        ],
        tabsDefault: 'cusomerInfo',
        userInfo:{}
      }
    },
    computed: {
    },
    mounted() {
      if(this.$route.query.tab){
        this.tabsDefault = this.$route.query.tab
      }
    },
    methods: {
      tabClick(tab) {
        if(tab.name === 'cusomerManager'){
          // 用户管理
        }
        this.$router.push({path: this.$route.path, query: {tab: tab.name}})
      },
      isAdmin(isAdmin) {
        if(isAdmin){
          this.adminTabs.forEach(tab => {
            if(!this.tabs.includes(tab)){
              this.tabs.push(tab)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
