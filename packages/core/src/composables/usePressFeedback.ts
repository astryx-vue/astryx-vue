/**
 * 对应原版 Astryx 的 `hooks/usePressFeedback`。
 *
 * 手指按下去时，CSS 的 `:active` 会在手指落下的瞬间就亮，滚动已经开始了它可能还亮着。
 * 这里的按压模型反过来：先等 150 毫秒，确认这真是按压；手指一动超过 10 像素、
 * 或者页面滚走了，马上作废，本次按压里不再亮回来；快速点一下在抬手时补上；
 * 松手后 200 毫秒淡出。这几个时间和系统列表的手感一致。
 *
 * 一个文档级控制器给所有带标记的元素做这件事（第一个用到的组件装上，最后一个卸载时拆掉），
 * 所以调用这个组合式函数不会给你的元素加监听，也不加状态。
 *
 * 实现放在 internal，测试用的重置函数不从这里再导出。
 */
export { usePressFeedback } from './internal/pressFeedback.js'
export type { UsePressFeedbackReturn } from './internal/pressFeedback.js'
