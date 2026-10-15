<script lang="ts">
import type { PropType, StyleValue, VNode } from 'vue'
import type { MdNode } from './ast.js'
import type { MarkdownProps } from './types.js'
import { computed, defineComponent, h, ref } from 'vue'
import { useIndicator } from '../Indicator/useIndicator.js'
import { useAstryxMessages } from '../locale/index.js'
import { createIncrementalMarkdownState, parseMarkdown, parseMarkdownIncremental } from './parse.js'
import { assignHeadingSlugs, collectDefinitions, renderMarkdownBlocks, slotText } from './render.js'
import { computeBoundaries, parseCssDuration } from './streaming.js'
import '../../styles/markdown.css'

function fadeSpanCount(): number {
  const fallback = 165
  let duration = fallback
  if (typeof document !== 'undefined') {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--astryx-duration-fast-max')
    duration = parseCssDuration(raw) ?? fallback
  }
  const tick = Math.max(4, Math.round(duration / 10))
  return Math.min(12, Math.max(1, Math.ceil(duration / tick)))
}

export default defineComponent({
  name: 'AstryxMarkdown',
  inheritAttrs: false,
  props: {
    content: { type: String, default: undefined },
    contentAlign: { type: String as PropType<MarkdownProps['contentAlign']>, default: 'start' },
    contentWidth: { type: [Number, String] as PropType<MarkdownProps['contentWidth']>, default: undefined },
    components: { type: Object as PropType<MarkdownProps['components']>, default: undefined },
    density: { type: String as PropType<MarkdownProps['density']>, default: 'default' },
    display: { type: String as PropType<MarkdownProps['display']>, default: 'block' },
    headingLevelStart: { type: Number as PropType<MarkdownProps['headingLevelStart']>, default: 1 },
    isStreaming: { type: Boolean, default: false },
    onLinkClick: { type: Function as PropType<MarkdownProps['onLinkClick']>, default: undefined },
    sources: { type: Object as PropType<MarkdownProps['sources']>, default: undefined },
  },
  setup(props, { attrs, slots, expose }) {
    const root = ref<HTMLElement | null>(null)
    expose({ element: computed(() => root.value) })

    const messages = useAstryxMessages()
    const checkboxIndicator = useIndicator('checkbox')
    const slotSource = ref('')
    const source = computed(() => props.content ?? slotSource.value)
    const incremental = createIncrementalMarkdownState()
    const cache = new Map<MdNode, VNode>()
    let boundaries: number[] = []
    let previousLength = 0

    return () => {
      if (props.content == null) {
        const text = slotText(slots.default?.())
        if (slotSource.value !== text)
          slotSource.value = text
      }

      if (!props.isStreaming) {
        incremental.settledEnd = 0
        incremental.settledSource = ''
        incremental.blocks = []
      }

      const shown = source.value
      const inline = props.display === 'inline'
      const parsed = inline || !props.isStreaming
        ? { blocks: parseMarkdown(shown).children ?? [], settledCount: 0 }
        : parseMarkdownIncremental(shown, incremental, { trimTail: true })

      if (!props.isStreaming || shown.length === 0) {
        boundaries = []
        previousLength = 0
      }
      else {
        boundaries = computeBoundaries(boundaries, previousLength, fadeSpanCount())
      }

      const blocks = parsed.blocks
      const ctx = {
        components: props.components,
        fade: {
          active: props.isStreaming && boundaries.length > 0,
          boundaries,
          offset: 0,
        },
        definitions: collectDefinitions(blocks),
        density: props.density ?? 'default',
        headingLevelStart: props.headingLevelStart ?? 1,
        inline,
        listDepth: 0,
        messages: messages.value.markdown,
        onLinkClick: props.onLinkClick,
        slugs: assignHeadingSlugs(blocks),
        sources: props.sources,
        citationOrder: new Map(),
        checkboxIndicator: checkboxIndicator.value,
      }
      const children = renderMarkdownBlocks(blocks, inline ? 0 : parsed.settledCount, ctx, cache)
      previousLength = ctx.fade.offset

      const { class: attrClass, style: attrStyle, ...rest } = attrs
      const measure = props.contentWidth == null || props.contentWidth === ''
        ? undefined
        : (typeof props.contentWidth === 'number' ? `${props.contentWidth}px` : props.contentWidth)
      const style: StyleValue[] = []
      if (attrStyle != null)
        style.push(attrStyle as StyleValue)
      if (measure != null)
        style.push({ '--astryx-markdown-measure': measure })

      return h(inline ? 'span' : 'div', {
        ...rest,
        'ref': root,
        'class': ['astryx-markdown', inline ? 'astryx-markdown--inline' : null, attrClass],
        style,
        'role': inline || rest.role != null ? rest.role : 'document',
        'data-density': props.density,
        'data-align': props.contentAlign,
        'data-streaming': props.isStreaming || undefined,
      }, children)
    }
  },
})
</script>
