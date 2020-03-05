<template>
    <mavon-editor
      v-model="content"
      :subfield="false"
      :boxShadow="false"
      defaultOpen="preview"
      :toolbarsFlag="false"
    />
</template>



<script>
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  export default {
    // 注册
    components: {
      mavonEditor,
    },
    data() {
      return {
        content:'# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd\n' +
          '# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd# 一级标题\n' +
          '## 二级标题\n' +
          '### 三级标题\n' +
          '#### 四级标题\n' +
          '##### 五级标题\n' +
          '###### 六级标题\n' +
          '==标记==\n' +
          '|column1|column2|column3|\n' +
          '|-|-|-|\n' +
          '|content1|content2|content3|\n' +
          'dsafsdfsadf sacasdca\n' +
          '> sdfasdfasd',
        html:'',
      }
    },
    methods: {
    },
    mounted() {

    }
  }
</script>
