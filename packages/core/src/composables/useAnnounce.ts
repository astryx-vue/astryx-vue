/**
 * 对应原版 Astryx 的 `hooks/useAnnounce`。
 *
 * 读屏播报。实现放在 internal，测试用的重置函数不从这里再导出，避免进包入口。
 */
export { useAnnounce } from './internal/announce.js'
export type { AnnounceFn, AnnouncePoliteness } from './internal/announce.js'
