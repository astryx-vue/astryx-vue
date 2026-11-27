/**
 * @file lightboxPointer.ts
 * @input 鼠标、触控笔在灯箱舞台上的事件，当前页
 * @output isClickOutsideMedia：一次点击算不算点在媒体外面；markPointerOverPhoto：放大镜光标只在照片上方显示
 * @position Lightbox.vue 的指针辅助。舞台铺满灯箱，所以按照片的盒子判断，不按事件目标判断。
 */

/** 鼠标或触控笔悬停在适应大小的照片上方时，舞台带这个属性，光标显示放大镜。 */
export const OVER_PHOTO_ATTRIBUTE = 'data-lightbox-over-photo'

interface Point {
  readonly x: number
  readonly y: number
}

export interface ClickOutsideContext {
  /** 舞台（翻页器的视口）。 */
  readonly viewport: HTMLElement | null
  /** 当前页。 */
  readonly page: Element | null
  /** 这次按下的位置。 */
  readonly pressPoint: Point | null
}

function within(rect: DOMRect | undefined, { x, y }: Point): boolean {
  return rect != null && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

/**
 * 鼠标或触控笔在媒体上的一次点击，按下或松开落在当前页媒体以外时关闭灯箱。
 * 媒体是适应大小的照片排好的盒子、图注区域和图注自己的盒子；放大时照片显示出来的盒子也算。
 * 键盘触发的点击（detail 为 0）不算。
 */
export function isClickOutsideMedia(event: MouseEvent, { viewport, page, pressPoint }: ClickOutsideContext): boolean {
  const media = page?.querySelector<HTMLElement>('img') ?? page?.querySelector<HTMLElement>('video')
  // 页面的照片盒子，照片在里面居中。
  const box = media?.parentElement
  const group = viewport?.parentElement
  if (event.detail === 0 || media == null || box == null || page == null || group == null
    || !(event.target instanceof Node) || !group.contains(event.target)) {
    return false
  }
  const space = (box.clientHeight - media.offsetHeight) / 2
  const boxRect = box.getBoundingClientRect()
  const top = boxRect.top + space
  const bottom = top + media.offsetHeight
  const width = media.offsetWidth
  const middle = boxRect.left + box.clientWidth / 2
  const shown = media.getBoundingClientRect()
  // 图注区域可能和照片隔开一段。这时媒体是照片所在的行、图注区域和图注自己的盒子（展开的图注会盖到照片上），
  // 照片和图注区域之间的空白算外面。
  const caption = page.querySelector<HTMLElement>('[data-lightbox-caption]')
  const captionBox = caption?.getBoundingClientRect()
  const bandBox = caption?.parentElement?.getBoundingClientRect()
  const isOutside = (point: Point): boolean => {
    if (within(shown, point))
      return false
    const isOnPhotoRows = point.y >= top && point.y <= bottom && Math.abs(point.x - middle) <= width / 2
    if (captionBox == null)
      return !isOnPhotoRows
    return !isOnPhotoRows && !within(captionBox, point) && !within(bandBox, point)
  }
  return isOutside({ x: event.clientX, y: event.clientY }) || (pressPoint != null && isOutside(pressPoint))
}

/** 鼠标或触控笔是否悬停在照片上方，写在舞台上，悬停不触发渲染。 */
export function markPointerOverPhoto(event: PointerEvent): void {
  const stage = event.currentTarget
  if (!(stage instanceof HTMLElement) || event.pointerType === 'touch' || event.buttons !== 0)
    return
  const photo = stage.querySelector('[data-current] img') ?? stage.querySelector('img')
  stage.toggleAttribute(OVER_PHOTO_ATTRIBUTE, within(photo?.getBoundingClientRect(), { x: event.clientX, y: event.clientY }))
}
