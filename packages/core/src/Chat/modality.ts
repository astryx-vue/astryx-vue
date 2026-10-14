export type InteractionModality = 'keyboard' | 'pointer'

let modality: InteractionModality = 'keyboard'
let listening = false

/** Pointer focus must not draw the keyboard ring. `:focus-visible` is not enough: programmatic focus matches it too. */
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
