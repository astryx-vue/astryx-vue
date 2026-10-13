import type { AstryxLocale } from '../types.js'

export interface StepperMessages {
  progress: string
  optional: string
  previous: string
  next: string
  goToStep: (step: number) => string
  goToStepWithStatus: (step: number, status: string) => string
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
    goToStep: step => `Go to step ${step}`,
    goToStepWithStatus: (step, status) => `Go to step ${step}, ${status}`,
    status: {
      completed: 'Completed',
      warning: 'Warning',
      error: 'Error',
    },
  },
  'zh-CN': {
    progress: '进度',
    optional: '可选',
    previous: '上一步',
    next: '下一步',
    goToStep: step => `转到第 ${step} 步`,
    goToStepWithStatus: (step, status) => `转到第 ${step} 步，${status}`,
    status: {
      completed: '已完成',
      warning: '警告',
      error: '错误',
    },
  },
}
