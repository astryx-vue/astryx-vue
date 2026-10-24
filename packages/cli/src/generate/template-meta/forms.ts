import type { TemplateMeta } from './types.ts'

/** Form pages: checkout, contact, and wizards. */
export const FORM_TEMPLATES: Record<string, TemplateMeta> = {
  'payment-form': {
    description: {
      en: 'A checkout payment form with card fields, contact rows, totals, and a place-order button.',
      zh: '结账支付表单：卡号信息、联系人信息、金额汇总和下单按钮。',
    },
    keywords: {
      en: ['payment', 'checkout', 'credit card', 'billing', 'order', 'form', 'purchase', 'pay'],
      zh: ['支付', '结账', '信用卡', '账单', '订单', '表单', '付款'],
    },
  },
  'checkout-wizard': {
    description: {
      en: 'A multi-step checkout with a stepper, shipping options, and a payment summary.',
      zh: '分步结账向导：步骤条、配送选项和支付汇总。',
    },
    keywords: {
      en: ['checkout', 'wizard', 'steps', 'stepper', 'cart', 'shipping', 'payment', 'order'],
      zh: ['结账', '向导', '步骤', '购物车', '配送', '支付', '下单'],
    },
  },
  'contact-form': {
    description: {
      en: 'A contact form with a message field, a plan selector, and a submit button.',
      zh: '联系表单：留言输入、方案选择和提交按钮。',
    },
    keywords: {
      en: ['contact', 'form', 'feedback', 'support', 'message', 'inquiry', 'get in touch'],
      zh: ['联系', '表单', '反馈', '支持', '留言', '咨询'],
    },
  },
  'form-wizard-dialog': {
    description: {
      en: 'A multi-step form inside a dialog, with a stepper and one question group per step.',
      zh: '对话框里的分步表单：步骤条，每步一组问题。',
    },
    keywords: {
      en: ['form', 'wizard', 'dialog', 'modal', 'steps', 'onboarding', 'multi-step', 'survey'],
      zh: ['表单', '向导', '对话框', '弹窗', '步骤', '引导', '问卷'],
    },
  },
  'form-wizard': {
    description: {
      en: 'A long multi-step form page with a stepper, grouped fields, and footer actions.',
      zh: '很长的分步表单页：步骤条、分组字段和底部操作按钮。',
    },
    keywords: {
      en: ['form', 'wizard', 'steps', 'stepper', 'multi-step', 'signup', 'application', 'long form'],
      zh: ['表单', '向导', '步骤', '分步', '注册', '申请'],
    },
  },
  'form-wizard-inline': {
    description: {
      en: 'A compact wizard inside one card, with next and back inside the step content.',
      zh: '一张卡片里的紧凑向导，上一步下一步就在内容区。',
    },
    keywords: {
      en: ['form', 'wizard', 'inline', 'card', 'steps', 'compact', 'small form'],
      zh: ['表单', '向导', '内联', '卡片', '步骤', '紧凑'],
    },
  },
  'form-two-column': {
    description: {
      en: 'A two-column form with an illustration on one side and grouped fields on the other.',
      zh: '双列表单：一边插图，一边分组字段。',
    },
    keywords: {
      en: ['form', 'two column', 'signup', 'layout', 'fields', 'illustration', 'register'],
      zh: ['表单', '双列', '注册', '布局', '字段', '插图'],
    },
  },
  'form-wizard-vertical': {
    description: {
      en: 'A vertical stepper wizard where each step keeps its own section on the page.',
      zh: '纵向步骤条向导，每一步在页面上各占一段。',
    },
    keywords: {
      en: ['form', 'wizard', 'vertical', 'stepper', 'steps', 'long form', 'checkout'],
      zh: ['表单', '向导', '纵向', '步骤条', '长表单'],
    },
  },
}
