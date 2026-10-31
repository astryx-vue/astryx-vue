<script setup lang="ts">
import type { LexicalEditor } from 'lexical'
import type { RichTextEditorEmits, RichTextEditorExposed, RichTextEditorProps, RichTextEditorSlots } from './types.js'
import { Field, useAstryxMessages, VisuallyHidden } from '@astryx-vue/core'
import { $generateHtmlFromNodes } from '@lexical/html'
import { $getRoot, $isParagraphNode } from 'lexical'
import { computed, onBeforeUnmount, onMounted, provide, shallowRef, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { $exportMarkdownKeepingSource } from '../markdownSource.js'
import { DEFAULT_TRANSFORMERS } from '../markdownTable.js'
import { editorKey } from './context.js'
import { createRichTextEditor } from './createEditor.js'
import { DecoratorTeleports } from './DecoratorTeleports.js'
import { useRichTextMessages } from './messages.js'
import { CodeBlockHeaderPlugin, CodeSyntaxPlugin, TaskCheckboxPlugin } from './plugins/index.js'
import '../../styles/richtext-document.css'
import '../../styles/richtext-editor.css'

defineOptions({ name: 'AstryxRichTextEditor', inheritAttrs: false })

const props = withDefaults(defineProps<RichTextEditorProps>(), {
  statusVariant: 'attached',
  minHeight: '4.5rem',
  size: 'md',
  hasMarkdownShortcuts: true,
  namespace: 'astryx-editor',
})
const emit = defineEmits<RichTextEditorEmits>()
defineSlots<RichTextEditorSlots>()
const attrs = useAttrs()
const t = useRichTextMessages()
const coreMessages = useAstryxMessages()

/** 清空时用的状态：根下面一个空段落。用 `setEditorState` 重置，也会触发 `change`。 */
const EMPTY_EDITOR_STATE = JSON.stringify({
  root: {
    children: [{ children: [], direction: null, format: '', indent: 0, type: 'paragraph', version: 1 }],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})

/** 字数提示在超过上限的这个比例之后开始朗读。和 TextArea 一致。 */
const COUNTER_WARNING_THRESHOLD = 0.8

const id = useId()
const inputId = `astryx-rich-text-${id}`
const placeholderId = `${inputId}-placeholder`
const counterId = `${inputId}-counter`
const tabEscapeHintId = `${inputId}-tab-escape`

const surface = useTemplateRef<HTMLDivElement>('surface')
const editor = shallowRef<LexicalEditor>()
const isEmpty = shallowRef(true)
const charCount = shallowRef(0)

// 编辑器的外框属性：只读和禁用要分开表达。只读仍可聚焦、读作只读；禁用不在 Tab 顺序里、读作禁用。
const editable = computed(() => !props.isReadOnly && !props.isDisabled)

const tabEscapeHint = computed(() => props.tabEscapeHint ?? t('tabEscapeHint'))
const hasTabEscapeHint = computed(() => editable.value && tabEscapeHint.value !== '')

function describedBy(fieldDescribedBy?: string): string | undefined {
  return [
    fieldDescribedBy,
    props.placeholder ? placeholderId : null,
    props.maxLength != null ? counterId : null,
    hasTabEscapeHint.value ? tabEscapeHintId : null,
  ].filter(Boolean).join(' ') || undefined
}

const isOverLimit = computed(() => props.maxLength != null && charCount.value > props.maxLength)
const counterAnnouncement = computed(() => {
  const max = props.maxLength
  if (max == null || charCount.value < max * COUNTER_WARNING_THRESHOLD)
    return ''
  // 和 TextArea 用同一套文案，单复数和各语言的说法都由 core 处理。
  return charCount.value > max
    ? coreMessages.value.textArea.charactersOverLimit(charCount.value - max)
    : coreMessages.value.textArea.charactersRemaining(max - charCount.value)
})

function cssLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

/** 把编辑器的根元素设成可编辑区，并补上 Lexical 不会给的无障碍属性。 */
function syncSurfaceAttributes(root: HTMLElement | null): void {
  if (root === null)
    return
  root.id = inputId
  // 原生的 contenteditable 要自己管：Lexical 只负责监听这个元素，不会替我们设。
  root.contentEditable = editable.value ? 'true' : 'false'
  root.setAttribute('role', 'textbox')
  root.setAttribute('aria-multiline', 'true')
  root.classList.add('astryx-richtext-editor__content')
  root.style.setProperty('--astryx-richtext-min-height', cssLength(props.minHeight))
  setOrRemove(root, 'aria-required', props.isRequired && !props.isOptional ? 'true' : null)
  setOrRemove(root, 'aria-invalid', props.status?.type === 'error' ? 'true' : null)
  setOrRemove(root, 'aria-placeholder', props.placeholder ?? null)
  // Lexical 把所有不可编辑的编辑器都读作「只读」并移出 Tab 顺序。这里把两种状态分开：
  // 只读仍可聚焦、读作只读；禁用读作禁用，不在 Tab 顺序里。
  root.removeAttribute('aria-disabled')
  root.removeAttribute('aria-readonly')
  if (props.isDisabled) {
    root.setAttribute('aria-disabled', 'true')
    root.removeAttribute('tabindex')
  }
  else if (props.isReadOnly) {
    root.setAttribute('aria-readonly', 'true')
    root.tabIndex = 0
  }
  else {
    root.removeAttribute('tabindex')
  }
}

function setOrRemove(element: HTMLElement, name: string, value: string | null): void {
  if (value === null)
    element.removeAttribute(name)
  else
    element.setAttribute(name, value)
}

function labelAttributes(root: HTMLElement | null, labelId: string, fieldDescribedBy: string | undefined): void {
  if (root === null)
    return
  if (props.isLabelHidden)
    root.setAttribute('aria-label', props.label)
  else
    root.setAttribute('aria-labelledby', labelId)
  setOrRemove(root, 'aria-describedby', describedBy(fieldDescribedBy) ?? null)
}

const labelState = { labelId: '', describedBy: undefined as string | undefined }
function applyAttributes(): void {
  const root = editor.value?.getRootElement() ?? null
  syncSurfaceAttributes(root)
  labelAttributes(root, labelState.labelId, labelState.describedBy)
}

/**
 * 占位文字是否该显示：文档里只有一个空段落。有了分割线、表格这类没有文字的块，也不该显示。
 * 和 Lexical 官方的 `$canShowPlaceholder` 判断一致，这里直接读，免得多装一个依赖。
 */
function readEmpty(instance: LexicalEditor): boolean {
  return instance.getEditorState().read(() => {
    const root = $getRoot()
    if (root.getTextContent() !== '' || instance.isComposing())
      return false
    const first = root.getFirstChild()
    return root.getChildrenSize() === 0
      || (root.getChildrenSize() === 1 && $isParagraphNode(first) && first.isEmpty())
  })
}

// 编辑器在 setup 里就建好：默认插槽和工具栏里的组件渲染时就要用 `useLexicalEditor()`，
// 不能等到 onMounted。只有「挂到哪个 DOM 元素上」要等元素存在。
const instance = createRichTextEditor({
  namespace: props.namespace,
  initialState: props.defaultValue,
  editable: editable.value,
  nodes: props.nodes,
  extensions: props.extensions,
  hasMarkdownShortcuts: props.hasMarkdownShortcuts,
  transformers: props.transformers,
})
editor.value = instance

let stopListening: (() => void) | undefined
onMounted(() => {
  const root = surface.value
  if (root === null)
    return
  instance.setRootElement(root)
  applyAttributes()
  isEmpty.value = readEmpty(instance)
  charCount.value = root.textContent?.length ?? 0

  stopListening = instance.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves, tags }) => {
    isEmpty.value = readEmpty(instance)
    charCount.value = instance.getRootElement()?.textContent?.length ?? 0
    // 只有内容真的变了才通知：光标移动、历史合并产生的更新不算。
    if ((dirtyElements.size === 0 && dirtyLeaves.size === 0) || tags.has('history-merge'))
      return
    emit('change', editorState, instance)
  })

  if (props.hasAutoFocus)
    instance.focus()
})

