import type { PropType, VNode } from 'vue'
import { Comment, defineComponent, Fragment, h, onUpdated, Text } from 'vue'

export function flattenSlides(nodes: readonly VNode[]): VNode[] {
  const slides: VNode[] = []
  for (const node of nodes) {
    if (node.type === Comment)
      continue
    if (node.type === Fragment && Array.isArray(node.children)) {
      slides.push(...flattenSlides(node.children as VNode[]))
      continue
    }
    if (node.type === Text && String(node.children ?? '').trim() === '')
      continue
    slides.push(node)
  }
  return slides
}

/**
 * 在自己的渲染函数里读取轮播的默认插槽，并给每张卡片套上分组外壳。
 *
 * 插槽必须在渲染时调用：Vue 才能追踪插槽里用到的响应式数据，
 * 父组件传下新的插槽函数时也能立刻看到最新内容。放进 `computed` 或 `watch`
 * 会得到缓存的旧结果，在 `setup` 里求值还会触发 Vue 的警告。
 */
export const CarouselItems = defineComponent({
  name: 'CarouselItems',
  props: {
    content: { type: Function as PropType<() => VNode[]>, default: undefined },
    label: { type: Function as PropType<(index: number, total: number) => string>, required: true },
  },
  emits: ['update'],
  setup(props, { emit }) {
    // 卡片数量或内容变了以后，让外层重新量一遍滚动范围。首次挂载由外层自己量。
    onUpdated(() => emit('update'))

    return () => {
      const slides = flattenSlides(props.content?.() ?? [])
      return slides.map((slide, index) => h('div', {
        'key': index,
        'class': 'astryx-carousel__item',
        'role': 'group',
        'aria-roledescription': 'slide',
        'aria-label': props.label(index + 1, slides.length),
      }, [slide]))
    }
  },
})
