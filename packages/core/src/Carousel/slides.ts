import type { PropType, VNode } from 'vue'
import { Comment, defineComponent, Fragment, Text } from 'vue'

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

export const CarouselSlideHost = defineComponent({
  name: 'CarouselSlideHost',
  props: {
    node: { type: Object as PropType<VNode>, required: true },
  },
  setup(props) {
    return () => props.node
  },
})
