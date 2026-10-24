import type { Component } from 'vue'
import type { NavLinkComponent } from './types.js'
import { toRaw } from 'vue'
import { isSafeUrl } from '../utils/safeUrl.js'

/**
 * 有可用地址、而且协议允许当页面打开时，才是链接。
 * 禁用，或 `javascript:`、`vbscript:`、`data:text/html`，都不是。
 */
export function isNavigableHref(href: string | undefined, isDisabled = false): boolean {
  return href != null && href !== '' && !isDisabled && isSafeUrl(href)
}

/** 能导航时原样返回地址，否则不把这个字符串写进 `href`。 */
export function safeNavHref(href: string | undefined): string | undefined {
  return isNavigableHref(href) ? href : undefined
}

/**
 * 有可用地址时用链接组件，否则用按钮。禁用的地址也不走链接。
 * `fallback` 是外层的默认链接组件，例如 `LinkProvider` 给的那个；`as` 写了就以 `as` 为准。
 */
export function resolveNavRoot(
  href: string | undefined,
  isDisabled: boolean,
  as?: NavLinkComponent,
  fallback?: NavLinkComponent,
): string | Component {
  if (isNavigableHref(href, isDisabled)) {
    const root = as ?? fallback
    return root == null ? 'a' : toRaw(root)
  }
  return 'button'
}

export function isExternalNavTarget(target: string | undefined): boolean {
  return target === '_blank'
}
