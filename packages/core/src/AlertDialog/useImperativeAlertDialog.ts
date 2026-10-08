import type { Component, Ref } from 'vue'
import type { AlertDialogProps } from './types.js'
import { defineComponent, h, ref, shallowRef } from 'vue'
import AlertDialog from './AlertDialog.vue'

export type ImperativeAlertDialogOptions = Omit<AlertDialogProps, 'isOpen'> & {
  /**
   * Called when the confirming action is activated. The dialog is not closed for
   * you: call `hide()` once the work settles.
   */
  onAction?: (event: MouseEvent) => void
}

export interface ImperativeAlertDialogReturn {
  /** Opens the dialog with the given options. */
  show: (options: ImperativeAlertDialogOptions) => void
  /** Closes the dialog. */
  hide: () => void
  /** Whether the dialog is currently open. */
  isOpen: Ref<boolean>
  /** Render this once in the template. */
  Host: Component
}

/**
 * Opens an alert dialog without managing the open state yourself.
 *
 * @example
 * ```
 * const alert = useImperativeAlertDialog()
 * const AlertHost = alert.Host
 * // <button @click="alert.show({ title: 'Delete item?', description: '…', actionLabel: 'Delete' })">Delete</button>
 * // <AlertHost />
 * ```
 */
export function useImperativeAlertDialog(): ImperativeAlertDialogReturn {
  const isOpen = ref(false)
  const options = shallowRef<ImperativeAlertDialogOptions | null>(null)

  function show(nextOptions: ImperativeAlertDialogOptions): void {
    options.value = nextOptions
    isOpen.value = true
  }

  function hide(): void {
    isOpen.value = false
  }

  const Host = defineComponent({
    name: 'AstryxImperativeAlertDialogHost',
    setup() {
      return () => {
        const current = options.value
        if (current == null)
          return null
        return h(AlertDialog, {
          ...current,
          isOpen: isOpen.value,
          onOpenChange: (open: boolean) => {
            if (!open)
              isOpen.value = false
          },
        })
      }
    },
  })

  return { hide, Host, isOpen, show }
}
