<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { DiffLines } from './diff.js'
import type { CodeBlockSize, SyntaxToken, TokenLine } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { useScrollableArea } from '../composables/useScrollableArea.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { applyHighlightRanges } from './highlightRanges.js'

defineOptions({ name: 'AstryxCodeBlockContent' })

const props = defineProps<{
  diff?: DiffLines | null
  hasLineNumbers: boolean
  highlightSet: Set<number> | null
  isCompact: boolean
  isWrapped: boolean
  lines: string[]
  maxHeight?: number | string
  mode: 'ranges' | 'spans'
  scrollLabel: string
  size: CodeBlockSize
  startLineNumber: number
  tokenLines: TokenLine[]
}>()

interface CodePart {
  text: string
  type: string | null
}

interface LineChunk {
  lines: string[]
  start: number
}

const CHUNK_SIZE = 20
const CHUNK_THRESHOLD = 100

const code = useTemplateRef<HTMLElement>('code')
const scrollEl = shallowRef<HTMLElement | null>(null)
useScrollbars(scrollEl)

// 视口自己的键盘停靠点和名字仍由模板写；这里只读横向滚动状态，给手机上藏着内容的那一侧淡出。
const scrollArea = useScrollableArea({ axis: 'inline', keyboardAccess: { owner: 'content' } })

function bindScroll(element: unknown): void {
  scrollEl.value = element instanceof HTMLElement ? element : null
  scrollArea.viewport(element)
}

const fadeAttrs = computed(() => {
  const { inline } = scrollArea.state.value
  return {
    'data-scrollable-inline': inline.isScrollable ? 'true' : undefined,
    'data-scroll-inline-start': inline.atStart ? 'true' : undefined,
    'data-scroll-inline-end': inline.atEnd ? 'true' : undefined,
  }
})

const chunks = computed<LineChunk[]>(() => {
  const lines = props.lines

  if (lines.length < CHUNK_THRESHOLD)
    return [{ start: 0, lines }]

  const result: LineChunk[] = []

  for (let start = 0; start < lines.length; start += CHUNK_SIZE)
    result.push({ start, lines: lines.slice(start, start + CHUNK_SIZE) })

  return result
})

const isChunked = computed(() => chunks.value.length > 1)

/** Token runs for one line, with the untouched text between them. */
function buildParts(line: string, tokens: SyntaxToken[]): CodePart[] {
  if (tokens.length === 0)
    return [{ text: line || '\u200B', type: null }]

  const parts: CodePart[] = []
  let cursor = 0

  for (const token of tokens) {
    if (token.start > cursor)
      parts.push({ text: line.slice(cursor, token.start), type: null })

    const end = Math.min(token.end, line.length)

    parts.push({ text: line.slice(token.start, end), type: token.type })
    cursor = end
  }

  if (cursor < line.length)
    parts.push({ text: line.slice(cursor), type: null })

  return parts.length > 0 ? parts : [{ text: '\u200B', type: null }]
}

function lineText(index: number): string {
  const diff = props.diff
  const line = props.lines[index] ?? ''

  if (diff == null)
    return line

  if (diff.kinds[index] === 'header')
    return line

  return diff.content[index] ?? ''
}

function lineTokens(index: number): SyntaxToken[] {
  if (props.diff?.kinds[index] === 'header')
    return []

  return props.tokenLines[index] ?? []
}

const lineParts = computed<CodePart[][]>(() =>
  props.lines.map((_, index) => buildParts(lineText(index), lineTokens(index))),
)

function diffKind(index: number): string | undefined {
  const kind = props.diff?.kinds[index]

  if (kind == null || kind === 'context')
    return undefined

  return kind
}

function glyph(index: number): string {
  return props.diff?.glyphs[index] || ' '
}

const codeStyle = computed<StyleValue>(() => {
  const style: CSSProperties = {}

  if (props.hasLineNumbers)
    style['--astryx-code-block-gutter-width'] = `${String(props.startLineNumber + props.lines.length - 1).length}ch`

  return style
})

const scrollStyle = computed<StyleValue>(() => (
  props.maxHeight == null
    ? undefined
    : { maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight }
))

function isHighlighted(index: number): boolean {
  return props.highlightSet?.has(props.startLineNumber + index) ?? false
}

let removeRanges: (() => void) | null = null

function paintRanges(): void {
  removeRanges?.()
  removeRanges = null

  const element = code.value

  if (props.mode !== 'ranges' || element == null)
    return

  removeRanges = applyHighlightRanges(element, props.tokenLines)
}

watch(
  [() => props.mode, () => props.tokenLines, () => props.lines],
  () => paintRanges(),
  { flush: 'post' },
)

onMounted(() => {
  void nextTick(paintRanges)
})

onBeforeUnmount(() => removeRanges?.())
</script>

<template>
  <div
    :ref="bindScroll"
    class="astryx-code-block__scroll"
    dir="ltr"
    role="group"
    tabindex="0"
    :aria-label="scrollLabel"
    :style="scrollStyle"
    v-bind="fadeAttrs"
  >
    <div class="astryx-code-block__wrap" :class="{ 'astryx-code-block__wrap--compact': isCompact }">
      <code
        ref="code"
        class="astryx-code-block__code"
        :data-numbered="hasLineNumbers || undefined"
        :data-size="size"
        :data-wrapped="isWrapped || undefined"
        :style="codeStyle"
      >
        <div
          v-for="chunk in chunks"
          :key="chunk.start"
          :class="{ 'astryx-code-block__chunk': isChunked }"
          :style="isChunked ? { containIntrinsicBlockSize: `auto ${chunk.lines.length}lh` } : undefined"
        >
          <div
            v-for="(line, offset) in chunk.lines"
            :key="chunk.start + offset"
            class="astryx-code-block__line"
            :class="{
              'astryx-code-block__line--diff': diff != null,
              'astryx-code-block__line--highlighted': isHighlighted(chunk.start + offset),
              'astryx-code-block__line--numbered': hasLineNumbers,
            }"
            :data-diff="diffKind(chunk.start + offset)"
            :data-line="startLineNumber + chunk.start + offset"
          >
            <span
              v-if="diff != null"
              class="astryx-code-block__diff-marker"
              data-diff-marker
            >{{ glyph(chunk.start + offset) }}</span>
            <span v-if="mode === 'spans' || diff != null" class="astryx-code-block__line-content" dir="auto">
              <template v-for="(part, index) in lineParts[chunk.start + offset]" :key="index">
                <span v-if="part.type != null" :class="`astryx-token-${part.type}`">{{ part.text }}</span>
                <template v-else>{{ part.text }}</template>
              </template>
            </span>
            <span v-else class="astryx-code-block__line-content" dir="auto">{{ line || '\u200B' }}</span>
          </div>
        </div>
      </code>
    </div>
  </div>
</template>
