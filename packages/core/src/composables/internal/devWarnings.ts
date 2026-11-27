import { devWarn } from '../useDevWarning.js'
import { isDevBuild } from './devBuild.js'

/**
 * @file devWarnings.ts
 * @input 组件名、消息和可选的去重 key
 * @output `createDevWarnings`：一组按 key 去重的开发期警告
 * @position 内部工具，对应原版 Astryx 的 `createDevWarnings`。给不在组件里的长寿对象
 *   （比如列表重排控制器）用。
 */

/** 一组按 key 去重的开发期警告：同一个 key 只打一次。 */
export type DevWarnings = (component: string, message: string, key?: string) => void

/** 每个 key 只警告一次，key 默认就是消息本身。生产构建里什么也不做。 */
export function createDevWarnings(): DevWarnings {
  const warned = new Set<string>()
  return (component, message, key = message) => {
    if (!isDevBuild() || warned.has(key))
      return
    warned.add(key)
    devWarn(component, message)
  }
}
