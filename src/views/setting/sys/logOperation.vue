<template>
  <div>
    <el-dialog class="dialog-form" width="600px" title="详情" :visible.sync="dialogVisible">
      <el-form size="medium" ref="managerForm" label-width="90px" :model="detailsData">
        <el-row :gutter="10">
          <el-col :sm="12">
            <el-form-item label="操作人:">
              <div>{{ detailsData.showName }}({{ detailsData.username }})</div>
            </el-form-item>
            <el-form-item label="操作模块:">
              <div>{{ detailsData.operationModule }}</div>
            </el-form-item>
            <el-form-item label="设备型号:">
              <div>{{ detailsData.deviceModel }}</div>
            </el-form-item>
            <el-form-item label="浏览器:">
              <div>{{ detailsData.browser }}</div>
            </el-form-item>
            <el-form-item label="方式:">
              <div>{{ detailsData.method }}</div>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="操作时间:">
              <div>{{ detailsData.createTime }}</div>
            </el-form-item>
            <el-form-item label="操作功能:">
              <div>{{ detailsData.operationFun }}</div>
            </el-form-item>
            <el-form-item label="操作系统:">
              <div>{{ detailsData.operatingSystem }}</div>
            </el-form-item>
            <el-form-item label="请求耗时:">
              <div>{{ detailsData.time ? `${detailsData.time}ms` : '' }}</div>
            </el-form-item>
            <el-form-item label="请求状态:">
              <el-tag size="mini" :type="detailsData.status === 0 ? 'success': 'danger'">
                {{ detailsData.status === 0 ? '正常' : '异常' }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col>
            <el-form-item label="IP地址:">
              <div>{{ detailsData.ip + " " + ipInfo }}</div>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="请求地址:">
              <div>{{ detailsData.url }}</div>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="备注:">
              <div>{{ detailsData.remarks }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="small" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <log-list type="OPERATION_FILE" :table-header="tableHeader"></log-list>
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
        {prop: 'username', label: '账号', width: 105, sortable: 'custom'},
        {prop: 'ipInfo', label: 'IP归属地', width: 130, noScope: true, align: 'center',
          formatData: (ipInfo)=> {
            return `${ipInfo.country || ''} ${ipInfo.city || ''}`
          }
        },
        {prop: 'filepath', label: '文件', sortable: 'custom'},
        {prop: 'operationFun', label: '操作功能', sortable: 'custom'},
        {prop: 'url', label: '请求地址', sortable: 'custom'},
        {
          prop: 'status', width: 75, label: '状态', tag: true, sortable: 'custom',
          formatData: (status) => {
            if (status === 0) {
              return [{name: '正常', type: 'success'}]
            } else {
              return [{name: '异常', type: 'danger'}]
            }
          }
        },
        {
          prop: 'time', label: '耗时', width: 100, sortable: 'custom',
          formatData: (time) => {
            return time + 'ms'
          }
        },
        {prop: 'createTime', label: '时间', width: 170, sortable: 'custom'},
        {
          label: '操作', width: 80, active: [
            {name: '详情', icon: 'el-icon-view', handle: (row) => this.details(row)},
          ],
        },
      ],
      dialogVisible: false,
      detailsData: {},
      ipInfo: {}
    }
  },
  methods: {
    details(row) {
      this.detailsData = row
      const ip = row.ipInfo
      this.ipInfo = ""
      if (ip) {
        this.ipInfo = `${ip.country ? ip.country + '|' : ''}${ip.area ? ip.area + '|' : ''}${ip.province ? ip.province + '|' : ''}${ip.city ? ip.city + '|' : ''}${ip.operators ? ip.operators : ''}`
      }
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/setting";

>>> .box-card {
  max-width: 1440px;

  >>> .el-form-item {
    margin-bottom: 20px;
  }
}

>>> .el-form-item {
  margin-bottom: 0px;
}

>>> .el-divider--horizontal {
  margin: 10px 0;
}
</style>
