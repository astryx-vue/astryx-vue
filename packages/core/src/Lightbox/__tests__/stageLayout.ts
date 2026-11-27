/**
 * @file stageLayout.ts
 * @input 无
 * @output stubStageLayout：给 happy-dom 补上灯箱舞台的排版尺寸，返回撤销函数
 * @position Lightbox 组件测试的共用工具。happy-dom 不排版，缩放和翻页量不出尺寸就不动。
 */

/** 照片 400 × 200，照片盒子 400 × 600，翻页器的视口 400 宽。 */
export function stubStageLayout(): () => void {
  const undo: (() => void)[] = []
  const define = (proto: object, key: string, get: (element: Element) => number): void => {
    const original = Object.getOwnPropertyDescriptor(proto, key)
    Object.defineProperty(proto, key, {
      configurable: true,
      get(this: Element) {
        return get(this)
      },
    })
    undo.push(() => {
      if (original)
        Object.defineProperty(proto, key, original)
      else
        Reflect.deleteProperty(proto, key)
    })
  }
  const isPhoto = (element: Element): boolean => element instanceof HTMLImageElement
  const isStage = (element: Element): boolean => element.hasAttribute('data-lightbox-page-media')
  const isViewport = (element: Element): boolean => element.classList.contains('astryx-lightbox__viewport')
  define(HTMLElement.prototype, 'offsetWidth', element => (isPhoto(element) ? 400 : 0))
  define(HTMLElement.prototype, 'offsetHeight', element => (isPhoto(element) ? 200 : 0))
  define(HTMLElement.prototype, 'clientWidth', element => (isStage(element) || isViewport(element) ? 400 : 0))
  define(HTMLElement.prototype, 'clientHeight', element => (isStage(element) || isViewport(element) ? 600 : 0))
  return () => undo.reverse().forEach(restore => restore())
}
