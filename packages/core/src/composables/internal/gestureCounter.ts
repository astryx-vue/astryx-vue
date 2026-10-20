/**
 * 手势计数器：每一次新的按下或按键，计数加一。
 *
 * 同一次按压里，浏览器的点外关闭和触发器自己的 click 谁先到是没准的。
 * 比时间窗口只能猜，数手势不用猜：「属于关闭那次手势的 click」就是
 * 「计数还停在关闭那一刻的 click」，不管主线程中间卡了多久。
 *
 * 监听挂在 document 的捕获阶段，在任何处理函数读它之前先加一。第一次读的时候才装，服务端不装。
 */

let gesture = 0
let clickedGesture: number | null = null
let isListening = false

function advance(): void {
  gesture += 1
}

function markClicked(): void {
  clickedGesture = gesture
}

function listen(): void {
  if (isListening || typeof document === 'undefined')
    return
  isListening = true
  document.addEventListener('pointerdown', advance, true)
  document.addEventListener('keydown', advance, true)
  // 捕获阶段，就算有人 stopPropagation 也看得见这次 click。
  document.addEventListener('click', markClicked, true)
}

/** 当前这次手势的编号。两次读到同一个数，说明它们在同一次按压（或同一次按键）里。 */
export function currentGesture(): number {
  listen()
  return gesture
}

/** 当前这次手势的 click 是不是已经发生过了。 */
export function currentGestureHasClicked(): boolean {
  listen()
  return clickedGesture === gesture
}
