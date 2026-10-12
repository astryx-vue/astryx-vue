import type { AstryxLocale } from '../types.js'

export interface FileInputMessages {
  placeholder: string
  placeholderMultiple: string
  clear: string
  required: string
  fileSelected: (fileName: string) => string
  filesSelected: (count: number) => string
  errorType: (fileName: string) => string
  errorSize: (fileName: string, maxSize: string) => string
  errorCount: (maxFiles: number) => string
}

export const fileInputMessages: Record<AstryxLocale, FileInputMessages> = {
  'en': {
    placeholder: 'Choose file',
    placeholderMultiple: 'Choose files',
    clear: 'Clear',
    required: 'Required',
    fileSelected: fileName => `${fileName} selected`,
    filesSelected: count => `${count} files selected`,
    errorType: fileName => `${fileName} is not an accepted file type`,
    errorSize: (fileName, maxSize) => `${fileName} exceeds ${maxSize}`,
    errorCount: maxFiles => `You can select up to ${maxFiles} files`,
  },
  'zh-CN': {
    placeholder: '选择文件',
    placeholderMultiple: '选择文件',
    clear: '清除',
    required: '必填',
    fileSelected: fileName => `已选择 ${fileName}`,
    filesSelected: count => `已选择 ${count} 个文件`,
    errorType: fileName => `${fileName} 不是允许的文件类型`,
    errorSize: (fileName, maxSize) => `${fileName} 超过 ${maxSize}`,
    errorCount: maxFiles => `最多选择 ${maxFiles} 个文件`,
  },
}
