<script setup lang="ts">
import type { SelectorOption } from '@astryx-vue/core'
import type { VNodeChild } from 'vue'
import type { RichTextIconName } from './icons.js'
import type { RichTextEditorToolbarProps, RichTextEditorToolbarSlots } from './toolbarTypes.js'
import type { BlockType, InlineFormat } from './useToolbarState.js'
import { Button, Dialog, DialogHeader, Divider, HStack, IconButton, Layout, LayoutContent, LayoutFooter, Selector, TextInput, ToggleButton, Toolbar } from '@astryx-vue/core'
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_NORMAL,
  FORMAT_TEXT_COMMAND,
  IS_APPLE,
  isExactShortcutMatch,
  KEY_DOWN_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { computed, h, onBeforeUnmount, watchEffect } from 'vue'
import { useLexicalEditor } from './context.js'
import { useRichTextMessages } from './messages.js'
import ToolbarIcon from './ToolbarIcon.vue'
import { useLinkDialog } from './useLinkDialog.js'
import { INLINE_FORMATS, useToolbarState } from './useToolbarState.js'
import '../../styles/richtext-toolbar.css'

defineOptions({ name: 'AstryxRichTextEditorToolbar' })

const props = withDefaults(defineProps<RichTextEditorToolbarProps>(), {
  headingLevels: () => ['h1', 'h2', 'h3'],
  size: 'sm',
  hasLink: true,
  hasNewTabLinks: true,
})
defineSlots<RichTextEditorToolbarSlots>()

const editor = useLexicalEditor()
const t = useRichTextMessages()
const state = useToolbarState(editor)

const label = computed(() => props.label ?? t('toolbar.label'))

const headingLabels = computed(() => ({
  h1: t('toolbar.heading1'),
  h2: t('toolbar.heading2'),
  h3: t('toolbar.heading3'),
}))

const inlineLabels = computed<Record<InlineFormat, string>>(() => ({
  bold: t('toolbar.bold'),
  italic: t('toolbar.italic'),
  underline: t('toolbar.underline'),
  strikethrough: t('toolbar.strikethrough'),
  code: t('toolbar.inlineCode'),
}))

const link = useLinkDialog({
  editor,
  state,
  t,
  hasNewTabLinks: () => props.hasNewTabLinks,
  promptForUrl: () => props.promptForUrl,
})

// Cmd/Ctrl+K 打开链接。用 Lexical 的 isExactShortcutMatch：只认「正好是主修饰键」，
// 按了 Shift 或 Alt 的组合不算，所以 Cmd+Shift+K 不会误触发。
const PRIMARY_MODIFIER = { ctrlKey: !IS_APPLE, metaKey: IS_APPLE }
let stopLinkShortcut: (() => void) | undefined
watchEffect(() => {
  stopLinkShortcut?.()
  stopLinkShortcut = props.hasLink
    ? editor.registerCommand(KEY_DOWN_COMMAND, (event: KeyboardEvent) => {
        if (!isExactShortcutMatch(event, 'k', PRIMARY_MODIFIER))
          return false
        // 返回 true 并阻止默认，免得浏览器自己的 Cmd+K 也跟着触发。
        event.preventDefault()
        link.toggle()
        return true
      }, COMMAND_PRIORITY_NORMAL)
    : undefined
})
onBeforeUnmount(() => stopLinkShortcut?.())

function toggleInline(format: InlineFormat): void {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
}

function setBlock(next: BlockType): void {
  // 下拉里选的是「变成这个」，不是「切换」：选当前已经是的块，保持不变，不会又变回正文。
  if (!state.isEditable.value || state.blockType.value === next)
    return
  if (next === 'bullet') {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    return
  }
  if (next === 'number') {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    return
  }
  editor.update(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection))
      return
    $setBlocksType(selection, () => {
      if (next === 'quote')
        return $createQuoteNode()
      if (next === 'h1' || next === 'h2' || next === 'h3')
        return $createHeadingNode(next)
      return $createParagraphNode()
    })
  })
}

/** 下拉里每一项前面的图标，也是触发器上显示的图标。 */
function iconFor(name: RichTextIconName): () => VNodeChild {
  return () => h(ToolbarIcon, { name })
}

const blockOptions = computed<SelectorOption[]>(() => [
  { value: 'paragraph', label: t('toolbar.paragraph'), icon: iconFor('paragraph') },
  ...props.headingLevels.map(level => ({ value: level, label: headingLabels.value[level], icon: iconFor(level) })),
  { value: 'bullet', label: t('toolbar.bulletedList'), icon: iconFor('bullet') },
  { value: 'number', label: t('toolbar.numberedList'), icon: iconFor('number') },
  { value: 'quote', label: t('toolbar.blockQuote'), icon: iconFor('quote') },
])
</script>

