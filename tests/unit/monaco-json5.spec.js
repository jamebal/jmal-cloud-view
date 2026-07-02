import { formatJson5Text, getJson5ValidationMarkers, registerJson5Language } from '@/utils/monaco-json5'

describe('monaco json5 helpers', () => {
  test('registers document formatting provider for json5', () => {
    const fakeMonaco = {
      languages: {
        getLanguages: jest.fn(() => []),
        register: jest.fn(),
        setMonarchTokensProvider: jest.fn(),
        setLanguageConfiguration: jest.fn(),
        registerDocumentFormattingEditProvider: jest.fn()
      }
    }

    registerJson5Language(fakeMonaco)

    expect(fakeMonaco.languages.registerDocumentFormattingEditProvider).toHaveBeenCalledWith(
      'json5',
      expect.objectContaining({
        provideDocumentFormattingEdits: expect.any(Function)
      })
    )
  })

  test('accepts json5 comments and unquoted keys', () => {
    const markers = getJson5ValidationMarkers(`{
      // 允许注释
      unquoted: 'value',
      trailing: [1, 2,],
    }`)

    expect(markers).toEqual([])
  })

  test('returns a marker with line and column for invalid json5', () => {
    const markers = getJson5ValidationMarkers(`{
      ok: true,
      broken: [1, 2,,
    }`)

    expect(markers).toHaveLength(1)
    expect(markers[0]).toMatchObject({
      message: expect.stringContaining('JSON5'),
      startLineNumber: expect.any(Number),
      startColumn: expect.any(Number),
      endLineNumber: expect.any(Number),
      endColumn: expect.any(Number),
    })
    expect(markers[0].startLineNumber).toBeGreaterThanOrEqual(3)
  })

  test('formats json5 while preserving comments and unquoted keys', () => {
    const formatted = formatJson5Text(`{ // 说明
unquoted:'value', trailing:[1,2,], }`, { tabSize: 2, insertSpaces: true })

    expect(formatted).toBe(`{
  // 说明
  unquoted: 'value',
  trailing: [
    1,
    2,
  ],
}`)
  })
})
