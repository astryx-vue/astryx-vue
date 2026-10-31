<script setup lang="ts">
import type { RichTextEditorInstance } from './createEditor.js'
import type { RichTextViewProps, RichTextViewSlots } from './viewTypes.js'
import { useAstryxMessages } from '@astryx-vue/core'
import { computed, nextTick, onBeforeUnmount, onMounted, provide, shallowRef, useAttrs, watch } from 'vue'
import { editorKey } from './context.js'
import { createRichTextEditor } from './createEditor.js'
import { DecoratorTeleports } from './DecoratorTeleports.js'
import { CodeBlockHeaderPlugin, CodeSyntaxPlugin, MarkdownExtensionsPlugin, TaskCheckboxPlugin } from './plugins/index.js'
import { registerTableScrollRegion } from './plugins/tableScrollRegion.js'
import '../../styles/richtext-document.css'
import '../../styles/richtext-view.css'

defineOptions({ name: 'AstryxRichTextView', inheritAttrs: false })

const props = withDefaults(defineProps<RichTextViewProps>(), { namespace: 'astryx-view' })
const emit = defineEmits<{ parseError: [error: Error] }>()
defineSlots<RichTextViewSlots>()
const attrs = useAttrs()
// 表格滚动区域的名字用 core 的文案，和 core 的 Table 一致。
const coreMessages = useAstryxMessages()

const surface = shallowRef<HTMLDivElement | null>(null)
const hasError = shallowRef(false)

/** 状态必须是合法的 JSON；坏的 JSON 会在建编辑器时直接抛出，所以先验一遍。 */
function parseProblem(value: string): Error | null {
  try {
    JSON.parse(value)
    return null
  }
  catch (error) {
    return error instanceof Error ? error : new Error(String(error))
  }
}

/**
 * 读的是持久化的内容：坏的 JSON、或者用了没注册的节点类型都可能出现，不能把整个页面带崩。
 * 建不出来就返回 null 并报告，由模板显示 `errorFallback`。
 */
function create(value: string): RichTextEditorInstance | null {
  const problem = parseProblem(value)
  if (problem !== null) {
    hasError.value = true
    emit('parseError', problem)
    return null
  }
  try {
    const instance = createRichTextEditor({
      namespace: props.namespace,
      initialState: value,
      editable: false,
      nodes: props.nodes,
      hasMarkdownShortcuts: false,
    })
    hasError.value = false
    return instance
  }
  catch (error) {
    hasError.value = true
    emit('parseError', error instanceof Error ? error : new Error(String(error)))
    return null
  }
}

// 编辑器在 setup 里就建好，里面的插件和默认插槽渲染时就能用 `useLexicalEditor()` 取到它。
// 提供出去的必须是真正的编辑器对象，不能是代理：插件拿编辑器对象当 `WeakMap` 的键登记东西，
// 代理和真对象不是同一个键，Lexical 回头问真对象时就找不到。
const editor = shallowRef<RichTextEditorInstance | null>(create(props.value))
/** 已经挂到元素上的编辑器。插件要等它有了才装：不然它们第一次画的时候根元素还不存在。 */
const attached = shallowRef<RichTextEditorInstance | null>(null)

let stopTables: (() => void) | undefined

function dispose(): void {
  stopTables?.()
  stopTables = undefined
  const instance = editor.value
  instance?.setRootElement(null)
  instance?.dispose()
}

/** 把编辑器挂到元素上，并去掉 Lexical 写的 `role="textbox"` 和只对控件有效的 ARIA（原因见模板里的说明）。 */
function attach(): void {
  const root = surface.value
  const instance = editor.value
  if (instance === null || root === null)
    return
  instance.setRootElement(root)
  root.contentEditable = 'false'
  root.removeAttribute('role')
  root.removeAttribute('aria-autocomplete')
  root.removeAttribute('aria-readonly')
  root.removeAttribute('aria-multiline')
  stopTables = registerTableScrollRegion(instance, () => coreMessages.value.table.label)
  attached.value = instance
}

onMounted(attach)
onBeforeUnmount(dispose)

// 创建时读一次初始状态；之后 `value` 变了，就地换成新的状态，不重建编辑器。
// 之前出过错的，用修正后的值重新建一个。
watch(() => props.value, (next) => {
  const problem = parseProblem(next)
  if (problem !== null) {
    attached.value = null
    dispose()
    editor.value = null
    hasError.value = true
    emit('parseError', problem)
    return
  }
  const instance = editor.value
  if (hasError.value || instance === null) {
    editor.value = create(next)
    // 出错时内容元素被摘掉了，恢复后是新建的元素，要等 DOM 更新之后再挂上去。
    void nextTick(attach)
    return
  }
  instance.setEditorState(instance.parseEditorState(next))
})

// 插件在 `v-if="attached"` 里，视图出错再恢复时换了编辑器，它们会跟着重新渲染、拿到新的。
// 提供的是一个 getter：每次问都给当前挂着的那个，不是创建时的那一个。
provide(editorKey, () => attached.value ?? editor.value)

const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const restAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
</script>

<template>
  <div class="astryx-richtext-view" v-bind="{ ...restAttrs, ...rootAttrs }">
    <slot v-if="hasError" name="errorFallback" />
    <template v-else>
      <!--
        这是文档内容，不是表单控件：Lexical 默认给可编辑区写 `role="textbox"` 和只对控件有效的 ARIA，
        不可编辑时也写。一个没有名字的 textbox 过不了 axe 的 `aria-input-field-name`，
        视图本来就是内容而不是带标签的输入框，没有名字可给；而且把渲染出来的文档当成表单控件，
        读屏软件就读不出它其实是内容。所以都去掉。想要「带标签的只读字段」用 `<RichTextEditor is-read-only>`。
      -->
      <div ref="surface" class="astryx-richtext-view__content" />
      <template v-if="attached">
        <DecoratorTeleports :editor="attached" />
        <!-- 放在内容后面，复制按钮和勾选框在 Tab 顺序里才跟在内容后面。 -->
        <CodeBlockHeaderPlugin />
        <CodeSyntaxPlugin />
        <MarkdownExtensionsPlugin v-if="markdownExtensions && markdownExtensions.length > 0" :extensions="markdownExtensions" :transformers="[]" />
        <TaskCheckboxPlugin is-read-only />
        <slot />
      </template>
    </template>
  </div>
</template>