<template>
  <Toolbar :label="label" :size="size" class="astryx-richtext-toolbar">
    <template #start>
      <HStack :gap="1" role="group" :aria-label="t('toolbar.actions')" class="astryx-richtext-toolbar__actions">
        <IconButton
          :label="t('toolbar.undo')" variant="ghost" :tooltip="t('toolbar.undo')"
          :is-disabled="!state.isEditable.value || !state.canUndo.value"
          @click="editor.dispatchCommand(UNDO_COMMAND, undefined)"
        >
          <ToolbarIcon name="undo" is-directional />
        </IconButton>
        <IconButton
          :label="t('toolbar.redo')" variant="ghost" :tooltip="t('toolbar.redo')"
          :is-disabled="!state.isEditable.value || !state.canRedo.value"
          @click="editor.dispatchCommand(REDO_COMMAND, undefined)"
        >
          <ToolbarIcon name="redo" is-directional />
        </IconButton>
        <Divider orientation="vertical" :aria-label="t('toolbar.historyDivider')" class="astryx-richtext-toolbar__divider" />
        <div class="astryx-richtext-toolbar__fixed">
          <Selector
            :label="t('toolbar.blockFormat')" is-label-hidden variant="ghost" :size="size"
            :model-value="state.blockType.value" :options="blockOptions"
            :disabled="!state.isEditable.value"
            @update:model-value="setBlock($event as BlockType)"
          />
        </div>
        <Divider orientation="vertical" :aria-label="t('toolbar.formatDivider')" class="astryx-richtext-toolbar__divider" />
        <ToggleButton
          v-for="format in INLINE_FORMATS" :key="format"
          :label="inlineLabels[format]" :size="size" is-icon-only :tooltip="inlineLabels[format]"
          :is-pressed="state.activeFormats.value.has(format)"
          :is-disabled="!state.isEditable.value"
          @mousedown.prevent
          @pressed-change="toggleInline(format)"
        >
          <template #icon>
            <ToolbarIcon :name="format" />
          </template>
        </ToggleButton>
        <ToggleButton
          v-if="hasLink"
          :label="t('toolbar.link')" :size="size" is-icon-only :tooltip="t('toolbar.link')"
          :is-pressed="state.isLink.value || link.isOpen.value"
          :is-disabled="!state.isEditable.value"
          aria-haspopup="dialog" :aria-expanded="link.isOpen.value"
          @mousedown.prevent
          @pressed-change="link.toggle()"
        >
          <template #icon>
            <ToolbarIcon name="link" />
          </template>
        </ToggleButton>
        <template v-if="$slots.end">
          <Divider orientation="vertical" class="astryx-richtext-toolbar__divider" />
          <slot name="end" />
        </template>
      </HStack>
    </template>
  </Toolbar>

  <Dialog v-if="hasLink" :is-open="link.isOpen.value" purpose="form" :width="400" @open-change="link.setOpen">
    <!--
      表单只在打开时渲染：`TextInput` 的「挂载时聚焦」只在挂载那一刻生效，
      内容一直留在页面里的话，第二次打开就不会再聚焦到网址输入框。
    -->
    <form v-if="link.isOpen.value" @submit.prevent="link.submit()">
      <Layout height="auto">
        <template #header>
          <DialogHeader :title="link.isEditing.value ? t('link.editTitle') : t('link.insertTitle')" @open-change="link.setOpen" />
        </template>
        <LayoutContent>
          <TextInput
            v-model="link.url.value" :label="t('link.url')" width="100%" has-auto-focus status-variant="detached"
            :status="link.error.value ? { type: 'error', message: link.error.value } : undefined"
            @change="link.error.value = ''"
          />
        </LayoutContent>
        <template #footer>
          <LayoutFooter>
            <HStack :gap="2" h-align="end">
              <Button v-if="link.isEditing.value" :label="t('link.remove')" variant="destructive" @click="link.remove()" />
              <Button :label="t('link.cancel')" variant="secondary" @click="link.setOpen(false)" />
              <Button :label="link.isEditing.value ? t('link.update') : t('link.add')" variant="primary" type="submit" />
            </HStack>
          </LayoutFooter>
        </template>
      </Layout>
    </form>
  </Dialog>
</template>
