import type { AstryxLocale } from '../types.js'
import { formatCount } from './shared.js'

export interface StepperMessages {
  progress: string
  optional: string
  previous: string
  next: string
  /** 可点步骤的无障碍名，例如「转到第 2 步：付款」。 */
  goToStep: (stepNumber: number, label: string) => string
  /** 带状态的可点步骤的无障碍名，状态词取自 `status`。 */
  goToStepWithStatus: (stepNumber: number, label: string, status: string) => string
  /** 步骤状态词，会填进上面两句话里，所以英文用小写。 */
  status: {
    completed: string
    warning: string
    error: string
  }
}

export const stepperMessages: Record<AstryxLocale, StepperMessages> = {
  'en': {
    progress: 'Progress',
    optional: 'Optional',
    previous: 'Previous step',
    next: 'Next step',
    goToStep: (stepNumber, label) => `Go to step ${formatCount(stepNumber, 'en')}: ${label}`,
    goToStepWithStatus: (stepNumber, label, status) => `Go to step ${formatCount(stepNumber, 'en')}: ${label}, ${status}`,
    status: {
      completed: 'completed',
      warning: 'warning',
      error: 'error',
    },
  },
  'zh-CN': {
    progress: '进度',
    optional: '可选',
    previous: '上一步',
    next: '下一步',
    goToStep: (stepNumber, label) => `转到第 ${formatCount(stepNumber, 'zh-CN')} 步：${label}`,
    goToStepWithStatus: (stepNumber, label, status) => `转到第 ${formatCount(stepNumber, 'zh-CN')} 步：${label}，${status}`,
    status: {
      completed: '已完成',
      warning: '警告',
      error: '错误',
    },
  },
}
