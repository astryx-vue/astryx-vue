/** 最近一次输入是键盘还是指针。焦点是键盘带进来的，控件才因为它留着。 */
export type InteractionModality = 'keyboard' | 'pointer'

let modality: InteractionModality = 'pointer'
let isTracking = false

function onKeyDown(event: KeyboardEvent): void {
  if (!event.altKey && !event.ctrlKey && !event.metaKey)
    modality = 'keyboard'
}

function onPointerDown(): void {
  modality = 'pointer'
}

/** 在文档上记录输入方式。只装一次，所有播放器共用。 */
export function trackInteractionModality(): void {
  if (isTracking || typeof document === 'undefined')
    return
  isTracking = true
  document.addEventListener('keydown', onKeyDown, true)
  document.addEventListener('pointerdown', onPointerDown, true)
  document.addEventListener('mousedown', onPointerDown, true)
}

export function readInteractionModality(): InteractionModality {
  return modality
}

/** 元素正显示键盘焦点框。浏览器不认 `:focus-visible` 时按键盘输入算。 */
export function isFocusVisible(element: Element): boolean {
  try {
    return element.matches(':focus-visible')
  }
  catch {
    return true
  }
}
