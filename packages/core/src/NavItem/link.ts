import type { Component } from 'vue'
import type { NavLinkComponent } from './types.js'
import { toRaw } from 'vue'

/** 有可用地址时用链接组件，否则用按钮。禁用的地址也不走链接。 */
export function resolveNavRoot(
  href: string | undefined,
  isDisabled: boolean,
  as?: NavLinkComponent,
): string | Component {
  if (href != null && href !== '' && !isDisabled)
    return as == null ? 'a' : toRaw(as)
  return 'button'
}

export function isExternalNavTarget(target: string | undefined): boolean {
  return target === '_blank'
}
