<template>
  <di>
    <!--分享-->
    <el-dialog title="分享文件" style="{'font-weight': 600}" :visible.sync="shareDialogVisible"
               @close="shareDialogClose">
      <div>
        <div class="share-content">
          <div class="share-icon">
            <icon-file class="share-icon-font" :item="file" :grid="true" :details="true" :image-url="imageUrl"
                       :audio-cover-url="audioCoverUrl"></icon-file>
          </div>
          <div class="share-filename">
            <span>{{ file.name }}</span>
          </div>
          <div>
            <el-form ref="form" class="share-option" :model="shareOption" label-width="82px" size="mini">
              <el-form-item :label="shareOptionConfig.linkLabel">
                <el-col :span="9" class="share-expires-data" v-if="!shareOptionConfig.shared">
                  <el-form-item prop="expiresDateOption">
                    <el-select size="small" v-model="shareOption.expiresDateOption" @change="expiresDateOptionChange">
                      <el-option label="30天有效" :value="0"></el-option>
                      <el-option label="永久有效" :value="1"></el-option>
                      <el-option label="自定义" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="shareOptionConfig.shared" class="shared-expires-text">到期时间</el-col>
                <el-col :span="1" v-if="!shareOptionConfig.shared">&nbsp</el-col>
                <el-col v-if="shareOption.expiresDateOption === 2" :span="12" class="share-expires-data">
                  <el-form-item prop="expiresDate">
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
                      :picker-options="pickerOptions">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item v-if="!shareOptionConfig.shared" class="share-option-form" label="分享形式" width="100">
                <el-col :span="9">
                  <el-select size="small" v-model="shareOption.isPrivacy">
                    <el-option label="公开链接" :value="false"></el-option>
                    <el-option label="私密链接" :value="true"></el-option>
                  </el-select>
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
                    <el-button slot="reference" class="qrcode-btn tag-share-link" @click="copyShareLink('链接复制成功')"
                               :data-clipboard-text="shareLink">
                      <svg-icon icon-class="qrcode" class="qrcode"/>
                    </el-button>
                  </el-popover>
                </el-input>
                <el-input class="share-link-code" size="small" v-if="shareOptionConfig.shared && shareOption.isPrivacy"
                          readonly="readonly" v-model="extractionCode">
                  <template slot="prepend">提取码</template>
                </el-input>
              </el-col>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" v-if="!shareOptionConfig.shared" type="primary" @click="submitShare"
                   v-loading="generateShareLinkLoading">创建分享
        </el-button>
        <el-button size="small" class="tag-share-link" v-if="shareOptionConfig.shared && shareOption.isPrivacy"
                   @click="copyShareLink('口令复制成功')"
                   :data-clipboard-text="file.name + ' ' + shareLink + ' 提取码：' + extractionCode">复制口令
        </el-button>
        <el-button size="small" class="tag-share-link" v-if="shareOptionConfig.shared" type="primary"
                   @click="copyShareLink('链接复制成功')" :data-clipboard-text="shareLink">复制链接
        </el-button>
      </div>
    </el-dialog>
  </di>
</template>

<script>

import moment from 'moment'
import IconFile from "@/components/Icon/IconFile";
import api from '@/api/file-api'
import Clipboard from "clipboard";
import Icon from "@/components/Icon/Icon.vue";
import QRCode from 'qrcode';


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
      imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail?jmal-token=${this.$store.state.user.token}&name=${this.$store.state.user.name}&id=`,
      audioCoverUrl: `${process.env.VUE_APP_BASE_API}/view/cover?jmal-token=${this.$store.state.user.token}&name=${this.$store.state.user.name}&id=`,
      shareDialogVisible: false,
      generateShareLinkLoading: false,
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
      },
      shareLink: "",
      qrCodeshareLink: "",
      extractionCode: '',
      shareOptionConfig: {
        shared: false,
        linkLabel: "选择有效期",
      }
    }
  },
  watch: {
    status(visible) {
      if (visible) {
        this.shareDialogVisible = true
        if (this.file.shareId) {
          this.shareOptionConfig.shared = true
          this.shareOptionConfig.linkLabel = '分享链接'
          this.setShareLink(this.getShareLink(this.file.shareId))
          this.shareOption.isPrivacy = this.file.isPrivacy
          if (this.file.expireDate) {
            this.shareOption.expiresDate = moment(this.file.expireDate).format('x')
          }
          this.shareOption.expiresDateOption = 2
          this.extractionCode = this.file.extractionCode
        } else {
          this.shareOptionConfig.shared = false
          this.shareOptionConfig.linkLabel = '选择有效期'
          this.shareOption.isPrivacy = false
          this.shareOption.expiresDate = null
          this.shareOption.expiresDateOption = 1
        }
      }
    }
  },
  methods: {
    setShareLink(sahreLink) {
      this.shareLink = sahreLink
      QRCode.toDataURL(sahreLink)
        .then(url => {
          this.qrCodeshareLink = url
        })
        .catch(error => {
          console.error(error)
        })
    },
    shareDialogClose() {
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
        this.createShare(true)
      }
    },
    submitShare() {
      this.$refs.form.validate((valid) => {
        if (valid) {
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
    getShareLink(shareId) {
      return window.location.origin + '/s?s=' + shareId
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
            expireDate = this.timeFormat(this.shareOption.expiresDate)
          }
      }
      api.generate({
        userId: this.$store.state.user.userId,
        fileId: this.file.fileId,
        isFolder: this.file.isFolder,
        expireDate: expireDate,
        isPrivacy: this.shareOption.isPrivacy
      }).then(res => {
        if (res.data) {
          let {shareId, extractionCode} = res.data
          this.setShareLink(this.getShareLink(shareId))
          this.generateShareLinkLoading = false
          this.shareOptionConfig.shared = true
          this.shareOption.expiresDateOption = 2
          this.shareOptionConfig.linkLabel = "分享链接"
          this.extractionCode = extractionCode
          this.$emit('onSuccess', shareId)
          if (update) {
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
          }
        }
      }).catch(() => {
        this.generateShareLinkLoading = false
      })
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

> > > .el-dialog {
  max-width: 460px;

  .el-dialog__title {
    font-weight: 600;
  }
}

.share-icon {
  margin: 20px 0 20px 0;
  text-align: center;

  > > > .icon-favorite {
    display: none;
  }

  > > > .icon-share {
    display: none;
  }

  .share-icon-font > > > .svg-icon {
    font-size: 8rem;
  }
}

.share-filename {
  margin: 25px 0 50px 0;
  text-align: center;
}

.share-option {

  > > > .el-form-item--mini.el-form-item {
    margin-bottom: 10px;
  }

  .share-expires-data {
    > > > .el-input__inner {
      cursor: pointer;
      padding-right: 0;
    }

    > > > .el-date-editor.el-input {
      width: 100%;
    }
  }

  > > > .el-form-item__label {
    line-height: 32px;
  }

  .shared-expires-text {
    text-align: right;
    line-height: 32px;
    padding-right: 5px;
  }
}

> > > .dialog-footer {
  .el-loading-spinner .circular {
    width: 25px !important;
  }
}

.share-link {
  margin-top: -10px;
  margin-bottom: 25px;

  .share-link-code {
    width: 130px;
    margin-top: 10px;

    > > > .el-input-group__prepend {
      padding: 0 10px;
      font-weight: 500;
    }
  }

  .qrcode-btn {
    padding: 12px 10px;
  }

  .qrcode {
    font-size: 1.5rem;
  }

  > > > .el-input__inner {
    background-color: #84858d14;
    text-align: center;
    padding: 0 10px;
  }
}
</style>