onBeforeUnmount(() => {
  stopListening?.()
  instance.setRootElement(null)
  instance.dispose()
})

// 只读和禁用改变后要立刻生效；挂载时的值已经在建编辑器时用过了。
watch(editable, (next) => {
  editor.value?.setEditable(next)
  applyAttributes()
})
watch(
  () => [props.isReadOnly, props.isDisabled, props.isRequired, props.isOptional, props.isLabelHidden, props.label, props.placeholder, props.minHeight, props.status?.type, props.maxLength, hasTabEscapeHint.value],
  applyAttributes,
  { flush: 'post' },
)

provide(editorKey, instance)

function requireEditor(): LexicalEditor {
  return instance
}

const transformers = computed(() => [...(props.transformers ?? DEFAULT_TRANSFORMERS)])

const exposed: RichTextEditorExposed = {
  focus() {
    if (editable.value)
      requireEditor().focus()
  },
  clear() {
    if (!editable.value)
      return
    instance.setEditorState(instance.parseEditorState(EMPTY_EDITOR_STATE))
  },
  getEditorState: () => requireEditor().getEditorState(),
  getMarkdown: () => requireEditor().getEditorState().read(() => $exportMarkdownKeepingSource(transformers.value)),
  getHTML: () => {
    return instance.getEditorState().read(() => $generateHtmlFromNodes(instance, null))
  },
  getEditor: requireEditor,
}
defineExpose(exposed)

