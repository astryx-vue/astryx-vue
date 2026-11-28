import { sanitizeUrl } from '../linkUtils.js'

/** 输入的网址按链接规则（`sanitizeUrl`）变成的地址；规则不接受时返回 null。 */
export function toLinkHref(entered: string): string | null {
  const href = sanitizeUrl(entered.trim())
  return href === 'about:blank' ? null : href
}
