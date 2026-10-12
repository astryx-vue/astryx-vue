import { describe, expect, it } from 'vitest'
import { formatFileSize, selectFiles } from './useFileSelection.js'

function file(name: string, type: string, size: number): File {
  const blob = new File([new Uint8Array(size)], name, { type })
  return blob
}

describe('file selection', () => {
  it('keeps a single accepted file and reports type and size rejections', () => {
    const result = selectFiles([
      file('notes.txt', 'text/plain', 10),
      file('resume.pdf', 'application/pdf', 20),
    ], { accept: '.pdf', maxSize: 15 })
    expect(result.files).toBeNull()
    expect(result.rejections.map(item => item.code)).toEqual(['type', 'size'])
  })

  it('caps the number of files and formats sizes', () => {
    const result = selectFiles([
      file('a.png', 'image/png', 10),
      file('b.png', 'image/png', 10),
      file('c.png', 'image/png', 10),
    ], { accept: 'image/*', isMultiple: true, maxFiles: 2 })
    expect(Array.isArray(result.files) && result.files.map(item => item.name)).toEqual(['a.png', 'b.png'])
    expect(result.rejections).toEqual([{ code: 'count', maxFiles: 2 }])
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB')
  })
})
