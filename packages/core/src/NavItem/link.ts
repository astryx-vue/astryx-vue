import type { Component } from 'vue'
import type { NavLinkComponent } from './types.js'
import { toRaw } from 'vue'

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
  if (href != null && href !== '' && !isDisabled) {
    const root = as ?? fallback
    return root == null ? 'a' : toRaw(root)
  }
  return 'button'
}

export function isExternalNavTarget(target: string | undefined): boolean {
  return target === '_blank'
}
