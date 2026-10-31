import type { AutoLinkConfig, LinkMatcher } from '@lexical/link'
import type { LexicalEditor } from 'lexical'
import { createLinkMatcherWithRegExp, registerAutoLink } from '@lexical/link'
import { EMAIL_MATCHER, sanitizeUrl, URL_MATCHER } from '../../linkUtils.js'

/**
 * 自动生成的链接都带这两个属性，在新标签页打开。只要有 `target="_blank"`，
 * 就必须同时有 `rel="noopener noreferrer"`，否则被打开的页面能通过 `window.opener` 反过来操控原页面。
 */
export const NEW_TAB_LINK_ATTRIBUTES = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const

/**
 * 默认的两个匹配器：网址（没写协议就补 `https://`）和邮箱（写成 `mailto:` 链接）。
 * 网址都过一遍 `sanitizeUrl`，所以写进去的只可能是 http、https、mailto、tel。
 */
export const DEFAULT_LINK_MATCHERS: LinkMatcher[] = [
  (text) => {
    const match = createLinkMatcherWithRegExp(URL_MATCHER, url => sanitizeUrl(url))(text)
    return match ? { ...match, attributes: NEW_TAB_LINK_ATTRIBUTES } : null
  },
  (text) => {
    const match = createLinkMatcherWithRegExp(EMAIL_MATCHER, email => `mailto:${email}`)(text)
    return match ? { ...match, attributes: NEW_TAB_LINK_ATTRIBUTES } : null
  },
]

export interface AutoLinkOptions {
  /** 要识别哪些写法。不传就用 `DEFAULT_LINK_MATCHERS`（网址和邮箱）。 */
  matchers?: LinkMatcher[]
  /** 自动加、改、去掉链接时调用：新网址（去掉时是 `null`）和原来的网址。 */
  onChange?: (url: string | null, prevUrl: string | null) => void
}

/**
 * 把输入或粘贴的网址、邮箱自动变成链接。返回取消注册的函数。
 * 需要 `AutoLinkNode`，默认节点里已经有了。
 */
export function registerRichTextAutoLink(editor: LexicalEditor, options: AutoLinkOptions = {}): () => void {
  const config: Partial<AutoLinkConfig> & Omit<AutoLinkConfig, 'separatorRegex'> = {
    matchers: options.matchers ?? DEFAULT_LINK_MATCHERS,
    changeHandlers: options.onChange ? [options.onChange] : [],
    excludeParents: [],
  }
  return registerAutoLink(editor, config)
}
