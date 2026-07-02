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

  test('adds copy execute link submenu for shell scripts', () => {
    jest.resetModules()
    const { buildDirectLinkSubMenus } = require('@/utils/file-operations')

    const menus = buildDirectLinkSubMenus({ suffix: 'sh', isFolder: false }, false)

    expect(menus.map(item => item.operation)).toEqual([
      'manageDirectLink',
      'copyDirectLink',
      'copyDirectLinkExecute',
    ])
  })

  test('does not add copy execute link submenu for non-shell files', () => {
    jest.resetModules()
    const { buildDirectLinkSubMenus } = require('@/utils/file-operations')

    const menus = buildDirectLinkSubMenus({ suffix: 'txt', isFolder: false }, true)

    expect(menus.map(item => item.operation)).toEqual([
      'manageDirectLink',
      'copyDirectLink',
      'copyDynamicDirectLink',
    ])
  })
})
