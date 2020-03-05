<template>
  <div v-html="htms"></div>
</template>

<script>
  import showdown from "showdown"
  let converter = new showdown.Converter();
  export default {
    data() {
      return {
        htms: ""
      }
    },
    created() {
      this.setMakedown()
    },
    methods: {
      setMakedown() {
        this.htms = converter.makeHtml('# 标题\n' +
          '```java\n' +
          '/***\n' +
          '     * 重命名\n' +
          '     * @param username\n' +
          '     * @param id\n' +
          '     * @return\n' +
          '     */\n' +
          '    @Override\n' +
          '    public ResponseResult<Object> rename(String newFileName, String username, String id) {\n' +
          '        FileDocument fileDocument = mongoTemplate.findById(id, FileDocument.class, COLLECTION_NAME);\n' +
          '        if (fileDocument != null) {\n' +
          '            String currentDirectory = getUserDirectory(fileDocument.getPath());\n' +
          '            String filePath = rootPath + File.separator + username + currentDirectory;\n' +
          '            File file = new File(filePath + fileDocument.getName());\n' +
          '            if(fileDocument.getIsFolder()){\n' +
          '                Query query = new Query();\n' +
          '                String searchPath = currentDirectory + fileDocument.getName();\n' +
          '                String newPath = currentDirectory + newFileName;\n' +
          '                query.addCriteria(Criteria.where("path").regex("^"+searchPath));\n' +
          '                List<FileDocument> documentList = mongoTemplate.find(query, FileDocument.class, COLLECTION_NAME);\n' +
          '                // 修改该文件夹下的所有文件的path\n' +
          '                documentList.parallelStream().forEach(rep -> {\n' +
          '                    String path = rep.getPath();\n' +
          '                    String newFilePath = replaceStart(path, searchPath, newPath);\n' +
          '                    Update update = new Update();\n' +
          '                    update.set("path",newFilePath);\n' +
          '                    Query query1 = new Query();\n' +
          '                    query1.addCriteria(Criteria.where("_id").is(rep.getId()));\n' +
          '                    mongoTemplate.upsert(query1, update, COLLECTION_NAME);\n' +
          '                });\n' +
          '            }\n' +
          '            if (renameFile(newFileName, id, filePath, file)) {\n' +
          '                return ResultUtil.error("重命名失败");\n' +
          '            }\n' +
          '            return ResultUtil.success(true);\n' +
          '        } else {\n' +
          '            return ResultUtil.error("数据库查询失败");\n' +
          '        }\n' +
          '    }\n' +
          '```\n')
      }
    }
  }
</script>
