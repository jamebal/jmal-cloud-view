import JSON5 from 'json5'

export const JSON5_LANGUAGE_ID = 'json5'
const JSON5_MARKER_OWNER = 'json5'

const json5RegisteredMonacoInstances = []

export function registerJson5Language(monacoInstance) {
  if (!monacoInstance || !monacoInstance.languages || json5RegisteredMonacoInstances.includes(monacoInstance)) {
    return
  }

  const languages = monacoInstance.languages
  const hasJson5Language = languages.getLanguages().some(language => language.id === JSON5_LANGUAGE_ID)
  if (!hasJson5Language) {
    languages.register({
      id: JSON5_LANGUAGE_ID,
      extensions: ['.json5'],
      aliases: ['JSON5', 'json5'],
      mimetypes: ['application/json5']
    })
  }

  languages.setMonarchTokensProvider(JSON5_LANGUAGE_ID, {
    defaultToken: '',
    tokenPostfix: '.json5',
    keywords: ['true', 'false', 'null', 'NaN', 'Infinity'],
    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.square' }
    ],
    tokenizer: {
      root: [
        [/[{}[\],:]/, 'delimiter'],
        { include: '@whitespace' },
        [/[$A-Z_a-z][$\w]*(?=\s*:)/, 'attribute.name'],
        [/[$A-Z_a-z][$\w]*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }],
        [/[+-]?0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/[+-]?(?:\d+\.\d*|\.\d+|\d+)(?:[eE][+-]?\d+)?/, 'number'],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@stringDouble' }],
        [/'/, { token: 'string.quote', bracket: '@open', next: '@stringSingle' }]
      ],
      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment']
      ],
      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment']
      ],
      stringDouble: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],
      stringSingle: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape'],
        [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ]
    }
  })

  languages.setLanguageConfiguration(JSON5_LANGUAGE_ID, {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    },
    brackets: [
      ['{', '}'],
      ['[', ']']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    folding: {
      markers: {
        start: /^\s*\/\/\s*#?region\b/,
        end: /^\s*\/\/\s*#?endregion\b/
      }
    }
  })

  if (languages.registerDocumentFormattingEditProvider) {
    languages.registerDocumentFormattingEditProvider(JSON5_LANGUAGE_ID, {
      provideDocumentFormattingEdits(model, options) {
        const value = model.getValue()
        if (getJson5ValidationMarkers(value).length > 0) {
          return []
        }
        const formatted = formatJson5Text(value, options)
        if (formatted === value) {
          return []
        }
        return [{
          range: getModelFullRange(model),
          text: formatted
        }]
      }
    })
  }

  json5RegisteredMonacoInstances.push(monacoInstance)
}

export function formatJson5Text(value, options) {
  const source = value || ''
  JSON5.parse(source)

  const formatOptions = options || {}
  const tabSize = formatOptions.tabSize || 2
  const indentText = formatOptions.insertSpaces === false ? '\t' : ' '.repeat(tabSize)
  const lines = ['']
  let indentLevel = 0
  let index = 0

  const setCurrentLine = line => {
    lines[lines.length - 1] = line
  }
  const currentLine = () => lines[lines.length - 1]
  const trimCurrentLineEnd = () => setCurrentLine(currentLine().replace(/[ \t]+$/g, ''))
  const currentLineHasContent = () => currentLine().trim().length > 0
  const currentIndent = () => indentText.repeat(Math.max(indentLevel, 0))
  const ensureIndent = () => {
    if (!currentLineHasContent()) {
      setCurrentLine(currentIndent())
    }
  }
  const append = text => {
    ensureIndent()
    setCurrentLine(currentLine() + text)
  }
  const appendSpaceIfNeeded = () => {
    if (currentLineHasContent() && !/[ \t]$/.test(currentLine())) {
      setCurrentLine(currentLine() + ' ')
    }
  }
  const newline = () => {
    trimCurrentLineEnd()
    lines.push(currentIndent())
  }
  const setBlankLineIndent = () => {
    if (!currentLineHasContent()) {
      setCurrentLine(currentIndent())
    }
  }

  while (index < source.length) {
    const char = source[index]
    const nextChar = source[index + 1]

    if (/\s/.test(char)) {
      index += 1
      continue
    }

    if (char === '/' && nextChar === '/') {
      const comment = readLineComment(source, index)
      appendSpaceIfNeeded()
      append(comment.text)
      index = comment.nextIndex
      newline()
      continue
    }

    if (char === '/' && nextChar === '*') {
      const comment = readBlockComment(source, index)
      appendBlockComment(comment.text, appendSpaceIfNeeded, append, newline)
      index = comment.nextIndex
      continue
    }

    if (char === '"' || char === "'") {
      const string = readString(source, index, char)
      append(string.text)
      index = string.nextIndex
      continue
    }

    if (char === '{' || char === '[') {
      append(char)
      indentLevel += 1
      newline()
      index += 1
      continue
    }

    if (char === '}' || char === ']') {
      indentLevel -= 1
      if (currentLineHasContent()) {
        newline()
      }
      setBlankLineIndent()
      append(char)
      index += 1
      continue
    }

    if (char === ',') {
      append(',')
      newline()
      index += 1
      continue
    }

    if (char === ':') {
      trimCurrentLineEnd()
      append(': ')
      index += 1
      continue
    }

    const token = readToken(source, index)
    append(token.text)
    index = token.nextIndex
  }

  return lines
    .map(line => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n+$/g, '')
}

