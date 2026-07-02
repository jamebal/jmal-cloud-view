jest.mock('@/store', () => ({
  getters: {
    name: 'tester',
    userId: 'user-1',
  },
}))

jest.mock('@/api/file-api', () => ({}))

jest.mock('@/utils/index', () => ({
  defaultPreviewConfig: '{}',
}))

import { buildDirectFileExecuteCommand, buildDirectFilePath, buildDynamicDirectFileUrl } from '@/utils/file-config'

describe('file-config direct link helpers', () => {
  const file = {
    name: 'report 2026.txt',
    isFolder: false,
  }

  test('builds direct file path with encoded filename', () => {
    expect(typeof buildDirectFilePath).toBe('function')
    expect(buildDirectFilePath('mark-1', file)).toBe('/api/direct-file/mark-1/report%202026.txt')
  })

  test('uses raw dynamic addr when domain is empty', () => {
    expect(typeof buildDynamicDirectFileUrl).toBe('function')
    expect(
      buildDynamicDirectFileUrl({
        mark: 'mark-1',
        file,
        addr: '1.2.3.4:5678',
        protocol: 'https:',
        domain: '',
      })
    ).toBe('https://1.2.3.4:5678/api/direct-file/mark-1/report%202026.txt')
  })

  test('replaces only host when dynamic domain is configured', () => {
    expect(
      buildDynamicDirectFileUrl({
        mark: 'mark-1',
        file: {
          name: 'folder',
          isFolder: true,
        },
        addr: '[2001:db8::1]:5678',
        protocol: 'https:',
        domain: 'home.example.com',
      })
    ).toBe('https://home.example.com:5678/api/direct-file/mark-1/folder.zip')
  })

  test('builds shell execute command for direct file url', () => {
    expect(
      buildDirectFileExecuteCommand('https://home.example.com/api/direct-file/mark-1/install.sh')
    ).toBe("bash <(curl -fsSL 'https://home.example.com/api/direct-file/mark-1/install.sh')")
  })
})
