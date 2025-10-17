<template>
  <div>
    <!--分享-->
    <el-dialog title="分享文件" :style="{ fontWeight: 600 }" :visible.sync="shareDialogVisible"
               @close="shareDialogClose">
      <div>
        <div class="share-content">
          <div class="share-icon">
            <icon-file class="share-icon-font" :item="file" :grid="true" :details="true" :image-url="imageUrl"
                       :audio-cover-url="audioCoverUrl"></icon-file>
          </div>
          <div class="share-filename">
            <a v-if="this.file.shareId" :href="'/?path=' + filenamePath + '&highlight=' + file.name">{{ filename }}</a>
            <span v-else>{{ filename }}</span>
          </div>
          <div>
            <el-form ref="form" class="share-option" :model="shareOption" label-width="86px" size="mini">
              <el-form-item :label="shareOptionConfig.linkLabel">
                <el-col :span="shareOptionConfig.shared ? 9 : 20" class="share-expires-data" v-if="!shareOptionConfig.shared">
                  <el-form-item prop="expiresDateOption" style="margin-bottom: 0">
                    <el-select size="small" v-model="shareOption.expiresDateOption" @change="expiresDateOptionChange" style="width: 100%" :disabled="isSubShare">
                      <el-option label="30天有效" :value="0"></el-option>
                      <el-option label="永久有效" :value="1"></el-option>
                      <el-option label="自定义" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="shareOptionConfig.shared" class="shared-expires-text">到期时间</el-col>
                <el-col :span="1" v-if="!shareOptionConfig.shared">&nbsp</el-col>
                <el-col v-if="shareOption.expiresDateOption === 2" :span="12" class="share-expires-data">
                  <el-date-picker
                    ref="expiresDatePicker"
                    size="small"
                    :clearable="false"
                    v-model="shareOption.expiresDate"
                    type="date"
                    :placeholder="!shareOption.expiresDate ? '永久有效' : '选择到期时间'"
                    align="right"
                    format="yyyy-MM-dd HH:mm"
                    value-format="timestamp"
                    @change="pickerChange"
                    :disabled="isSubShare"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-col>
              </el-form-item>

              <el-form-item v-if="shareOptionConfig.shared" label="">
                <el-col :span="12" class="shared-expires-text">分享形式</el-col>
                <el-col :span="12">
                  <el-select size="small" v-model="shareOption.isPrivacy" style="width: 100%" @change="shareFormChange" :disabled="isSubShare">
                    <el-option label="公开链接" :value="false"></el-option>
                    <el-option label="私密链接" :value="true"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>

              <el-form-item v-if="!shareOptionConfig.shared" class="share-option-form" label="分享形式" width="100">
                <el-col :span="20">
                  <el-select size="small" v-model="shareOption.isPrivacy" style="width: 100%" :disabled="isSubShare">
                    <el-option label="公开链接" :value="false"></el-option>
                    <el-option label="私密链接" :value="true"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>

              <el-form-item v-if="!shareOptionConfig.shared" class="share-option-custom-addr" label="自定义地址" width="100">
                <el-col :span="20">
                  <el-input placeholder="" v-model="shareOption.customAddr">
                    <template #prepend>{{ customAddrPrefix }}</template>
                  </el-input>
                </el-col>
              </el-form-item>

              <el-col class="share-link">
                <el-input size="small" v-if="shareOptionConfig.shared" readonly="readonly" v-model="shareLink">
                  <el-popover
                    slot="append"
                    class="share-link-qrcode"
                    placement="right"
                    trigger="hover"
                    >
                    <img alt="qrcode-share-link" :src="qrCodeshareLink"/>
                    <el-button round slot="reference" class="qrcode-btn tag-share-link" @click="copyShareLink('链接复制成功')"
                               :data-clipboard-text="shareLink">
                      <svg-icon icon-class="qrcode" class="qrcode"/>
                    </el-button>
                  </el-popover>
                </el-input>
                <el-input class="share-link-code" size="small" v-if="shareOptionConfig.shared && shareOption.isPrivacy"
                          readonly="readonly" v-model="extractionCode">
                  <template slot="prepend">提取码</template>
                </el-input>

                <el-collapse v-if="shareOptionConfig.shared && shareOption.isPrivacy" v-model="activeName">
                  <el-collapse-item title="操作权限" name="1">
                    <el-checkbox-group v-model="shareOption.operationPermissionList" @change="permissionActionChange" :disabled="isSubShare">
                      <el-checkbox label="UPLOAD">上传</el-checkbox>
                      <el-checkbox label="PUT">编辑</el-checkbox>
                      <el-checkbox label="DELETE">删除</el-checkbox>
                    </el-checkbox-group>
                  </el-collapse-item>
                </el-collapse>

              </el-col>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button round size="small" v-if="shareOptionConfig.shared" type="danger" @click="cancelShare" :loading="cancelSharing">取消分享</el-button>
        <el-button round size="small" v-if="!shareOptionConfig.shared" type="primary" @click="submitShare"
                   :loading="generateShareLinkLoading">创建分享
        </el-button>
        <el-button round size="small" class="tag-share-link" v-if="shareOptionConfig.shared && shareOption.isPrivacy"
                   @click="copyShareLink('口令复制成功')"
                   :data-clipboard-text="file.name + ' ' + shareLink + ' 提取码：' + extractionCode">复制口令
        </el-button>
        <el-button round size="small" class="tag-share-link" v-if="shareOptionConfig.shared" type="primary"
                   @click="copyShareLink('链接复制成功')" :data-clipboard-text="shareLink">复制链接
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import moment from 'moment'
import IconFile from "@/components/Icon/IconFile";
import api from '@/api/file-api'
import Clipboard from "clipboard";
import Icon from "@/components/Icon/Icon.vue";
import QRCode from 'qrcode';