export function getJson5ValidationMarkers(value, severity) {
  try {
    JSON5.parse(value || '')
    return []
  } catch (error) {
    const location = getJson5ErrorLocation(error, value || '')
    return [{
      severity: severity || 8,
      message: `JSON5: ${error.message}`,
      startLineNumber: location.lineNumber,
      startColumn: location.columnNumber,
      endLineNumber: location.lineNumber,
      endColumn: location.columnNumber + 1
    }]
  }
}

export function validateJson5Model(model, monacoInstance) {
  if (!model || !monacoInstance || !monacoInstance.editor) {
    return []
  }

  if (model.getLanguageId && model.getLanguageId() !== JSON5_LANGUAGE_ID) {
    monacoInstance.editor.setModelMarkers(model, JSON5_MARKER_OWNER, [])
    return []
  }

  const severity = monacoInstance.MarkerSeverity && monacoInstance.MarkerSeverity.Error
  const markers = getJson5ValidationMarkers(model.getValue(), severity)
  monacoInstance.editor.setModelMarkers(model, JSON5_MARKER_OWNER, markers)
  return markers
}

export function validateJson5Editor(editor, monacoInstance) {
  return getJson5Models(editor).reduce((markers, model) => {
    return markers.concat(validateJson5Model(model, monacoInstance))
  }, [])
}

export function attachJson5Validation(editor, monacoInstance) {
  const editors = getJson5Editors(editor)
  const disposables = editors
    .filter(item => item && item.onDidChangeModelContent)
    .map(item => item.onDidChangeModelContent(() => validateJson5Editor(editor, monacoInstance)))

  validateJson5Editor(editor, monacoInstance)

  return {
    dispose() {
      disposables.forEach(disposable => disposable && disposable.dispose && disposable.dispose())
    }
  }
}

function getJson5Editors(editor) {
  if (!editor) {
    return []
  }
  if (editor.getModifiedEditor && editor.getOriginalEditor) {
    return [editor.getOriginalEditor(), editor.getModifiedEditor()]
  }
  return [editor]
}

function getJson5Models(editor) {
  return getJson5Editors(editor)
    .map(item => item && item.getModel && item.getModel())
    .filter(Boolean)
}

function getJson5ErrorLocation(error, value) {
  const parsedLocation = parseJson5ErrorLocation(error)
  const lineNumber = parsedLocation.lineNumber || 1
  const columnNumber = parsedLocation.columnNumber || 1
  const lines = value.split(/\r\n|\r|\n/)
  const safeLineNumber = clamp(lineNumber, 1, Math.max(lines.length, 1))
  const lineText = lines[safeLineNumber - 1] || ''
  const safeColumnNumber = clamp(columnNumber, 1, Math.max(lineText.length + 1, 1))

  return {
    lineNumber: safeLineNumber,
    columnNumber: safeColumnNumber
  }
}

function parseJson5ErrorLocation(error) {
  if (error.lineNumber && error.columnNumber) {
    return {
      lineNumber: Number(error.lineNumber),
      columnNumber: Number(error.columnNumber)
    }
  }

  const message = error && error.message ? error.message : ''
  const lineColumnMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i)
  if (lineColumnMatch) {
    return {
      lineNumber: Number(lineColumnMatch[1]),
      columnNumber: Number(lineColumnMatch[2])
    }
  }

  const positionMatch = message.match(/at\s+(\d+):(\d+)/i)
  if (positionMatch) {
    return {
      lineNumber: Number(positionMatch[1]),
      columnNumber: Number(positionMatch[2])
    }
  }

  return {
    lineNumber: 1,
    columnNumber: 1
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function readLineComment(source, startIndex) {
  let index = startIndex
  while (index < source.length && source[index] !== '\n' && source[index] !== '\r') {
    index += 1
  }
  return {
    text: source.slice(startIndex, index).trimEnd(),
    nextIndex: index
  }
}

function readBlockComment(source, startIndex) {
  const endIndex = source.indexOf('*/', startIndex + 2)
  const nextIndex = endIndex > -1 ? endIndex + 2 : source.length
  return {
    text: source.slice(startIndex, nextIndex),
    nextIndex
  }
}

function readString(source, startIndex, quote) {
  let index = startIndex + 1
  let escaped = false

  while (index < source.length) {
    const char = source[index]
    if (escaped) {
      escaped = false
      index += 1
      continue
    }
    if (char === '\\') {
      escaped = true
      index += 1
      continue
    }
    if (char === quote) {
      index += 1
      break
    }
    index += 1
  }

  return {
    text: source.slice(startIndex, index),
    nextIndex: index
  }
}

function readToken(source, startIndex) {
  let index = startIndex
  while (index < source.length) {
    const char = source[index]
    const nextChar = source[index + 1]
    if (
      /\s/.test(char) ||
      '{}[],:'.includes(char) ||
      char === '"' ||
      char === "'" ||
      (char === '/' && (nextChar === '/' || nextChar === '*'))
    ) {
      break
    }
    index += 1
  }

  return {
    text: source.slice(startIndex, index),
    nextIndex: index
  }
}

function appendBlockComment(comment, appendSpaceIfNeeded, append, newline) {
  const commentLines = comment.split(/\r\n|\r|\n/)
  appendSpaceIfNeeded()
  commentLines.forEach((line, index) => {
    if (index > 0) {
      newline()
    }
    append(line.trim())
  })
  newline()
}

function getModelFullRange(model) {
  if (model.getFullModelRange) {
    return model.getFullModelRange()
  }

  const lineCount = model.getLineCount()
  return {
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: lineCount,
    endColumn: model.getLineMaxColumn(lineCount)
  }
}
