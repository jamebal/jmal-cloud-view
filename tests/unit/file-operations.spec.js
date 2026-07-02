function loadFileOperationsForPlatform(platform) {
  jest.resetModules()
  Object.defineProperty(window.navigator, 'platform', {
    value: platform,
    configurable: true,
  })

  return require('@/utils/file-operations').fileOperations
}

describe('fileOperations', () => {
  test('uses Cmd+D as duplicate shortcut on Mac', () => {
    const fileOperations = loadFileOperationsForPlatform('MacIntel')

    expect(fileOperations.duplicate.shortcut).toEqual(['⌘', 'D'])
  })

  test('uses Ctrl+D as duplicate shortcut on non-Mac platforms', () => {
    const fileOperations = loadFileOperationsForPlatform('Win32')

    expect(fileOperations.duplicate.shortcut).toEqual(['Ctrl', 'D'])
  })
})
