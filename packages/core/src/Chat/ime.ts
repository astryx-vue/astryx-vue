const IME_PROCESSING_KEY_CODE = 229

/**
 * Enter and Escape during an IME composition commit the candidate. They are not
 * composer commands. `keyCode` 229 covers engines that have not set `isComposing` yet.
 */
export function isImeKeyEvent(event: { isComposing?: boolean, keyCode?: number }): boolean {
  return event.isComposing === true || event.keyCode === IME_PROCESSING_KEY_CODE
}
