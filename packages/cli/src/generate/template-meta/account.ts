import type { TemplateMeta } from './types.ts'

/** Login and settings pages. */
export const ACCOUNT_TEMPLATES: Record<string, TemplateMeta> = {
  'login': {
    description: {
      en: 'A minimal centered sign-in form: email, password, and a submit button, and nothing else on the page.',
      zh: '极简登录页：居中的邮箱、密码和登录按钮，页面上没有别的东西。',
    },
    keywords: {
      en: ['login', 'sign in', 'signin', 'authentication', 'credentials', 'account access', 'minimal'],
      zh: ['登录', '登陆', '认证', '密码', '账号', '极简登录'],
    },
  },
  'login-card': {
    description: {
      en: 'A sign-in card with email, password, SSO buttons, and a sign-up link.',
      zh: '登录卡片：邮箱、密码、第三方登录按钮和注册链接。',
    },
    keywords: {
      en: ['login', 'sign in', 'signin', 'auth', 'authentication', 'password', 'account', 'credentials'],
      zh: ['登录', '登陆', '认证', '密码', '账号', '登录页'],
    },
  },
  'login-split': {
    description: {
      en: 'A split-screen login with the form on one side and brand imagery on the other.',
      zh: '分屏登录：一边表单，一边品牌图。',
    },
    keywords: {
      en: ['login', 'split', 'sign in', 'auth', 'branding', 'illustration', 'two column'],
      zh: ['登录', '分屏', '认证', '品牌', '插图', '登录页'],
    },
  },
  'login-sso': {
    description: {
      en: 'An SSO login with provider buttons, an email fallback, and a marketing side panel.',
      zh: '单点登录：第三方登录按钮、邮箱登录兜底和侧边介绍。',
    },
    keywords: {
      en: ['login', 'sso', 'single sign on', 'oauth', 'saml', 'providers', 'sign in'],
      zh: ['登录', '单点登录', 'SSO', '第三方登录', 'OAuth', '登录页'],
    },
  },
  'settings-dialog': {
    description: {
      en: 'An account settings dialog with profile fields, toggles, and a save row.',
      zh: '账号设置对话框：个人资料字段、开关和保存按钮。',
    },
    keywords: {
      en: ['settings', 'preferences', 'dialog', 'modal', 'account', 'profile', 'options'],
      zh: ['设置', '偏好', '对话框', '弹窗', '账号', '个人资料'],
    },
  },
  'settings': {
    description: {
      en: 'A settings page with a category sidebar and tabbed form panels.',
      zh: '设置页：左侧分类列表，右侧标签页表单。',
    },
    keywords: {
      en: ['settings', 'preferences', 'configuration', 'page', 'account', 'options', 'profile'],
      zh: ['设置', '偏好', '配置', '页面', '账号', '选项'],
    },
  },
  'settings-sidebar': {
    description: {
      en: 'A settings layout with a category sidebar and one scrolling panel of sections.',
      zh: '设置布局：左侧分类栏，右侧一长列分节内容。',
    },
    keywords: {
      en: ['settings', 'sidebar', 'preferences', 'panels', 'configuration', 'account'],
      zh: ['设置', '侧边栏', '偏好', '面板', '配置'],
    },
  },
}