// 自定义地址只允许中文、字母、数字、下划线、中划线
const URL_PATTERN = /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/

export default {
  name: "ShareDialog",
  components: {
    Icon,
    IconFile
  },
  props: {
    fileId: {
      type: String,
      default: ''
    },
    file: {
      type: Object,
      default: function () {
        return {}
      }
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail?id=`,
      audioCoverUrl: `${process.env.VUE_APP_BASE_API}/view/cover?id=`,
      shareDialogVisible: false,
      generateShareLinkLoading: false,
      cancelSharing: false,
      pickerOptions: {
        disabledDate(time) {
          const dateTime = new Date();
          const startDateTime = dateTime.setDate(dateTime.getDate());
          const endDateTime = dateTime.setDate(dateTime.getDate() + 30000); //30000为当前日期之后多少天
          return (
            time.getTime() < new Date(startDateTime).getTime() ||
            time.getTime() > new Date(endDateTime).getTime()
          );
        },
        firstDayOfWeek: 1,
        shortcuts: [{
          text: '7天后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }, {
          text: '30天后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', date);
          }
        }, {
          text: '半年后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 182.5);
            picker.$emit('pick', date);
          }
        }, {
          text: '一年后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365.5);
            picker.$emit('pick', date);
          }
        }, {
          text: '永久',
          onClick(picker) {
            picker.$emit('pick', 0);
          }
        }]
      },
      shareOption: {
        expiresDateOption: 1,
        isPrivacy: false,
        expiresDate: '',
        operationPermissionList: undefined,
        customAddr: ''
      },
      activeName: "1",
      shareLink: "",
      qrCodeshareLink: "",
      extractionCode: '',
      shareOptionConfig: {
        shared: false,
        linkLabel: "选择有效期",
      },
      filename: '',
      shareId: '',
      isSubShare: false,
    }
  },
  computed: {
    filenamePath() {
      return this.filename.slice(0, this.filename.lastIndexOf('/'))
    },
    customAddrPrefix() {
      return `${window.location.origin}/s/`
    },
  },
  watch: {
    status(visible) {
      if (visible) {
        this.isSubShare = this.file.subShare || (this.file.isShare && !this.file.shareBase) || this.file.fatherShareId
        this.filename = this.file.name
        this.shareDialogVisible = true
        this.shareOption.customAddr = ''
        if (this.file.shareId) {
          api.getFileInfoById({
            id: this.file.fileId
          }).then(res => {
            this.filename = res.data.path + this.file.name
          })
          this.showSharedPage(this.file)
        } else {
          if (this.file.shareBase || this.file.subShare) {
            api.getShareByFileId({fileId: this.file.fileId}).then(res => {
              const shareObject = res.data
              shareObject.shareId = res.data.id
              this.showSharedPage(shareObject)
            })
          } else {
            this.showNotSharedPage(this.file)
          }
        }
      }
    }
  },
  methods: {
    permissionActionChange() {
      this.createShare()
    },
    setShareLink(shareLink) {
      this.shareLink = shareLink
      QRCode.toDataURL(shareLink)
        .then(url => {
          this.qrCodeshareLink = url
        })
        .catch(error => {
          console.error(error)
        })
    },
    showSharedPage(shareObject) {
      this.shareOptionConfig.shared = true
      this.shareOptionConfig.linkLabel = '分享链接'
      this.setShareLink(this.getShareLink(shareObject.shareId, shareObject.shortId))
      this.shareOption.isPrivacy = shareObject.isPrivacy
      this.shareOption.operationPermissionList = shareObject.operationPermissionList || []
      if (shareObject.expireDate) {
        this.shareOption.expiresDate = moment(shareObject.expireDate).format('x')
      }
      this.shareOption.expiresDateOption = 2
      this.extractionCode = shareObject.extractionCode
      this.shareId = shareObject.shareId
    },
    showNotSharedPage(file) {
      this.shareOptionConfig.shared = false
      this.shareOptionConfig.linkLabel = '选择有效期'
      this.shareOption.isPrivacy = false
      this.shareOption.expiresDate = null
      this.shareOption.expiresDateOption = 1
      if (file.isShare) {
        this.shareOption.isPrivacy = file.isPrivacy
        if (file.expiresAt > 253398735999000) {
          this.shareOption.expiresDateOption = 1
        } else {
          this.shareOption.expiresDate = file.expiresAt
          this.shareOption.expiresDateOption = 2
        }
      }
    },
    shareDialogClose() {
      this.cancelSharing = false
      this.shareOptionConfig.shared = false
      this.$emit('update:status', this.shareDialogVisible)
    },
    expiresDateOptionChange() {
      if (this.shareOption.expiresDateOption === 2) {
        this.$nextTick(() => {
          this.$refs.expiresDatePicker.focus()
        })
      }
    },
    pickerChange(time) {
      if (time < new Date().getTime()) {
        this.shareOption.expiresDate = null
      }
      if (this.shareOptionConfig.shared) {
        this.createShare('pickerChange')
      }
    },
    // 切换分享形式
    shareFormChange() {
      if (!this.shareOption.isPrivacy) {
        this.shareOption.operationPermissionList = []
      }
      this.createShare('shareFormChange')
    },
    // 取消分享
    cancelShare() {
      this.cancelSharing = true

      api.hasSubShare({shareIds: [this.shareId]}).then(res => {
        if (res.data) {
          this.$confirm('所选的文件夹下存其他分享，取消分享后其下的所有分享链接都将被删除，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCancelShareLink()
          }).catch(() => {
            this.cancelSharing = false
          })
        } else {
          let title = '确定要取消分享 "' + this.file.name + '" 吗?'
          this.$confirm(title, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doCancelShareLink()
          }).catch(() => {
            this.cancelSharing = false
          })
        }
      }).catch(() => {
        this.cancelSharing = false
      })
    },
    doCancelShareLink() {
      api.cancelShareLink({
        userId: this.$store.state.user.userId,
        shareId: [this.shareId]
      }).then(() => {
        this.$emit('onCancelShare')
        this.shareDialogVisible = false
        this.shareDialogClose()
      }).catch(() => {
        this.cancelSharing = false
      })
    },
    submitShare() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.shareOption.operationPermissionList = undefined
          this.createShare()
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    timeFormat(time) {
      return moment(time).format("yyyy-MM-DD HH:mm")
    },
    getShareLink(shareId, shortId) {
      if (!shortId) {
        shortId = shareId
      }
      return `${window.location.origin}/s/${shortId}`
    },
    createShare(update) {
      this.generateShareLinkLoading = true
      let expireDate
      switch (this.shareOption.expiresDateOption) {
        case 0:
          let time = new Date().getTime() + 3600 * 1000 * 24 * 30
          expireDate = this.timeFormat(time)
          this.shareOption.expiresDate = time
          break
        case 2:
          if (this.shareOption.expiresDate) {
            if (typeof this.shareOption.expiresDate === 'string') {
              this.shareOption.expiresDate = Number(this.shareOption.expiresDate)
            }
            expireDate = this.timeFormat(this.shareOption.expiresDate)
          }
      }
      if (this.shareOption.customAddr && !URL_PATTERN.test(this.shareOption.customAddr)) {
        this.$message({
          message: '地址只允许中文、字母、数字、下划线、中划线',
          type: 'warning',
        })
        this.generateShareLinkLoading = false
        return
      }
      // 检查文件夹下是否有其他分享
      if (this.file.isFolder) {
        api.folderSubShare({fileId: this.file.id}).then(res => {
          if (res.data) {
            this.$confirm('所选的文件夹下存其他分享，创建分享后将会覆盖其下所有已分享的链接参数，是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.doCreateShare(update, expireDate)
            }).catch(() => {
              this.generateShareLinkLoading = false
            })
          } else {
            this.doCreateShare(update, expireDate)
          }
        }).catch(() => {
          this.generateShareLinkLoading = false
        })
      } else {
        this.doCreateShare(update, expireDate)
      }
    },
    doCreateShare(update, expireDate) {
      api.generate({
        shortId: this.shareOption.customAddr,
        userId: this.$store.state.user.userId,
        fileId: this.file.fileId,
        isFolder: this.file.isFolder,
        expireDate: expireDate,
        isPrivacy: this.shareOption.isPrivacy,
        operationPermissionList: this.shareOption.operationPermissionList
      }).then(res => {
        if (res.data) {
          let {shareId, shareBase, subShare, shortId, extractionCode, operationPermissionList} = res.data
          this.setShareLink(this.getShareLink(shareId, shortId))
          this.shareId = shareId
          this.generateShareLinkLoading = false
          this.shareOptionConfig.shared = true
          this.shareOption.expiresDateOption = 2
          this.shareOptionConfig.linkLabel = "分享链接"
          this.extractionCode = extractionCode
          this.shareOption.operationPermissionList = operationPermissionList || []
          this.$emit('onSuccess', shareBase, subShare)
          if (update === 'pickerChange') {
            this.afterPickerChange(shareId, expireDate)
          }
          if (update === 'shareFormChange') {
            this.afterShareFormChange(shareId)
          }
        }
      }).catch(() => {
        this.generateShareLinkLoading = false
      })
    },
    afterPickerChange (shareId, expireDate) {
      if (!expireDate) {
        expireDate = '永久有效'
      }
      this.$emit("onUpdateExpireData", shareId, expireDate);
      this.$message({
        duration: 3000,
        dangerouslyUseHTMLString: true,
        iconClass: 'el-icon-success',
        message: '<strong>&nbsp;&nbsp;有效期已设置为: <span>' + expireDate + '</span> </strong>'
      });
    },
    afterShareFormChange(shareId) {
      this.$emit("onUpdateShareForm", shareId, this.shareOption.isPrivacy);
      this.$message({
        duration: 3000,
        dangerouslyUseHTMLString: true,
        iconClass: 'el-icon-success',
        message: '<strong>&nbsp;&nbsp;链接已设置为: <span>' + (this.shareOption.isPrivacy ? '私密链接' : '公开链接') + '</span> </strong>'
      });
    },
    // 复制分享链接
    copyShareLink(msg) {
      let clipboard = new Clipboard('.tag-share-link')
      clipboard.on('success', e => {
        this.$message({
          message: msg,
          type: 'success',
          duration: 3000
        });
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({
          message: '该浏览器不支持自动复制',
          type: 'warning',
          duration: 1000
        });
        // 释放内存
        clipboard.destroy()
      })
    },
  }
}
</script>

<style lang="scss" scoped>

>>> .el-dialog {
  max-width: 460px;

  .el-dialog__title {
    font-weight: 600;
  }
}

.share-icon {
  margin: 20px 0 20px 0;
  text-align: center;
  position: relative;

  >>>.icon-favorite {
    display: none;
  }

  >>>.icon-share {
    display: none;
  }

  >>>.icon-tag {
    display: none;
  }

  .share-icon-font >>> .svg-icon {
    font-size: 8rem;
  }
}

.share-filename {
  margin: 25px 0 50px 0;
  text-align: center;
  word-break: break-word;
}

.share-option {

  >>> .el-form-item--mini.el-form-item {
    margin-bottom: 10px;
  }

  .share-expires-data {
    >>> .el-input__inner {
      cursor: pointer;
      padding-right: 0;
    }

    >>> .el-date-editor.el-input {
      width: 100%;
    }
  }

  >>> .el-form-item__label {
    text-align: left;
    line-height: 32px;
  }

  .shared-expires-text {
    text-align: right;
    line-height: 32px;
    padding-right: 10px;
  }

  .share-option-custom-addr {
    >>> .el-input-group__prepend {
      padding: 0 8px;
    }
    >>> .el-input__inner {
      padding: 0 8px;
      height: 32px;
      line-height: 32px;
    }
  }

}

>>> .dialog-footer {
  .el-loading-spinner .circular {
    width: 25px !important;
  }
}

.share-link {
  margin-bottom: 25px;

  .share-link-code {
    width: 130px;
    margin-top: 10px;

    >>> .el-input-group__prepend {
      padding: 0 10px;
      font-weight: 500;
    }
  }

  .qrcode-btn {
    padding: 12px 10px;
  }

  .qrcode {
    font-size: 1.5rem;
    color: var(--text-color-hover);
  }

  >>> .el-input__inner {
    background-color: #84858d14;
    text-align: center;
    padding: 0 10px;
  }

  >>> .el-collapse {
    border-top: 0;
  }
}

>>> .el-checkbox {
  cursor: pointer;
}
</style>
