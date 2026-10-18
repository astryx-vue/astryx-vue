import type { Component, ComputedRef, InjectionKey } from 'vue'
import { computed, inject } from 'vue'

/** 最近的 `LinkProvider` 给的链接组件。 */
export const linkComponentKey: InjectionKey<Component> = Symbol('astryx-link-component')

/**
 * 子树默认使用的链接组件。没有 provider 时是 `undefined`，
 * 各处退回自己原来的 `<a>`。
 *
 * 组件自己的 `as` 属性优先，所以用的时候写 `props.as ?? linkComponent.value`。
 */
export function useLinkComponent(): ComputedRef<Component | undefined> {
  const provided = inject(linkComponentKey, null)
  return computed(() => provided ?? undefined)
}
