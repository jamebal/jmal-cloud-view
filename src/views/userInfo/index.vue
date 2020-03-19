<template>
  <div class="app-container">

    <div class="img-dialog" :v-show="dialogVisible">
      <img id="image" :src="form.avater"/>
    </div>



    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="头像" class="form-item-avatar">
        <el-upload
          class="avatar-uploader"
          :action="UploadAvatarURL"
          :show-file-list="false"
          :on-change="addAvatar"
          :auto-upload="false"
          :before-upload="beforeAvatarUpload">
          <img id="imageAvatar" v-if="form.avater" :src="form.avater" class="avatar">
<!--          <el-image v-if="form.avater" class="avatar" :src="form.avater" :fit="cover"></el-image>-->
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="Activity name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import "@/assets/css/cropper.css"
  import Cropper from 'cropperjs'
  import api from '@/api/upload-api'

  export default {
    data() {
      return {
        dialogVisible:false,
        cropper:'',
        UploadAvatarURL: api.simpleUploadAvatarURL,
        form: {
          avater: '',
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    mounted() {
      let _this = this;
      let image = document.getElementById('image');
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        background:false,
        zoomable:false,
        ready: function () {
        }
      });
    },
    methods: {
      onSubmit() {
        this.$message('submit!')
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      addAvatar(file, fileList) {
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        //   return
        // }
        let reader = new FileReader();
        const _this = this
        reader.onload = function (e) {
          _this.form.avater = e.target.result
          _this.dialogVisible = true
          _this.cropper.replace(e.target.result);
        };
        reader.readAsDataURL(file.raw)
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      crop () {
        this.panel = false;
        var croppedCanvas;
        var roundedCanvas;

        if (!this.croppable) {
          return;
        }
        // Crop
        croppedCanvas = this.cropper.getCroppedCanvas();
        console.log(this.cropper)
        // Round
        roundedCanvas = this.getRoundedCanvas(croppedCanvas);
        this.form.avater = roundedCanvas.toDataURL();
      },
    }
  }
</script>

<!--<style src="@styles/cropper.css"></style>-->
<style scoped>
  .line{
    text-align: center;
  }
  .img-dialog {

  }
   /deep/ .avatar-uploader .el-upload {
     border: 1px dashed #d9d9d9;
     width: 100px;
     height: 100px;
     line-height: 100px;
     border-radius: 50%;
     cursor: pointer;
     position: relative;
     overflow: hidden;
   }
  /deep/.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  /deep/.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  /deep/.avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .form-item-avatar {
    line-height: 100px;
  }
</style>
