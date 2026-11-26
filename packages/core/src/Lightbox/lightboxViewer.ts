/** 序号取整：小数四舍五入到最近的一项，NaN 当作第一项。越界由调用方再夹紧。 */
export function toWholeIndex(value: number): number {
  return Number.isNaN(value) ? 0 : Math.round(value)
}

/**
 * 往灯箱自己的播报区域写一句话。模态 dialog 打开时外面的页面是 inert 的，
 * 挂在 body 上的公共播报区域读屏听不到，所以灯箱在 dialog 里放一个自己的。
 * 先清空再在下一帧写入，同一句话连着播两次也会被当成新内容。
 */
export function createModalAnnouncer(getRegion: () => HTMLElement | null): (message: string) => void {
  let frame: number | undefined
  return (message: string) => {
    const region = getRegion()
    if (region == null)
      return
    region.textContent = ''
    if (frame !== undefined && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(frame)
    if (typeof requestAnimationFrame !== 'function') {
      region.textContent = message
      return
    }
    frame = requestAnimationFrame(() => {
      frame = undefined
      region.textContent = message
    })
  }
}
