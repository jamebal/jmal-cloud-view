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

    </el-card>

    <el-dialog class="set-oss-dialog" title="添加OSS" :visible.sync="showDialog" :close-on-click-modal="false">
      <el-form :rules="rules" ref="form" :model="formData" label-width="120px" size="small">
        <el-form-item label="Platform" prop="platform">
          <el-select v-model="formData.platform" placeholder="选择平台">
            <el-option
              v-for="item in platforms"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Endpoint" prop="endpoint">
          <el-input v-model="formData.endpoint"></el-input>
        </el-form-item>
        <el-form-item label="Access Key" prop="accessKey">
          <el-input type="password" v-model="formData.accessKey"></el-input>
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
        <el-button size="small" type="primary" @click="submitForm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import ossApi from "@/api/oss"

export default {
  data() {
    const validateFolderName = async (rule, value, callback) => {
      await this.existFolderName(value)
      if (value === '') {
        callback(new Error('请输入目录名'));
      } else if (/[\[\]\/\\"<>\?\*]/gi.test(value)) {
        callback(new Error('目录名不能包含以下字符:<,>,|,*,?,,/,[,]'));
      } else if (this.existFolder) {
        callback(new Error('该目录已存在'));
      } else {
        callback()
      }
    }
    return {
      showDialog: false,
      formData: {
        endpoint: "",
        accessKey: "",
        secretKey: "",
        region: "",
        bucket: "",
        folderName: "",
        platform: "",
      },
      platforms: [],
      existFolder: false,
      rules: {
        platform: [
          {required: true, message: '请选择平台', trigger: 'change'}
        ],
        endpoint: [
          {required: true, message: '请填写Endpoint', trigger: 'blur'}
        ],
        accessKey: [
          {required: true, message: '请填写accessKey', trigger: 'blur'}
        ],
        secretKey: [
          {required: true, message: '请填写secretKey', trigger: 'blur'}
        ],
        region: [
          {required: true, message: '请填写region', trigger: 'blur'}
        ],
        bucket: [
          {required: true, message: '请填写bucket', trigger: 'blur'}
        ],
        folderName: [
          {required: true, validator: validateFolderName, trigger: 'submit'}
        ],
      }
    }
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {
    async existFolderName(folderName) {
      this.existFolder = false
      await ossApi.existFolderName({username: this.$store.getters.name, folderName: folderName}).then((res) => {
        this.existFolder = res.data
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
    putOssConfig() {
      this.formData.userId = this.$store.getters.userId
      ossApi.putOssConfig(this.formData).then(() => {
        this.$message.success("添加成功！")
        this.showDialog = false;
      })
    },
    addOSS() {
      ossApi.getPlatformList().then((res) => {
        this.platforms = res.data
      })
      this.showDialog = true
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
</style>
