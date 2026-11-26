import type { AnnouncePoliteness, AnnounceReceipt, AnnounceTarget } from './announceChannel.js'
import { clearAnnouncements, writeAnnouncement } from './announceChannel.js'

/**
 * 对应原版 Astryx 的 `hooks/useAnnounce`。
 *
 * 读屏播报。polite / assertive 两块区域在第一次使用时创建，之后一直留在文档里，
 * 只改文字。区域如果和文字一起出生，很多读屏软件不会念。
 * 同一帧里的多条消息按顺序连在一起念，一模一样的重复只念一次；空消息清掉还没念出去的。
 * 原生模态对话框打开时，播报写进那个对话框里的区域（body 上的区域被挡在外面，读屏念不到）。
 */

export type { AnnouncePoliteness } from './announceChannel.js'
export { resetLiveRegionsForTest } from './announceChannel.js'

export type AnnounceFn = (message: string, politeness?: AnnouncePoliteness) => void

export interface UseAnnounceOptions {
  /**
   * 这个播报者的新消息会收回它自己上一条还没念出去的消息，不管两条紧迫度是否相同。
   * 新消息写进它自己紧迫度的区域；别的播报者的消息照样连在一起。
   * 适合每次按键都重新说一遍状态的组件：快速输入时，念出来的只是最后一条，不是一串过期的状态。
   * @default false
   */
  hasReplace?: boolean
}

/** 组件内部用的播报者：和 `useAnnounce` 一样，另外能指定调用方所在的元素，并拿到收据。 */
export interface Announcer {
  (message: string, politeness?: AnnouncePoliteness, target?: AnnounceTarget): AnnounceReceipt | null
}

export function useAnnouncer(options: UseAnnounceOptions = {}): Announcer {
  let lastReceipt: AnnounceReceipt | null = null
  return (message, politeness = 'polite', target = {}) => {
    if (options.hasReplace === true) {
      lastReceipt?.withdraw()
      lastReceipt = null
    }
    if (message === '') {
      clearAnnouncements(politeness, target)
      return null
    }
    const receipt = writeAnnouncement(message, politeness, target)
    if (options.hasReplace === true)
      lastReceipt = receipt
    return receipt
  }
}

export function useAnnounce(options: UseAnnounceOptions = {}): AnnounceFn {
  const announcer = useAnnouncer(options)
  return (message, politeness) => {
    announcer(message, politeness)
  }
}
