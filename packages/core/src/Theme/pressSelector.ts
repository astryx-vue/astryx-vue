/**
 * 主题里写的 `:active` 跟随触屏按压模型：鼠标保留 `:active`，粗指针下
 * 改看按压控制器写的 `data-astryx-press="on"`，手指刚落下或滚动时不会亮。
 * 控制器只标记最里层的可按元素，这个选择器让主题的按压样式既落在被标记的
 * 元素上，也落在它里面（直到下一个可按元素）和包着它的不可按元素上。
 * 每一支的特异性都等于一个属性选择器，和 `:active` 的一个伪类相当。
 */

const PRESS_ON = '[data-astryx-press="on"]'
const PRESSABLE = '[data-astryx-pressable]'

export const PRESS_BELIEVED_SELECTOR
  = `:is(${PRESS_ON}, `
    + `${PRESS_ON} :where(:not(${PRESSABLE}, ${PRESS_ON} ${PRESSABLE} *)), `
    + `:where(:not(${PRESSABLE})):has(${PRESS_ON}))`

/** 粗指针（手指）媒体查询，不带 `@media`。 */
export const COARSE_POINTER_QUERY = '(pointer: coarse)'

const ACTIVE_PSEUDO = /:active(?![-\w])/g

/** 这个伪类里有没有 `:active`。 */
export function hasActivePseudo(pseudo: string): boolean {
  return new RegExp(ACTIVE_PSEUDO.source).test(pseudo)
}

/** 把伪类里的 `:active` 换成触屏按压选择器。 */
export function pressedPseudo(pseudo: string): string {
  return pseudo.replace(ACTIVE_PSEUDO, PRESS_BELIEVED_SELECTOR)
}
