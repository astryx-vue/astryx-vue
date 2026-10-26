import { computeAccessibleName, getRole } from 'dom-accessibility-api'

/**
 * 图表测试用的查询小工具：按角色、名称或文字找元素。
 *
 * 上游测试用 Testing Library 的 `getByRole` / `getByText`，这里没有装那套包，
 * 就用它底层同一份 `dom-accessibility-api` 自己找——角色的算法完全一样。
 */

/** 文档里（或某个子树里）的全部元素，按文档顺序。 */
export function allElements(root: ParentNode = document.body): Element[] {
  return [...root.querySelectorAll('*')]
}

/** 找到所有角色匹配的元素。 */
export function allByRole(role: string, root: ParentNode = document.body): Element[] {
  return allElements(root).filter(element => getRole(element) === role)
}

/** 找到第一个角色和可访问名都匹配的元素，找不到就抛错。 */
export function byRole(role: string, name?: string, root: ParentNode = document.body): Element {
  const found = allByRole(role, root).filter(element => name === undefined
    || computeAccessibleName(element) === name)
  if (found.length === 0) {
    const names = allByRole(role, root).map(element => computeAccessibleName(element))
    throw new Error(`找不到角色为 ${role}、名字为 ${String(name)} 的元素，现有名字：${JSON.stringify(names)}`)
  }
  return found[0]
}

/** 第一个角色匹配的元素，找不到返回 null。 */
export function queryByRole(role: string, root: ParentNode = document.body): Element | null {
  return allByRole(role, root)[0] ?? null
}

/** 文字内容完全等于 `text` 的元素。 */
export function allByText(root: ParentNode, text: string): Element[] {
  return allElements(root).filter(element => element.textContent === text)
}

/** 文字内容完全等于 `text` 的第一个元素，找不到就抛错。 */
export function byText(root: ParentNode, text: string): Element {
  const found = allByText(root, text)[0]
  if (!found)
    throw new Error(`找不到文字为 ${text} 的元素`)
  return found
}

/** 文字内容完全等于 `text` 的第一个元素，找不到返回 null。 */
export function queryByText(root: ParentNode, text: string): Element | null {
  return allByText(root, text)[0] ?? null
}

/** 元素的属性写法。属性不存在时返回 null。 */
export function attr(element: Element, name: string): string | null {
  return element.getAttribute(name)
}
