<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>网盘设置</span>
          </div>
        </div>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本设置" name="1">
            <div v-if="activeName === '1'">
              <div class="config-itme-label">网盘名称：
                <el-input placeholder="请输入网盘名称" v-model="netdiskName" minlength="1" maxlength="8" size="medium"
                          :style="{width: inputNetdiskNameWidth+'px'}"
                          @keyup.enter.native="updateNetdiskName" @input="inputNetdiskName">
                  <el-button v-if="showAckBtn" slot="append" icon="el-icon-check" @click="updateNetdiskName"></el-button>
                </el-input>
              </div>
              <div class="config-itme-label logo">网盘Logo：
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <Logo v-model="logoFileName" width="80" class="avatar"></Logo>
                </el-upload>
              </div>
              <span class="instruction">点击更换Logo</span>
              <div class="config-itme-label">启用webp：
                <el-switch
                  v-model="webpEnabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="webpChange"
                >
                </el-switch>
              </div>
              <span class="instruction">
          将图片转换为webp格式存储，在不降低图片质量的情况下，极大降低图片文件的体积，建议开启.
          <a href="https://baike.baidu.com/item/webp%E6%A0%BC%E5%BC%8F" target="_blank">什么是webp?</a>
          </span>
              <div class="config-itme-label">网盘同步：
                <el-button class="sync-button" size="mini" :loading="syncLoading" type="primary" @click="sync()"><i
                  class="el-icon-refresh"></i>
                </el-button>
                <span v-show="syncPercent < 100">{{ syncPercent }}%</span>
              </div>
              <span class="instruction">一般用于初始化操作, 将文件数据同步到数据库</span>
              <div class="config-itme-label">重置角色、菜单：
                <el-button class="sync-button" size="mini" :loading="resetLoading" type="danger"
                           @click="resetMenuAndRole()">
                  <i class="el-icon-refresh-left"></i></el-button>
              </div>
              <span class="instruction">一般用于初始化角色、菜单数据</span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="LDAP认证" name="2" class="setting-tab-panel">
            <div v-if="activeName === '2'">
              <el-form :rules="rules" ref="form" :model="ldapFormData" label-width="120px" size="small"
                       style="width: 450px" autocomplete="off">
                <el-form-item label="功能状态" prop="enable">
                  <el-select v-model="ldapFormData.enable">
                    <el-option
                      v-for="item in ldapStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="LDAP 服务器" prop="ldapServer">
                  <el-input placeholder="例如: ldap.test.com:389" v-model="ldapFormData.ldapServer"></el-input>
                </el-form-item>
                <el-form-item label="Base DN" prop="baseDN">
                  <el-input placeholder="例如: dc=test,dc=com" v-model="ldapFormData.baseDN" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="账号" prop="userDN">
                  <el-input placeholder="管理员账号,例如: cn=admin,dc=test,dc=com" v-model="ldapFormData.userDN" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                  <el-input type="password" placeholder="管理员密码" v-model="ldapFormData.password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" :disabled="ldapTestBtn" v-loading="testLdapConfigLoading" @click="doTestLdapConfig">测试链接</el-button>
                  <span v-if="testLdapConfigResult === 0" class="el-icon-check" style="color: #67C23A"></span>
                  <span v-if="testLdapConfigResult > 0" class="el-icon-close" style="color: #F56C6C"></span>
                </el-form-item>

                <el-form-item label="登录名" prop="loginName">
                  <el-input placeholder="LDAP服务器中对应个人用户名的字段, 例如: uid" v-model="ldapFormData.loginName"></el-input>
                </el-form-item>

                <el-form-item label="默认角色" prop="defaultRoleList">
                  <el-select ref="selectRole" v-model="ldapFormData.defaultRoleList" multiple placeholder="请选择角色">
                    <el-option
                      v-for="item in roleList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" :disabled="ldapSaveBtn" v-loading="saveLdapConfigLoading" @click="saveLdapConfig">保存配置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>

import settingApi, {getSetting} from "@/api/setting-api";
import Bus from "@/assets/js/bus";
import Logo from "@/components/Logo";
import getPageTitle from "@/utils/get-page-title";
import UploadImageInput from "@/components/input/UploadImageInput.vue";
import roleApi from "@/api/role";
import { loadLdapConfig, testLdapConfig, updateLdapConfig} from '@/api/user'

