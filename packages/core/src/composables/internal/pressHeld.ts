/**
 * 一块可按表面的按压被它的主人「按住不放」：表面照样接住按压，但什么都不画，和不可用的表面一样，
 * 它外面的表面也不亮。表面里面的可按元素保留自己的按压。
 *
 * 打开着的横滑行把这个标记写在行根上，所以点行的内容只会合上行，不会让行亮起来。
 * 写它的代码负责再把它摘掉；表面始终是可按的。
 */

const PRESS_HELD = 'data-astryx-press-held'

/** 按住或放开一块表面的按压。 */
export function setPressHeld(surface: Element, isHeld: boolean): void {
  surface.toggleAttribute(PRESS_HELD, isHeld)
}

/** 表面的按压是否被主人按住。 */
export function isPressHeld(surface: Element): boolean {
  return surface.hasAttribute(PRESS_HELD)
}
