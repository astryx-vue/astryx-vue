/**
 * 根 Theme 写在 `<html>` 上的私有属性：它此刻画的配色。
 *
 * 主题的 `@light` / `@dark` 组件样式块靠它在 `system` 根下跟随页面：
 * 属性写了 light 或 dark，就按那一种；没写（页面跟随读者），按 `prefers-color-scheme`。
 * 只有根 Theme 写它，主题编译器读它的选择器，包入口不导出。
 */

const ROOT_SCHEME_ATTR = 'data-astryx-scheme'

/** 在 `<html>` 上标出根 Theme 画的配色；传 null 就去掉标记，交给读者的偏好。 */
export function setRootScheme(root: HTMLElement, scheme: 'light' | 'dark' | null): void {
  if (scheme === null)
    root.removeAttribute(ROOT_SCHEME_ATTR)
  else
    root.setAttribute(ROOT_SCHEME_ATTR, scheme)
}

/** 匹配根 Theme 标出了 `scheme` 的 `<html>`。 */
export function rootSchemeIs(scheme: 'light' | 'dark'): string {
  return `html[${ROOT_SCHEME_ATTR}="${scheme}"]`
}

/** 匹配根 Theme 没有标出配色的 `<html>`。 */
export const ROOT_SCHEME_UNNAMED = `html:not([${ROOT_SCHEME_ATTR}])`
