import { observeContent } from '../utils/sharedMutationObserver.js'

/** 决定哪一个复选框带 `required` 的单个框状态。 */
export interface RequiredGroupBox {
  isChecked: boolean
  /** 禁用或只读的框用户勾不了，为 false。 */
  isEnabled: boolean
}

export interface RequiredGroup {
  /**
   * 加入一个复选框和它的状态，并更新所有框的 `required`。
   * 返回的函数移除这个框、清掉它的 `required` 并更新其余的框。
   * 框的状态变了就再登记一次。
   */
  register: (input: HTMLInputElement, box: RequiredGroupBox) => () => void
  /** 选项被挪动（例如带 key 的重排，不会重新登记）时更新 `required`；返回停止函数。 */
  observe: (container: HTMLElement) => () => void
}

function byDocumentOrder(a: HTMLInputElement, b: HTMLInputElement): number {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

/**
 * 浏览器没有“一组复选框必填”的原生状态。没有任何框被勾选时，第一个可用的框
 * 带原生 `required`，浏览器就会拦住提交并带着自己的提示把焦点移到它上面；
 * 一旦有框被勾选，所有框都不再带 `required`。
 */
export function createRequiredGroup(): RequiredGroup {
  const boxes = new Map<HTMLInputElement, RequiredGroupBox>()

  function update(): void {
    const ordered = [...boxes.keys()].sort(byDocumentOrder)
    const isEmpty = ![...boxes.values()].some(box => box.isChecked)
    const target = isEmpty
      ? ordered.find(input => boxes.get(input)?.isEnabled === true)
      : undefined
    for (const input of ordered)
      input.required = input === target
  }

  return {
    register(input, box) {
      boxes.set(input, box)
      update()
      return () => {
        boxes.delete(input)
        input.required = false
        update()
      }
    },
    observe(container) {
      return observeContent(container, update)
    },
  }
}
