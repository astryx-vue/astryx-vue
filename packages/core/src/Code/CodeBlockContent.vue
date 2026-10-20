<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { DiffLines } from './diff.js'
import type { CodeBlockSize, SyntaxToken, TokenLine } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
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
const scrollEl = useTemplateRef<HTMLElement>('scroll')
useScrollbars(scrollEl)

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
    style['--astryx-code-block-gutter-width'] = `${String(props.lines.length).length}ch`

  return style
})

const scrollStyle = computed<StyleValue>(() => (
  props.maxHeight == null
    ? undefined
    : { maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight }
))

function isHighlighted(index: number): boolean {
  return props.highlightSet?.has(index + 1) ?? false
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
    ref="scroll"
    class="astryx-code-block__scroll"
    role="group"
    tabindex="0"
    :aria-label="scrollLabel"
    :style="scrollStyle"
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
            :data-line="chunk.start + offset + 1"
          >
            <span
              v-if="diff != null"
              class="astryx-code-block__diff-marker"
              data-diff-marker
            >{{ glyph(chunk.start + offset) }}</span>
            <span v-if="mode === 'spans' || diff != null" class="astryx-code-block__line-content">
              <template v-for="(part, index) in lineParts[chunk.start + offset]" :key="index">
                <span v-if="part.type != null" :class="`astryx-token-${part.type}`">{{ part.text }}</span>
                <template v-else>{{ part.text }}</template>
              </template>
            </span>
            <template v-else>{{ line || '\u200B' }}</template>
          </div>
        </div>
      </code>
    </div>
  </div>
</template>
