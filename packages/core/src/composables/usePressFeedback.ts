import { getCurrentInstance, getCurrentScope, onMounted, onScopeDispose } from 'vue'
import { installPressFeedback, PRESS_ACTION_ATTRIBUTE, PRESS_CONTAINER_ATTRIBUTE, PRESSABLE_ATTRIBUTE } from './internal/pressFeedback.js'
import '../../styles/pressable.css'

export interface UsePressFeedbackOptions {
  /**
   * 要不要带上默认的按压色（`astryx-pressable` 类，在 `::after` 上画一层）。
   * 组件自己在样式里读 `--_press-paint-image` 画按压时传 false，只拿标记。
   * @default true
   */
  hasOverlay?: boolean
  /**
   * 这个元素是可按容器（列表行、Token、可点卡片这类，里面还放着别的控件）。
   * 手指按在里面别的控件上时，那一下不会触发容器自己的动作，所以容器不亮。
   * 容器自己的动作元素摊上 `pressActionProps`，按它照样算按容器。
   * @default false
   */
  isContainer?: boolean
}

export interface UsePressFeedbackReturn {
  /**
   * 用 `v-bind` 摊到「画按压」的那个元素上。
   * 里面总有 `data-astryx-pressable` 标记；`hasOverlay` 为真时还有 `class: 'astryx-pressable'`。
   */
  pressableProps: Readonly<Record<string, string>>
  /** 可按容器自己的动作元素（看不见的链接或按钮、主按钮）上摊的标记：按它就是按容器。 */
  pressActionProps: Readonly<Record<string, string>>
}

const MARKER_ONLY: Readonly<Record<string, string>> = Object.freeze({ [PRESSABLE_ATTRIBUTE]: '' })
const WITH_OVERLAY: Readonly<Record<string, string>> = Object.freeze({ [PRESSABLE_ATTRIBUTE]: '', class: 'astryx-pressable' })
const CONTAINER_MARKER_ONLY: Readonly<Record<string, string>> = Object.freeze({ ...MARKER_ONLY, [PRESS_CONTAINER_ATTRIBUTE]: '' })
const CONTAINER_WITH_OVERLAY: Readonly<Record<string, string>> = Object.freeze({ ...WITH_OVERLAY, [PRESS_CONTAINER_ATTRIBUTE]: '' })
const ACTION_MARKER: Readonly<Record<string, string>> = Object.freeze({ [PRESS_ACTION_ATTRIBUTE]: '' })

/**
 * 对应原版 Astryx 的 `hooks/usePressFeedback`。
 *
 * 把一个元素标成触屏按压模型的可按表面，并确保文档级控制器已经装上。
 *
 * 手指下，CSS 的 `:active` 落手就亮，滚动开始了还可能亮着。按压模型反过来：
 * 滚动视图外，手指落下那一帧就亮；滚动视图里先等 150 毫秒确认是按压。
 * 手指挪动超过 10 像素或者页面滚动，立刻作废，这次手势里不再亮回来；
 * 太快的轻点在抬手时补亮；抬手后按主题的退出时长淡出。鼠标不受影响，`:active` 照旧。
 *
 * 一个文档只有一个控制器：第一个挂载的可按组件装上，最后一个卸载时拆掉。
 * 调用它不会给元素加监听或状态，一次按压只改一个属性。服务端不装。
 */
export function usePressFeedback(options: UsePressFeedbackOptions = {}): UsePressFeedbackReturn {
  let release: (() => void) | null = null
  const install = (): void => {
    release ??= installPressFeedback()
  }

  if (getCurrentInstance() != null)
    onMounted(install)
  else
    install()

  if (getCurrentScope() != null) {
    onScopeDispose(() => {
      release?.()
      release = null
    })
  }

  const pressableProps = options.isContainer === true
    ? (options.hasOverlay === false ? CONTAINER_MARKER_ONLY : CONTAINER_WITH_OVERLAY)
    : (options.hasOverlay === false ? MARKER_ONLY : WITH_OVERLAY)
  return { pressableProps, pressActionProps: ACTION_MARKER }
}
