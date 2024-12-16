import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const suffix = {
  simText: [
    'vue','asp','jsp','TXT',
    'xml','xsl','iml','m','bas','prg','cmd',
    'sass','sas','php','lst','key','pem','log',
    'cmake','db','gradle','bat','conf','dart','plist', 'cfg', 'ini', 'sql', 'rst', 'toml', 'vbs', 'yml', 'yaml', 'properties', 'gitignore', 'ts'
  ],
  compressedFile: [
    'zip','tar','7z', 'rar', 'jar','tar.gz','tgz','tar.bz2'
  ],
  iframePreviewFile: ['pdf', 'csv', 'drawio', 'mind', 'glb', 'gltf', 'dwg']
}

monaco.languages.getLanguages().forEach(language => {
  language.extensions.forEach(ext => {
    suffix.simText.push(ext.substring(1,ext.length))
  })
})

// onlyOffice支持的文件格式
export const onlyOfficeSupportedFormats = [
  'doc', 'docx', 'odt', 'rtf', 'xls', 'xlsx', 'ods', 'csv', 'ppt', 'ppsx', 'pps', 'odp', 'pptx', 'pdf', 'epub', 'html'
]

// 换行
export const lineWrapping = [
  ''
]

export const iconClass = new Map()
iconClass.set('php','file-php')
iconClass.set('c','file-c')
iconClass.set('js','file-js')
iconClass.set('vue','file-vue')
iconClass.set('xml','file-xml')
iconClass.set('dart','file-dart')
iconClass.set('html','file-html')
iconClass.set('md','file-md')
iconClass.set('txt','file-txt')
iconClass.set('TXT','file-txt')
iconClass.set('css','file-css')
iconClass.set('scss','file-css')
iconClass.set('java','file-java')
iconClass.set('go','file-go')
iconClass.set('DS_Store','file-Ds-store')
iconClass.set('jar','file-jar')
iconClass.set('properties','file-properties')
iconClass.set('conf','file-conf')
iconClass.set('cfg','file-conf')
iconClass.set('ini','file-conf')
iconClass.set('factories','file-factories')
iconClass.set('class','file-class')
iconClass.set('excel','file-excel')
iconClass.set('xls','file-excel')
iconClass.set('xlsx','file-excel')
iconClass.set('gitignore','file-gitignore')
iconClass.set('ncm','file-ncm')
iconClass.set('dmg','file-dmg')
iconClass.set('pkg','file-pkg')
iconClass.set('mpkg','file-pkg')
iconClass.set('exe','file-exe')
iconClass.set('word','file-word')
iconClass.set('doc','file-word')
iconClass.set('docx','file-word')
iconClass.set('docxf','file-docxf')
iconClass.set('ppt','file-ppt')
iconClass.set('pptx','file-ppt')
iconClass.set('drawio','file-drawio')
iconClass.set('csv','file-csv')
iconClass.set('pdf','file-pdf')
iconClass.set('mind','file-mind')
iconClass.set('zip','zip')
iconClass.set('rar','zip')
iconClass.set('7z','zip')
iconClass.set('iml','file-idea')
iconClass.set('key','file-key')
iconClass.set('pem','file-pem')
iconClass.set('gz','file-gzip')
iconClass.set('tar.gz','file-gzip')
iconClass.set('json','file-json')
iconClass.set('tar','file-tar')
iconClass.set('sh','file-shell')
iconClass.set('log','file-log')
iconClass.set('py','file-python')
iconClass.set('cpp','file-cpp')
iconClass.set('h','file-h')
iconClass.set('xsl','file-xsl')
iconClass.set('cmake','file-cmake')
iconClass.set('db','file-db')
iconClass.set('sql','file-db')
iconClass.set('gradle','file-gradle')
iconClass.set('bat','file-bat')
iconClass.set('swift','file-swift')
iconClass.set('yml','file-yml')
iconClass.set('yaml','file-yml')
iconClass.set('plist','file-plist')
iconClass.set('iso','file-iso')
iconClass.set('glb','file-glb')
iconClass.set('gltf','file-glb')
iconClass.set('epub','file-epub')
iconClass.set('dwg','file-dwg')

export function findIconClass(file){
  if(!file){
    return
  }
  if(file.isFolder){
    return 'folder'
  }
  if (file.contentType) {
    if(file.contentType.indexOf('video') > -1){
      return 'video'
    }
    if(file.contentType.startsWith('image')){
      return 'image'
    }
    if(file.contentType.indexOf('audio') > -1){
      return 'audio'
    }
  }
  let suffix = file.suffix;
  if(!suffix && file.name){
    suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  }
  if(iconClass.has(suffix)){
    return iconClass.get(suffix)
  }
  return 'file'
}
