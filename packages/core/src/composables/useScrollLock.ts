/**
 * 对应原版 Astryx 的 `hooks/useScrollLock`。
 *
 * 按引用计数锁住 body 滚动。实现放在 internal，测试用的重置函数不从这里再导出。
 */
export { useScrollLock } from './internal/scrollLock.js'