export default {
  components: {UploadImageInput, Logo},
  data() {
    return {
      activeName: '1',
      uploadUrl: `${process.env.VUE_APP_BASE_API}/user/setting/upload_logo?jmal-token=${this.$store.state.user.token}&name=${this.$store.state.user.name}`,
      title: '网盘管理',
      syncLoading: false,
      syncPercent: 100,
      resetLoading: false,
      webpEnabled: false,
      logoFileName: '',
      netdiskName: 'JmalCloud',
      showAckBtn: false,
      inputNetdiskNameWidth: 150,
      logoFileTypeList: ['image/svg+xml', 'image/jpg', 'image/png', 'image/jpeg'],
      ldapFormData: {
        enable: true,
        ldapServer: '',
        defaultRoleList: [],
        baseDN: '',
        userDN: '',
        password: '',
        loginName: ''
      },
      roleList: [],
      ldapStatusOptions: [{
        value: true,
        label: '启用'
      }, {
        value: false,
        label: '禁用'
      }],
      rules: {
        ldapServer: [
          {required: true, message: '请填写LDAP服务器', trigger: 'submit'}
        ],
        defaultRoleList: [
          {required: true, message: '请选择默认角色', trigger: 'submit'}
        ],
        baseDN: [
          {required: true, message: '请填写 Base DN', trigger: 'submit'}
        ],
        userDN: [
          {required: true, message: '请填写 管理员账号', trigger: 'submit'}
        ],
        loginName: [
          {required: true, message: '请填写登录名', trigger: 'submit'}
        ]
      },
      testLdapConfigLoading: false,
      saveLdapConfigLoading: false,
      testLdapConfigResult: -1,
    }
  },
  mounted() {
    this.getWebsiteSetting()
    this.getInfo()
    this.getIsSync()
    Bus.$on('msg/synced', (msg) => {
      this.syncPercent = msg.body
      if (this.syncPercent >= 100) {
        this.syncLoading = false
      }
    })
    if (this.$route.query.tab) {
      this.activeName = this.$route.query.tab
      if (this.activeName === '2') {
        this.getRoleList()
        this.getLdapConfig()
      }
    }
  },
  destroyed() {
    Bus.$off()
  },
  computed: {
    ldapTestBtn() {
      return !(this.ldapFormData.ldapServer.length > 0 && this.ldapFormData.baseDN.length > 0 && (this.ldapFormData.password ? this.ldapFormData.password.length > 0 : false))
    },
    ldapSaveBtn() {
      return !(!this.ldapTestBtn && this.ldapFormData.defaultRoleList.length > 0 && this.ldapFormData.loginName.length > 0)
    }
  },
  methods: {
    doTestLdapConfig() {
      this.testLdapConfigLoading = true
      testLdapConfig(this.ldapFormData).then(() => {
        this.testLdapConfigLoading = false
        this.testLdapConfigResult = 0
        this.$message.success("连接成功")
      }).catch(() => {
        this.testLdapConfigResult = 1
        this.testLdapConfigLoading = false
      });
    },
    saveLdapConfig() {
      this.saveLdapConfigLoading = true
      updateLdapConfig(this.ldapFormData).then(() => {
        this.saveLdapConfigLoading = false
        this.$message.success("保存成功")
      }).catch(() => {
        this.saveLdapConfigLoading = false
      });
    },
    handleClick(tab) {
      this.$router.push({query: {tab: tab.name}})
      if (tab.name === '2') {
        this.getRoleList()
        this.getLdapConfig()
      }
    },
    handleAvatarSuccess(res) {
      if (res.code === 0) {
        this.logoFileName = res.data
        this.$store.dispatch('user/setLogo', {
          netdiskName: this.netdiskName,
          netdiskLogo: this.logoFileName
        }).then(() => {
          Bus.$emit('updateLogo')
        })
      } else {
        this.$message.error(res.message)
      }
    },
    beforeAvatarUpload(file) {
      const correctFormat = this.logoFileTypeList.includes(file.type);
      const isLtOneM = file.size / 1024 < 128;
      if (!correctFormat) {
        this.$message.error('网盘Logo只能是 SVG|JPG|JPEG|PNG 格式!');
      }
      if (!isLtOneM) {
        this.$message.error('网盘Logo大小不能超过 128k!');
      }
      return correctFormat && isLtOneM;
    },
    // 获取网站设置
    getWebsiteSetting() {
      getSetting({userId: this.$store.state.user.userId}).then((res) => {
        if (res.data) {
          if (res.data.netdiskLogo) {
            this.logoFileName = res.data.netdiskLogo
          }
          if (res.data.netdiskName) {
            this.netdiskName = res.data.netdiskName
          }
        }
      })
    },
    getRoleList() {
      roleApi.roleList().then(res => {
        this.roleList = res.data;
      })
    },
    getLdapConfig() {
      loadLdapConfig().then(res => {
        if (res.data) {
          this.ldapFormData = res.data;
        }
      })
    },
    inputNetdiskName(input) {
      if (input) {
        this.showAckBtn = true
        this.inputNetdiskNameWidth = 206
      }
    },
    setInputBlur() {
      this.showAckBtn = false
      this.inputNetdiskNameWidth = 150
    },
    // 修改网盘名称
    updateNetdiskName() {
      if (!this.netdiskName) {
        this.$message.warning("网盘名称不能为空")
        return
      }
      //中文，数字，字母，下划线
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
      if (reg.test(this.netdiskName)) {
        settingApi.updateNetdiskName({netdiskName: this.netdiskName}).then(() => {
          this.$store.dispatch('user/setLogo', {
            netdiskName: this.netdiskName,
            netdiskLogo: this.logoFileName
          }).then(() => {
            Bus.$emit('updateLogo')
            document.title = getPageTitle(this.$route.meta.title)
          })
          this.$message.success("网盘名称 修改成功")
          this.setInputBlur()
        }).catch(() => {
          this.setInputBlur()
        })
      } else {
        this.$message.warning("网盘名称 只能包含中文，数字，字母，下划线")
      }
    },
    getInfo() {
      settingApi.getWebp({userId: this.$store.state.user.userId}).then((res) => {
        this.webpEnabled = !res.data
      })
    },
    getIsSync() {
      settingApi.isSync({username: this.$store.state.user.name}).then((res) => {
        this.syncLoading = true;
        this.syncPercent = res.data
        this.syncLoading = this.syncPercent < 100;
      })
    },
    sync() {
      this.$confirm('是否开始同步? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.syncLoading = true
        this.syncPercent = 0
        settingApi.sync({username: this.$store.state.user.name}).then(() => {
          this.$message.success("开始同步...")
        })
      })
    },
    // 重置角色菜单
    resetMenuAndRole() {
      this.$confirm('您确定要删除当前角色、菜单吗? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetLoading = true
        settingApi.resetMenuAndRole().then(() => {
          this.$message.success("重置完成")
          this.resetLoading = false
        }).catch(() => {
          this.resetLoading = false
        })
      }).catch(() => {
        this.resetLoading = false
      })
    },
    webpChange(webpEnabled) {
      settingApi.disabledWebp({userId: this.$store.state.user.userId, disabled: !webpEnabled}).then(() => {
        webpEnabled ? this.$message.success('webp 已启用') : this.$message.warning('webp 已禁用')
      }).catch(() => {
        this.webpEnabled = !this.webpEnabled
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";

> > > .el-textarea {
  max-width: 1080px;
}

.config-itme-label.logo {
  display: flex;
  line-height: 80px;
}

.netdisk-name {
  width: 220px;
}

.avatar-uploader > > > .el-upload {
  display: block;

  .avatar {
    width: 80px;
    height: 80px;
    display: block;

    &:hover {
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      -o-filter: grayscale(100%);
      filter: grayscale(100%);
      filter: gray;
    }
  }
}

> > > .el-card__body {
  padding: 0;
}

> > > .el-tabs__header {
  margin: 0;
  @media screen and (min-width: 768px) {
    .el-tabs__nav {
      padding: 0 20px;
    }
    .el-tabs__active-bar {
      left: 20px;
    }
  }
}

> > > .el-form-item__content {
  .el-select {
    width: 100%;
  }
}

.setting-tab-panel {
  padding-top: 20px;

  >>> .el-loading-spinner .circular {
    width: 25px !important;
  }
}

</style>
