<template>
  <div class="container" v-wechat-title="title">
    <el-dialog class="dialog-cm" :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="managerForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" />
        </el-form-item>
        <el-form-item label="分类缩略名">
          <el-input v-model="form.thumbnailName" />
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="form.parentCategoryName"
            :options="categories"
            :props="{ checkStrictly: true }"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input type="textarea" v-model="form.desc" />
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" @click.native.prevent="onSave('managerForm')">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分类列表</span>
        <el-button class="card-button" type="text" @click="add">添加分类</el-button>
      </div>
      <el-table
        :data="categoryList"
        stripe
      >
        <el-table-column
          prop="categoryName"
          label="名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="subCategoryNumber"
          label="子分类"
          width="150">
        </el-table-column>
        <el-table-column
          prop="quota"
          label="缩略名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="quota"
          label="默认"
          width="150">
        </el-table-column>
        <el-table-column
          prop="quota"
          label="文章数"
          width="150">
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button v-if="scope.row.username !== 'jmal'"
              size="mini"
              @click="handleEdit(scope.row.id,scope.row.username)"
            >
              编辑
            </el-button>
            <el-button v-if="scope.row.username !== 'jmal'"
              size="mini"
              @click="resetPassword(scope.row.id,scope.row.username)"
            >
              重置密码
            </el-button>
            <el-button v-if="scope.row.username !== 'jmal'"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  import categoryApi from "@/api/category";
  import CropperDialog from '@/components/Cropper/dialog'

  export default {
    name: 'categoryManager',
    components: {
      CropperDialog
    },
    props: {
    },
    data() {
      return {
        title: "分类管理",
        categoryList: [],
        dialogVisible: false,
        dialogTitle: '',
        userUpdateLoading: false,
        valid: true,
        categories: [
          { value: 'zhinan',
            label: '指南',
            children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]}]
          }
        ],
        form: {
          categoryName: '',
          thumbnailName: '',
          parentCategoryName: '',
          desc: ''
        },
        rules: {
          categoryName: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ]
        },
        editMove: 1,// 1添加,2修改
      }
    },
    computed: {
    },
    mounted() {
      this.getCategories()
    },
    methods: {
      getCategories(){
        categoryApi.categories().then(res => {
          this.categoryList = res.data
        })
      },
      async add() {
        this.dialogVisible = true
        this.dialogTitle = '添加分类'
        this.editMove = 1
        await this.$nextTick()
        this.$refs.managerForm.resetFields()
      },
      // 设置formData
      setFormData() {
        let data = new FormData();
        for (let formKey in this.form) {
          if(this.form.hasOwnProperty(formKey)){
            data.append(formKey,this.form[formKey])
          }
        }
        return data
      },
      // 保存
      onSave() {
        this.$refs.managerForm.validate((valid) => {
          this.valid = valid
          console.log(valid)
          if (valid) {
            console.log(this.form, this.setFormData())
            this.userUpdateLoading = true
            if(this.editMove === 1){
              this.addCateGory(this.setFormData())
            }
            if(this.editMove === 2){
              this.userCateGory(this.setFormData())
            }
          } else {
            return false;
          }
        });
      },
      handleEdit(id) {
        this.editMove = 2
        this.dialogVisible = true
        this.dialogTitle = '修改分类'
        categoryApi.categoryInfo({
          id: id,
        }).then(res => {
          this.form = res.data
        })
        categoryApi.categoryTree({username: this.$store.state.user.userId}).then(res => {
          this.categories = res.data
        })
      },
      // 删除分类
      handleDelete(id) {
        this.$confirm('是否删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          categoryApi.delete(id).then(() => {
            this.onSuccess('删除成功!')
          }).catch(() => {
            this.onError()
          })
        })
      },
      // 修改分类
      userCateGory(data){
        categoryApi.update(data).then(() => {
          this.onSuccess()
        }).catch(() => {
          this.onError()
        })
      },
      // 添加分类
      addCateGory(data){
        categoryApi.add(data).then(() => {
          this.onSuccess()
        }).catch(() => {
          this.onError()
        })
      },
      onSuccess(message){
        this.getUserList()
        let msg = '保存成功!'
        if(message){
          msg = message
        }
        this.userUpdateLoading = false
        this.dialogVisible = false
        this.$message({
          message: msg,
          type: 'success',
          duration: 1000
        })
      },
      onError() {
        this.userUpdateLoading = false
      }
    }
  }
</script>

<!--<style src="@styles/cropper.css"></style>-->
<style lang="scss" scoped>
@import "src/styles/setting";
  .card-button {
    float: right;
    padding: 3px 0;
  }
</style>
