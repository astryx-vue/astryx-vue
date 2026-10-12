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

export function formatFileSize(bytes: number): string {
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  const megabytes = bytes / (1024 * 1024)
  const rounded = megabytes >= 10 ? Math.round(megabytes) : Math.round(megabytes * 10) / 10
  return `${rounded} MB`
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
