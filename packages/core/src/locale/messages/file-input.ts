import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface FileInputMessages {
  placeholder: string
  placeholderMultiple: string
  /** 清除按钮的提示文字。 */
  clear: string
  /** 清除按钮的无障碍名，带上字段名。 */
  clearField: (label?: string) => string
  required: string
  /** 拖着文件经过拖放区时显示的文字。 */
  dropHint: string
  /** 已选文件时触发按钮的无障碍名：字段名加文件名。 */
  triggerWithFiles: (label: string, fileNames: string) => string
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
    clearField: label => clearLabel(label, 'Clear', 'Clear '),
    required: 'Required',
    dropHint: 'Drop files here',
    triggerWithFiles: (label, fileNames) => `${label}, ${fileNames}`,
    fileSelected: fileName => `1 file selected: ${fileName}`,
    filesSelected: count => `${count} files selected`,
    errorType: fileName => `"${fileName}" is not an accepted file type`,
    errorSize: (fileName, maxSize) => `"${fileName}" exceeds ${maxSize} limit`,
    errorCount: maxFiles => `Maximum ${maxFiles} files allowed`,
  },
  'zh-CN': {
    placeholder: '选择文件',
    placeholderMultiple: '选择文件',
    clear: '清除',
    clearField: label => clearLabel(label, '清除', '清除'),
    required: '必填',
    dropHint: '把文件拖到这里',
    triggerWithFiles: (label, fileNames) => `${label}，${fileNames}`,
    fileSelected: fileName => `已选择 1 个文件：${fileName}`,
    filesSelected: count => `已选择 ${count} 个文件`,
    errorType: fileName => `不支持“${fileName}”的文件类型`,
    errorSize: (fileName, maxSize) => `“${fileName}”超过了 ${maxSize} 的大小限制`,
    errorCount: maxFiles => `最多只能选择 ${maxFiles} 个文件`,
  },
}
