<template>
  <div class="container">
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
        <el-button round type="primary" :disabled="ldapTestBtn" v-loading="testLdapConfigLoading" @click="doTestLdapConfig">测试链接</el-button>
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
        <el-button round type="primary" :disabled="ldapSaveBtn" v-loading="saveLdapConfigLoading" @click="saveLdapConfig">保存配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import {loadLdapConfig, testLdapConfig, updateLdapConfig} from "@/api/user";
import roleApi from "@/api/role";

export default {
  name: 'LdapConfig',
  props: {
    data: {
      type: Array,
      default: []
    },
  },
  computed: {
    ldapTestBtn() {
      return !(this.ldapFormData.ldapServer.length > 0 && this.ldapFormData.baseDN.length > 0 && (this.ldapFormData.password ? this.ldapFormData.password.length > 0 : false))
    },
    ldapSaveBtn() {
      return !(!this.ldapTestBtn && this.ldapFormData.defaultRoleList.length > 0 && this.ldapFormData.loginName.length > 0)
    }
  },
  data() {
    return {
      ldapFormData: {
        enable: true,
        ldapServer: '',
        defaultRoleList: [],
        baseDN: '',
        userDN: '',
        password: '',
        loginName: ''
      },
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
      roleList: [],
    }
  },
  mounted() {
    this.getRoleList()
    this.getLdapConfig()
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
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 !important;
}
</style>
