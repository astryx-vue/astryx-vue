/**
 * 把一件事排到下一帧再做，同一帧里排多次只做一次。返回 `{ schedule, cancel }`。
 *
 * 量位置、改样式这类事要等浏览器排完版才有意义，而且编辑器一次更新会触发很多次监听，
 * 合并到每帧一次才不浪费。服务端没有 `requestAnimationFrame`，这时什么也不做：
 * 服务端只渲染编辑器的外框，这些事本来就是浏览器里才需要的。
 */
export function createFrameScheduler(task: () => void): { schedule: () => void, cancel: () => void } {
  let frame = 0
  return {
    schedule() {
      if (frame !== 0 || typeof requestAnimationFrame === 'undefined')
        return
      frame = requestAnimationFrame(() => {
        frame = 0
        task()
      })
    },
    cancel() {
      if (frame !== 0 && typeof cancelAnimationFrame !== 'undefined')
        cancelAnimationFrame(frame)
      frame = 0
    },
  }
}
