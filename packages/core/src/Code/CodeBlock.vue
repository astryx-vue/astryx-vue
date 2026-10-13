<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { CodeBlockEmits, CodeBlockProps, TokenLine } from './types.js'
import { computed, onBeforeUnmount, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { useClipboard } from '../composables/useClipboard.js'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import CodeBlockContent from './CodeBlockContent.vue'
import { syntaxThemeStyle } from './syntaxTheme.js'
import { flatTokensToLines, SYNC_TOKENIZE_THRESHOLD, tokenize, tokenizeAsync } from './tokenizer.js'
import '../../styles/code.css'

defineOptions({ name: 'AstryxCodeBlock', inheritAttrs: false })

const props = withDefaults(defineProps<CodeBlockProps>(), {
  codeLabel: 'Code',
  collapsibleThreshold: 10,
  container: 'card',
  copiedLabel: 'Copied',
  copyLabel: 'Copy code',
  hasCopyButton: true,
  hasLanguageLabel: true,
  hasLineNumbers: false,
  highlightMode: 'auto',
  isCollapsible: false,
  isWrapped: false,
  language: 'plaintext',
  size: 'md',
  width: 'fit-content',
})

const emit = defineEmits<CodeBlockEmits>()

const attrs = useAttrs()
const root = useTemplateRef<HTMLPreElement>('root')
const element = computed(() => root.value ?? null)

defineExpose({ element })

const lines = computed<string[]>(() => {
  const split = props.code.split('\n')

  if (split.length > 1 && split[split.length - 1] === '')
    split.pop()

  return split
})

const asyncTokens = ref<{ code: string, language: string, tokens: TokenLine[] } | null>(null)
let pendingLoad: AbortController | null = null

const syncTokenLines = computed<TokenLine[] | null>(() => {
  if (props.tokenizer != null)
    return flatTokensToLines(props.tokenizer(props.code, props.language), props.code)

  if (props.code.length >= SYNC_TOKENIZE_THRESHOLD)
    return null

  return tokenize(props.code, props.language)
})

const tokenLines = computed<TokenLine[]>(() => {
  const sync = syncTokenLines.value

  if (sync != null)
    return sync

  const async = asyncTokens.value

  if (async != null && async.code === props.code && async.language === props.language)
    return async.tokens

  return []
})

async function loadTokens(): Promise<void> {
  if (props.tokenizer != null || props.code.length < SYNC_TOKENIZE_THRESHOLD)
    return

  const code = props.code
  const language = props.language
  const controller = new AbortController()

  pendingLoad?.abort()
  pendingLoad = controller

  try {
    const tokens = await tokenizeAsync(code, language, controller.signal)

    if (!controller.signal.aborted)
      asyncTokens.value = { code, language, tokens }
  }
  catch {
    if (!controller.signal.aborted)
      asyncTokens.value = { code, language, tokens: [] }
  }
}

watch(
  [() => props.code, () => props.language, () => props.tokenizer],
  () => {
    void loadTokens()
  },
  { immediate: true },
)

onBeforeUnmount(() => pendingLoad?.abort())

function supportsHighlightApi(): boolean {
  return typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined'
}

function isSafari(): boolean {
  if (typeof navigator === 'undefined')
    return false

  const agent = navigator.userAgent

  return agent.includes('AppleWebKit') && !agent.includes('Chrome')
}

/** Safari ships the Highlight API objects but paints them unreliably in code. */
const paintMode = computed<'ranges' | 'spans'>(() => {
  if (props.highlightMode === 'spans' || !supportsHighlightApi())
    return 'spans'

  if (props.highlightMode === 'ranges')
    return 'ranges'

  return isSafari() ? 'spans' : 'ranges'
})

const highlightSet = computed<Set<number> | null>(() =>
  props.highlightLines == null ? null : new Set(props.highlightLines),
)

const languageLabel = computed(() =>
  props.hasLanguageLabel && props.language !== 'plaintext' ? props.language : null,
)

/** `filename — language`, omitting whichever half is missing. */
const headerText = computed(() => [props.title, languageLabel.value]
  .filter(part => part != null && part !== '')
  .join(' — '))

const showHeader = computed(() => headerText.value !== '')

const canCollapse = computed(() =>
  showHeader.value && props.isCollapsible && lines.value.length >= props.collapsibleThreshold,
)

const isCollapsed = ref(false)

watch(canCollapse, () => {
  isCollapsed.value = false
})

const regionId = `astryx-code-block-${useId()}`

/** Only interactive when collapsing is available, as the disclosure control. */
const titleControlAttrs = computed(() => {
  if (!canCollapse.value)
    return {}

  return {
    'role': 'button',
    'tabindex': 0,
    'aria-expanded': !isCollapsed.value,
    'aria-controls': regionId,
    'aria-label': headerLabel(),
  }
})

function headerLabel(): string | undefined {
  const hasTitle = props.title != null && props.title.trim() !== ''

  return !hasTitle && languageLabel.value == null ? props.codeLabel : undefined
}

function toggleCollapsed(): void {
  isCollapsed.value = !isCollapsed.value
}

function onTitleKeydown(event: KeyboardEvent): void {
  if (!canCollapse.value)
    return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleCollapsed()
  }
}

