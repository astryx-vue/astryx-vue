import type { Component, Ref, VNodeChild } from 'vue'
import type { DialogProps } from './types.js'
import { defineComponent, h, readonly, ref, shallowRef } from 'vue'
import Dialog from './Dialog.vue'

export type ImperativeDialogOptions = Partial<Omit<DialogProps, 'isOpen'>>

export interface ImperativeDialogReturn {
  /** 以给定内容打开对话框。`options` 与默认选项合并。 */
  show: (content: () => VNodeChild, options?: ImperativeDialogOptions) => void
  /** 关闭对话框。 */
  hide: () => void
  /** 对话框当前是否打开。 */
  isOpen: Readonly<Ref<boolean>>
  /** 在模板中渲染一次，用于承载对话框。 */
  Host: Component
}

/**
 * 无需管理 `isOpen` 状态即可打开对话框。
 *
 * @example
 * ```
 * const dialog = useImperativeDialog()
 * // <button @click="dialog.show(() => h('p', 'Hello'))">Open</button>
 * // <dialog.Host />
 * ```
 */
export function useImperativeDialog(defaultOptions: ImperativeDialogOptions = {}): ImperativeDialogReturn {
  const isOpen = ref(false)
  const content = shallowRef<() => VNodeChild>(() => null)
  const options = shallowRef<ImperativeDialogOptions>(defaultOptions)

  function show(nextContent: () => VNodeChild, nextOptions?: ImperativeDialogOptions): void {
    content.value = nextContent
    if (nextOptions)
      options.value = { ...options.value, ...nextOptions }
    isOpen.value = true
  }

  function hide(): void {
    isOpen.value = false
  }

  const Host = defineComponent({
    name: 'AstryxImperativeDialogHost',
    setup() {
      return () => h(
        Dialog,
        {
          ...options.value,
          isOpen: isOpen.value,
          onOpenChange: (open: boolean) => {
            if (!open)
              isOpen.value = false
          },
        },
        { default: () => content.value() },
      )
    },
  })

  return { show, hide, isOpen: readonly(isOpen), Host }
}
