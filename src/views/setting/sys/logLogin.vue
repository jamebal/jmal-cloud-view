<template>
  <div>
    <log-list type="LOGIN" :table-header="tableHeader"></log-list>
  </div>
</template>

<script>
import LogList from "@/views/setting/sys/logList";

export default {
  components: {
    LogList
  },
  data() {
    return {
      tableHeader: [
        {prop: 'username',label: '账号', sortable: 'custom'},
        {prop: 'showName',label: '用户名', sortable: 'custom'},
        {prop: 'ip',label: 'IP地址', sortable: 'custom'},
        {prop: 'ipInfo', label: '归属地', noScope: true, align: 'left',
          formatData: (ipInfo)=> {
            return ipInfo ? [ipInfo.country, ipInfo.city].filter(Boolean).join(' ') : '';
          }
        },
        {prop: 'operatingSystem',label: '操作系统', sortable: 'custom'},
        {prop: 'browser',label: '浏览器', sortable: 'custom'},
        {prop: 'status', minWidth: 80, label: '状态', tag: true,
          formatData: (status)=> {
            if(status === 0) {
              return [{name: '登录成功', type: 'success'}]
            } else {
              return [{name: '登录失败', type: 'danger'}]
            }
          }
        },
        {prop: 'remarks',label: '备注', sortable: 'custom'},
        {prop: 'createTime',label: '创建时间', minWidth: 150, sortable: 'custom'},
      ],
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
