import type { AstryxLocale } from '../types.js'

export interface BreadcrumbsMessages {
  /** 面包屑导航区域的默认无障碍名。 */
  label: string
}

export const breadcrumbsMessages: Record<AstryxLocale, BreadcrumbsMessages> = {
  'en': { label: 'Breadcrumb' },
  'zh-CN': { label: '面包屑导航' },
}
