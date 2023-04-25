<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>OSS管理</span>
            <el-button class="card-button" size="mini" type="primary" @click="addOSS">新增</el-button>
          </div>
        </div>
      </div>
      <table-list
        ref="tableOssConfig"
        :has-selection="false"
        :tableData="ossConfigList"
        :less-client-height="210"
        :loading="tableLoading"
        :tableHeader="tableHeader"
      ></table-list>
    </el-card>
    <div>
      <el-dialog class="set-oss-dialog" :title="putOssTitle" :visible.sync="showDialog" :close-on-click-modal="false">
        <el-form :rules="rules" ref="form" :model="formData" label-width="120px" size="small">
          <el-form-item label="Platform" prop="platform">
            <el-select v-model="formData.platform" placeholder="选择平台">
              <el-option
                v-for="item in platforms"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Endpoint" prop="endpoint">
            <el-input v-model="formData.endpoint"></el-input>
          </el-form-item>
          <el-form-item label="Access Key" prop="accessKey">
            <el-input v-model="formData.accessKey"></el-input>
          </el-form-item>
          <el-form-item label="Secret Key" prop="secretKey">
            <el-input type="password" v-model="formData.secretKey"></el-input>
          </el-form-item>
          <el-form-item label="Region" prop="region">
            <el-input v-model="formData.region"></el-input>
          </el-form-item>
          <el-form-item label="Bucket" prop="bucket">
            <el-input v-model="formData.bucket"></el-input>
          </el-form-item>
          <el-form-item label="目录名称" prop="folderName">
            <el-input v-model="formData.folderName"></el-input>
            <div class="form-item-desc">将在根目录下创建此目录，相当于把oss挂载到了此目录</div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm" v-loading="submitLoading">确定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import ossApi from "@/api/oss"
import TableList from "@/components/table/TableList.vue";

export default {
  components: {TableList},
  data() {
    const validateFolderName = async (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入目录名'));
      } else if (/[\[\]\/\\"<>\?\*]/gi.test(value)) {
        callback(new Error('目录名不能包含这些字符:<,>,|,*,?,,/,[,]'));
      } else {
        callback()
      }
    }
    return {
      putOssTitle: '',
      showDialog: false,
      ossConfigList: [],
      tableLoading: false,
      formData: {
        endpoint: "",
        accessKey: "",
        secretKey: "",
        region: "",
        bucket: "",
        folderName: "",
        platform: "",
      },
      submitLoading: false,
      tableHeader: [
        {prop: 'platform', label: '平台', noScope: true, align: 'left',
          formatData: (platform)=> {
            let index = this.platforms.findIndex(item => item.value === platform)
            if (index > -1) {
              return this.platforms[index].label
            }
            return ""
          }
        },
        {prop: 'bucket', label: 'bucket', noScope: true, align: 'left'},
        {prop: 'folderName', label: '目录名', noScope: true, align: 'left'},
        {label: '操作', minWidth: this.$pc ? 0 : 130, active: [
            {name: '修改', icon: 'el-icon-edit', handle: (row) => this.updateOssConfig(row)},
            {name: '删除', icon: 'el-icon-delete', color: '#ff4d4f', handle: (row) => this.deleteOssConfig([row.id])},
          ],
        },
      ],
      platforms: [],
      rules: {
        platform: [
          {required: true, message: '请选择平台', trigger: 'submit'}
        ],
        endpoint: [
          {required: true, message: '请填写Endpoint', trigger: 'submit'}
        ],
        accessKey: [
          {required: true, message: '请填写accessKey', trigger: 'submit'}
        ],
        secretKey: [
          {required: true, message: '请填写secretKey', trigger: 'submit'}
        ],
        region: [
          {required: true, message: '请填写region', trigger: 'submit'}
        ],
        bucket: [
          {required: true, message: '请填写bucket', trigger: 'submit'}
        ],
        folderName: [
          {required: true, validator: validateFolderName, trigger: 'submit'}
        ],
      }
    }
  },
  mounted() {
    this.getPlatformList()
  },
  destroyed() {
  },
  methods: {
    getOssConfigList() {
      ossApi.ossConfigList().then((res) => {
        this.ossConfigList = res.data;
      })
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.putOssConfig()
        } else {
          return false;
        }
      });
    },
    deleteOssConfig(id) {
      ossApi.deleteOssConfig({id: id}).then(() => {
        this.getOssConfigList()
        this.$message.success("删除成功！")
      })
    },
    updateOssConfig(row) {
      this.formData = row
      this.showDialog = true
      this.putOssTitle = '修改OSS'
    },
    putOssConfig() {
      this.submitLoading = true
      this.formData.userId = this.$store.getters.userId
      ossApi.putOssConfig(this.formData).then(() => {
        this.getOssConfigList()
        this.$message.success(this.putOssTitle + "成功！")
        this.showDialog = false
        this.submitLoading = false
      }).catch(() => {
        this.submitLoading = false
      })
    },
    addOSS() {
      this.formData = {}
      this.showDialog = true
      this.putOssTitle = '添加OSS'
    },
    getPlatformList() {
      ossApi.getPlatformList().then((res) => {
        this.platforms = res.data
        this.getOssConfigList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";

> > > .set-oss-dialog {
  .el-dialog {
    max-width: 500px;
  }

  .el-select {
    width: 100%;
  }

  .form-item-desc {
    color: #9f9f9f;
    font-size: 12px;
    line-height: 1;
    padding-top: 2px;
  }
}

> > > .dialog-footer {
  .el-loading-spinner .circular {
    width: 25px !important;
  }
}
</style>