const { copy, isCopied } = useClipboard()

const copyButtonLabel = computed(() => (isCopied.value ? props.copiedLabel : props.copyLabel))

async function onCopy(): Promise<void> {
  if (await copy(props.code))
    emit('copy')
}

const rootStyle = computed<StyleValue>(() => {
  const style: CSSProperties = { width: props.width }

  if (props.width === 'fit-content') {
    style.minWidth = 'min(100%, 400px)'
    style.maxWidth = '100%'
  }

  return [attrs.style as StyleValue, props.syntaxTheme ? syntaxThemeStyle(props.syntaxTheme) : null, style]
})

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))
</script>

<template>
  <pre
    ref="root"
    v-bind="forwardedAttrs"
    class="astryx-code-block"
    :class="attrs.class"
    :data-container="container"
    :data-language="language"
    :data-size="size"
    :style="rootStyle"
  >
    <div
      v-if="showHeader"
      class="astryx-code-block__header astryx-code-block-header"
      :class="{ 'astryx-code-block__header--divided': hasLineNumbers }"
      :data-container="container"
      :data-language="language"
      :data-size="size"
    >
      <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- the interactive role, tabindex, and aria state are bound from `titleControlAttrs`, which the rule cannot see; it is the disclosure control when collapsing is available. -->
      <div
        v-bind="titleControlAttrs"
        class="astryx-code-block__title-control"
        :class="{ 'astryx-code-block__title-control--collapsible': canCollapse }"
        @click="canCollapse && toggleCollapsed()"
        @keydown="onTitleKeydown"
      >
        <span
          class="astryx-code-block__title astryx-code-block-title"
          :data-language="language"
          :data-size="size"
        >
          <span v-if="canCollapse" class="astryx-code-block__chevron">
            <Icon
              class="astryx-code-block__chevron-icon"
              :class="{ 'astryx-code-block__chevron-icon--expanded': !isCollapsed }"
              icon="chevronRight"
              size="xsm"
              color="inherit"
            />
          </span>{{ headerText }}
        </span>
      </div>
      <IconButton
        v-if="hasCopyButton"
        class="astryx-code-block-copy-button"
        variant="ghost"
        size="sm"
        :label="copyButtonLabel"
        :tooltip="copyLabel"
        @click.stop="onCopy"
      >
        <Icon :icon="isCopied ? 'check' : 'copy'" size="sm" color="inherit" />
      </IconButton>
    </div>
    <div
      v-if="canCollapse"
      :id="regionId"
      class="astryx-code-block__collapse"
      :class="{ 'astryx-code-block__collapse--collapsed': isCollapsed }"
      :inert="isCollapsed || undefined"
    >
      <div class="astryx-code-block__collapse-inner">
        <CodeBlockContent
          :has-line-numbers="hasLineNumbers"
          :highlight-set="highlightSet"
          :is-compact="showHeader && !hasLineNumbers"
          :is-wrapped="isWrapped"
          :lines="lines"
          :max-height="maxHeight"
          :mode="paintMode"
          :scroll-label="languageLabel ?? codeLabel"
          :size="size"
          :token-lines="tokenLines"
        />
      </div>
    </div>
    <CodeBlockContent
      v-else
      :has-line-numbers="hasLineNumbers"
      :highlight-set="highlightSet"
      :is-compact="showHeader && !hasLineNumbers"
      :is-wrapped="isWrapped"
      :lines="lines"
      :max-height="maxHeight"
      :mode="paintMode"
      :scroll-label="languageLabel ?? codeLabel"
      :size="size"
      :token-lines="tokenLines"
    />
    <IconButton
      v-if="!showHeader && hasCopyButton"
      class="astryx-code-block-copy-button astryx-code-block-copy-button--floating"
      variant="ghost"
      size="sm"
      :label="copyButtonLabel"
      :tooltip="copyLabel"
      @click.stop="onCopy"
    >
      <Icon :icon="isCopied ? 'check' : 'copy'" size="sm" color="inherit" />
    </IconButton>
  </pre>
  <VisuallyHidden role="status" aria-live="polite">
    {{ isCopied ? copiedLabel : '' }}
  </VisuallyHidden>
</template>
