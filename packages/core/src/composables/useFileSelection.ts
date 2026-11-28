import { fileInputMessages } from '../locale/messages/file-input.js'

export interface FileRejection {
  code: 'type' | 'size' | 'count'
  fileName?: string
  maxSize?: number
  maxFiles?: number
}

export interface FileSelectionOptions {
  accept?: string
  maxSize?: number
  maxFiles?: number
  isMultiple?: boolean
}

export interface FileSelectionResult {
  files: File | File[] | null
  rejections: FileRejection[]
}

function matchesAccept(file: File, accept: string | undefined): boolean {
  if (accept == null || accept.trim() === '')
    return true
  const tokens = accept.split(',').map(token => token.trim().toLowerCase()).filter(Boolean)
  if (tokens.length === 0)
    return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return tokens.some((token) => {
    if (token.startsWith('.'))
      return name.endsWith(token)
    if (token.endsWith('/*'))
      return type.startsWith(token.slice(0, -1))
    return type === token
  })
}

/** 文件大小的三种单位写法。数值已经换算好，负责按单位的格式写数字并带上本地化的单位。 */
export interface FileSizeUnits {
  fileSizeBytes: (size: number) => string
  fileSizeKilobytes: (size: number) => string
  fileSizeMegabytes: (size: number) => string
}

/**
 * 把字节数写成给人看的大小：不到 1024 字节写字节数，不到 1 MB 写 KB，其余写 MB，
 * KB 和 MB 保留一位小数。`units` 决定数字和单位怎么写，FileInput 传当前语言的文案；
 * 不传时用英文。
 */
export function formatFileSize(bytes: number, units: FileSizeUnits = fileInputMessages.en): string {
  if (bytes < 1024)
    return units.fileSizeBytes(bytes)
  if (bytes < 1024 * 1024)
    return units.fileSizeKilobytes(bytes / 1024)
  return units.fileSizeMegabytes(bytes / (1024 * 1024))
}

export function selectFiles(list: FileList | File[] | null | undefined, options: FileSelectionOptions): FileSelectionResult {
  const incoming = list == null ? [] : [...list]
  const rejections: FileRejection[] = []
  let accepted = incoming.filter((file) => {
    if (!matchesAccept(file, options.accept)) {
      rejections.push({ code: 'type', fileName: file.name })
      return false
    }
    if (options.maxSize != null && file.size > options.maxSize) {
      rejections.push({ code: 'size', fileName: file.name, maxSize: options.maxSize })
      return false
    }
    return true
  })

  if (options.isMultiple && options.maxFiles != null && accepted.length > options.maxFiles) {
    rejections.push({ code: 'count', maxFiles: options.maxFiles })
    accepted = accepted.slice(0, options.maxFiles)
  }

  if (!options.isMultiple)
    return { files: accepted[0] ?? null, rejections }

  return { files: accepted, rejections }
}
