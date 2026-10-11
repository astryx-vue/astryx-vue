export type InteractionModality = 'keyboard' | 'pointer'

let modality: InteractionModality = 'keyboard'
let listening = false

/** 记录最近一次是键盘还是指针。文本框的 :focus-visible 在程序聚焦时也会命中，不能单独用来判断。 */
export function trackInteractionModality(): void {
  if (listening || typeof document === 'undefined')
    return
  listening = true
  document.addEventListener('pointerdown', () => {
    modality = 'pointer'
  }, true)
  document.addEventListener('keydown', (event) => {
    if (event.metaKey || event.altKey || event.ctrlKey)
      return
    modality = 'keyboard'
  }, true)
}

export function isKeyboardModality(): boolean {
  trackInteractionModality()
  return modality === 'keyboard'
}
