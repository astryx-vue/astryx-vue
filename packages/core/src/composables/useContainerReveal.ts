import type { CSSProperties, MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

export interface UseContainerRevealOptions {
  /**
   * 为 false 时什么样式都不加，里面的内容一直可见。
   * 每次调用都会重新读，所以可以随组件自己的开关变。
   */
  isEnabled?: MaybeRefOrGetter<boolean>
}

export interface ContainerRevealOptions {
  /**
   * 指针必须停这么多毫秒，悬停揭示才开始。键盘和粗指针不等待。
   */
  hoverDelay?: number
  /**
   * 把容器钉在揭示或收起。`inactive` 仍让键盘焦点和粗指针看见内容。
   */
  forceState?: 'active' | 'inactive'
}

export interface ContentRevealOptions {
  /** 反过来：平时可见，悬停时藏起。只影响指针，键盘和触摸仍看得到。 */
  isRevealInverted?: boolean
  /** 藏起时仍占位，避免布局跳动。 */
  isLayoutPreserved?: boolean
  /** 这一块自己的可见性，不跟容器走。`hidden` 在焦点进来时仍会露出。 */
  forceVisibility?: 'shown' | 'hidden'
}

/**
 * 悬停或键盘焦点时才露出行内操作。状态写在容器的自定义属性上，
 * 嵌套容器会盖住外层，所以两层不会串。内容用透明度和定位藏起，不从无障碍树里拿掉。
 */
export interface UseContainerReveal {
  containerProps: (reveal?: ContainerRevealOptions) => { class?: string | Record<string, boolean>, style?: CSSProperties }
  contentProps: (reveal?: ContentRevealOptions) => { class?: string | Record<string, boolean> }
}

export function useContainerReveal(options: UseContainerRevealOptions = {}): UseContainerReveal {
  function containerProps(reveal: ContainerRevealOptions = {}): { class?: string | Record<string, boolean>, style?: CSSProperties } {
    if (toValue(options.isEnabled) === false)
      return {}
    return {
      class: {
        'astryx-reveal': true,
        'astryx-reveal--inactive': reveal.forceState === 'inactive',
        'astryx-reveal--active': reveal.forceState === 'active',
      },
      style: reveal.hoverDelay ? { '--_hover-delay': `${reveal.hoverDelay}ms` } as CSSProperties : undefined,
    }
  }

  function contentProps(reveal: ContentRevealOptions = {}): { class?: string | Record<string, boolean> } {
    if (toValue(options.isEnabled) === false)
      return {}
    const inverted = reveal.isRevealInverted === true
    const preserved = reveal.isLayoutPreserved === true
    return {
      class: {
        'astryx-reveal__content': !inverted,
        'astryx-reveal__content--preserve': !inverted && preserved,
        'astryx-reveal__conceal': inverted,
        'astryx-reveal__conceal--preserve': inverted && preserved,
        'astryx-reveal__shown': reveal.forceVisibility === 'shown',
        'astryx-reveal__hidden': reveal.forceVisibility === 'hidden' && !preserved,
        'astryx-reveal__hidden--preserve': reveal.forceVisibility === 'hidden' && preserved,
      },
    }
  }

  return { containerProps, contentProps }
}
