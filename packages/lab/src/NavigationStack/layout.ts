import type { CSSProperties } from 'vue'
import { navigation } from './navigationMotion'

/** 栏高 44px：各屏的内容从栏下面滚过去。样式里的 44px 和这里是同一个值。 */
export const BAR_HEIGHT = 44

/**
 * 视差遮暗的黑色，透明度是 UIKit 表里实测的值。它在任何外观下都是黑色，不是主题色，
 * 所以由这里按表里的数值内联写入。
 */
export const dimStyle: CSSProperties = { backgroundColor: `rgba(0, 0, 0, ${navigation.dimmingAlpha})` }
