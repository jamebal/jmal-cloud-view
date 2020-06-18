import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const suffix = {
  simText: [
    'vue','asp','jsp','TXT',
    'xml','xsl','iml','m','bas','prg','cmd',
    'sass','sas','php','lst','key','pem','log',
    'cmake','db','gradle','bat','','conf'
  ],
  compressedFile: [
    'zip','tar','jar','tar.gz','tgz','tar.bz2'
  ],
}

monaco.languages.getLanguages().forEach(language => {
  language.extensions.forEach(ext => {
    suffix.simText.push(ext.substring(1,ext.length))
  })
})

// 换行
export const lineWrapping = [
  'txt'
]

export const iconClass = new Map()
iconClass.set('php','file-php')
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
iconClass.set('pdf','file-pdf')
iconClass.set('zip','zip')
iconClass.set('rar','zip')
iconClass.set('iml','file-idea')
iconClass.set('key','file-key')
iconClass.set('pem','file-pem')
iconClass.set('gz','file-gzip')
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
