import shortcutKeyMixin from '@/components/ShowFile/mixins/shortcutKey'

function setNavigatorPlatform(platform) {
  Object.defineProperty(window.navigator, 'platform', {
    value: platform,
    configurable: true,
  })
}

function createKeyboardEvent(options) {
  return {
    keyCode: options.keyCode,
    ctrlKey: options.ctrlKey || false,
    metaKey: options.metaKey || false,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    target: {
      select: jest.fn(),
    },
  }
}

function createShortcutContext(overrides = {}) {
  return {
    selectRowData: [{ id: 'file-1' }],
    fileClipboard: [],
    inputting: false,
    editingIndex: -1,
    drawer: false,
    drawerShowTime: 0,
    rowContextData: {
      name: 'report.txt',
      index: 0,
    },
    checkPreviewVisible: jest.fn(() => false),
    checkCmdKey: shortcutKeyMixin.methods.checkCmdKey,
    duplicate: jest.fn(),
    copyOperation: jest.fn(),
    removeOperation: jest.fn(),
    onCopy: jest.fn(),
    onMove: jest.fn(),
    getClipboardFileIdList: [],
    path: '/',
    currentFolder: {},
    $nextTick: callback => callback(),
    $refs: {
      fileListTable: {
        toggleAllSelection: jest.fn(),
      },
      searchInput: {
        focus: jest.fn(),
      },
    },
    ...overrides,
  }
}

describe('shortcutKey mixin', () => {
  test('Windows 下 Ctrl+D 会触发创建副本', () => {
    setNavigatorPlatform('Win32')
    const vm = createShortcutContext()
    const event = createKeyboardEvent({ keyCode: 68, ctrlKey: true })

    shortcutKeyMixin.methods.keydown.call(vm, event)

    expect(vm.duplicate).toHaveBeenCalledTimes(1)
    expect(event.preventDefault).toHaveBeenCalledTimes(1)
    expect(event.stopPropagation).toHaveBeenCalledTimes(1)
  })

  test('Mac 下 Cmd+D 会触发创建副本', () => {
    setNavigatorPlatform('MacIntel')
    const vm = createShortcutContext()
    const event = createKeyboardEvent({ keyCode: 68, metaKey: true })

    shortcutKeyMixin.methods.keydown.call(vm, event)

    expect(vm.duplicate).toHaveBeenCalledTimes(1)
    expect(event.preventDefault).toHaveBeenCalledTimes(1)
    expect(event.stopPropagation).toHaveBeenCalledTimes(1)
  })

  test('输入状态下 Ctrl+D 不会触发创建副本', () => {
    setNavigatorPlatform('Win32')
    const vm = createShortcutContext({ inputting: true })
    const event = createKeyboardEvent({ keyCode: 68, ctrlKey: true })

    shortcutKeyMixin.methods.keydown.call(vm, event)

    expect(vm.duplicate).not.toHaveBeenCalled()
    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(event.stopPropagation).not.toHaveBeenCalled()
  })
})
