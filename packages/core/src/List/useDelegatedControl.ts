import { watchEffect } from 'vue'

/**
 * 转发点击的行写在被转发控件上的属性。控件就是行自己的动作，按它照样是按这一行，
 * 所以带上按压标记；行选中时写 `aria-current`（控件自己有标记就不动）。
 * 清理时只撤掉行自己写的值。
 */
export function useDelegatedControl(options: {
  control: () => HTMLElement | null | undefined
  current: () => string | boolean | undefined
  pressAttributes: Record<string, string>
}): void {
  watchEffect((onCleanup) => {
    const control = options.control()
    if (control == null)
      return
    for (const [name, value] of Object.entries(options.pressAttributes))
      control.setAttribute(name, value)
    onCleanup(() => {
      for (const name of Object.keys(options.pressAttributes))
        control.removeAttribute(name)
    })
  })

  watchEffect((onCleanup) => {
    const control = options.control()
    const value = options.current()
    if (control == null || value === undefined || control.hasAttribute('aria-current'))
      return
    const written = String(value)
    control.setAttribute('aria-current', written)
    onCleanup(() => {
      if (control.getAttribute('aria-current') === written)
        control.removeAttribute('aria-current')
    })
  })
}
