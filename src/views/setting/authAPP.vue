<template>
  <div class="app-container">
    <el-alert
      v-if="accessToken"
      title="新的操作令牌生成成功！您必须立即复制到一个安全的地方, 因为该令牌只会显示一次!"
      type="success"
      center
      :closable="false">
    </el-alert>
    <el-alert
      v-if="accessToken"
      :title="accessToken"
      center
      type="info"
      :closable="false">
    </el-alert>
    <el-dialog class="dialog-cm" width="500px" :title="dialogTitle" :close-on-click-modal="false" :visible.sync="dialogVisible">
      <el-form ref="managerForm" size="medium" :model="form" label-position="left" :rules="rules" label-width="95px" @submit.native.prevent>
        <el-form-item label="令牌名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入令牌名称" @keyup.enter.native="onSave"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" :loading="saveLoading"
                   @click="onSave">保 存
        </el-button>
      </div>
    </el-dialog>
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>管理个人操作令牌</span>
            <el-button class="card-button" size="mini" type="primary" @click="newAccessToken">新增令牌</el-button>
          </div>
        </div>
      </div>
      <div>
        <div class="setting-title-desc">
          <div class="setting-title-desc-text">您可以使用这些以生成的令牌来操作 JmalCloud API。</div>
          <el-divider></el-divider>
        </div>
        <div>
          <ul v-if="accessTokenList.length > 0">
            <li v-for="token in accessTokenList" :key="token.id">
              <div class="token-item">
                <div class="item-icon">
                  <svg-icon icon-class="key"></svg-icon>
                </div>
                <div class="item-content">
                  <div class="item-title">{{ token.name }}</div>
                  <div class="item-desc">
                    <span>增加于</span> <span>{{ token.createTime }}</span>
                    <i> <svg-icon v-if="token.lastActiveTime" icon-class="zuijinhuoyue"></svg-icon><i v-if="!token.lastActiveTime" class="el-icon-info"></i>{{ token.lastActiveTime ? '最近活动于 '+token.lastActiveTime : '没有最近活动'}}
                    </i>
                  </div>
                </div>
                <div class="item-active">
                    <el-button type="danger" size="small" @click="deleteToken(token.id)">删除令牌</el-button>
                </div>
              </div>
              <el-divider></el-divider>
            </li>
          </ul>
          <div v-else class="empty-text">暂无令牌</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

import settingApi from "@/api/setting-api";

export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '新增令牌',
      accessTokenList: [],
      accessToken: undefined,
      form: {
        name: '',
        createTime: '',
        lastActiveTime: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入令牌名称', trigger: 'blur'},
        ]
      },
      saveLoading: false,
    }
  },
  mounted() {
    this.getAccessTokenList()
  },
  methods: {
    getAccessTokenList(){
      settingApi.getAccessTokenList().then((res) => {
        this.accessTokenList = res.data
      })
    },
    newAccessToken(){
      this.dialogVisible = true
    },
    onSave() {
      this.$refs.managerForm.validate((valid) => {
        this.valid = valid
        if (valid) {
          this.saveLoading = true
          settingApi.generateAccessToken({tokenName: this.form.name}).then((res) => {
            this.accessToken = res.data
            this.saveLoading = false
            this.dialogVisible = false
            this.getAccessTokenList();
          }).catch(() => {
            this.saveLoading = false
          })
        } else {
          return false;
        }
      })
    },
    deleteToken(id) {
      this.$confirm('您确定要删除此令牌吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          settingApi.deleteAccessToken({id: id}).then(()=>{
            this.getAccessTokenList()
            this.$notify({
              title: '删除成功',
              type: 'success',
              duration: 1000
            })
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";
>>>.el-alert {
  margin-bottom: 15px;
  .el-alert__content {
    padding: 5px 8px;
  }
  .el-alert__title{
    font-size: 1rem;
  }
}
.token-item {
  display: flex;
  height: 80px;
  line-height: 80px;
  .item-icon {
    font-size: 2.5rem;
    padding: 0 20px;
  }
  .item-content {
    width: 100%;
    padding: 15px 0;
    .item-title {
      height: 30px;
      line-height: 30px;
      font-size: 1.2rem;
    }
    .item-desc {
      color: #888;
      height: 20px;
      line-height: 20px;
    }
  }
  .item-active {
    padding: 0 20px;
  }
}
.empty-text {
  text-align: center;
  padding: 20px 0 10px 0;
  color: #999;
}
</style>