const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const restAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
</script>

<template>
  <Field
    :label="label" :input-id="inputId" :description="description" :width="width"
    :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
    :label-tooltip="labelTooltip" :status="status" :status-variant="statusVariant"
    v-bind="rootAttrs"
  >
    <template #default="field">
      <div
        class="astryx-richtext-editor"
        :data-size="size" :data-status="status?.type" :data-disabled="isDisabled || undefined" :data-readonly="isReadOnly || undefined"
        :data-with-toolbar="$slots.toolbar ? '' : undefined"
      >
        <slot name="toolbar" />
        <div class="astryx-richtext-editor__body">
          <div class="astryx-richtext-editor__root">
            <div
              ref="surface"
              v-bind="restAttrs"
              spellcheck="true"
              :data-label-id="field.labelId"
              :data-described-by="field.describedBy"
              :data-empty="isEmpty || undefined"
              :style="{ '--astryx-richtext-min-height': cssLength(minHeight) }"
              @vue:mounted="() => { labelState.labelId = field.labelId; labelState.describedBy = field.describedBy; applyAttributes() }"
              @vue:updated="() => { labelState.labelId = field.labelId; labelState.describedBy = field.describedBy; applyAttributes() }"
            />
            <div v-if="placeholder && isEmpty" :id="placeholderId" class="astryx-richtext-editor__placeholder" aria-hidden="true">
              {{ placeholder }}
            </div>
            <!--
              这几个叠在编辑区上面：位置是相对「编辑区的父元素」量出来的，
              所以要和编辑区同级放在这个定位元素里，不能放到外面去。
            -->
            <TaskCheckboxPlugin :is-read-only="!editable" />
            <CodeBlockHeaderPlugin />
            <CodeSyntaxPlugin />
          </div>
        </div>
        <DecoratorTeleports v-if="editor" :editor="editor" />
        <slot />
      </div>
      <VisuallyHidden v-if="hasTabEscapeHint" :id="tabEscapeHintId">
        {{ tabEscapeHint }}
      </VisuallyHidden>
    </template>
  </Field>
  <div v-if="maxLength != null" :id="counterId" class="astryx-richtext-editor__counter" :data-over="isOverLimit || undefined">
    {{ charCount }}/{{ maxLength }}
    <VisuallyHidden aria-live="polite">
      {{ counterAnnouncement }}
    </VisuallyHidden>
  </div>
</template>
