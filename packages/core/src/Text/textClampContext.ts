import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

/**
 * @file textClampContext.ts
 * @output TextClampContext：在一段会截断行数的 Text 里面时为 true
 * @position 内部；Text 提供，Link 读取
 *
 * 链接放在 `<Text :max-lines>` 里时，要变成普通的行内元素，截断才能从链接中间切开；
 * 一个 inline-flex 的盒子是整块的，截断切不动它。
 * 浮层里的内容已经不在那段文字里，所以进浮层就重置回 false。
 */
export const TextClampContext = defineLayerScopedKey<ComputedRef<boolean>>('astryx-text-clamp', computed(() => false))
