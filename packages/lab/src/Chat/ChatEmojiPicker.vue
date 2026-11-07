<script setup lang="ts">
import type { ChatEmojiPickerEmits, ChatEmojiPickerProps, ChatEmojiPickerSlots } from './types.js'
import { Popover, TextInput, useAstryxMessages, useGridFocus, useTranslator } from '@astryx-vue/core'
import { computed, ref, useTemplateRef } from 'vue'
import { CHAT_EMOJI_COLUMNS, DEFAULT_CHAT_EMOJIS } from './emojis.js'
import { filterEmojis } from './filterEmojis.js'
import '../../styles/chat-emoji-picker.css'

defineOptions({ name: 'AstryxChatEmojiPicker', inheritAttrs: false })

const props = defineProps<ChatEmojiPickerProps>()
const emit = defineEmits<ChatEmojiPickerEmits>()
defineSlots<ChatEmojiPickerSlots>()

const { t } = useTranslator()
const messages = useAstryxMessages()
const query = ref('')
const isOpen = ref(false)
const panel = useTemplateRef<HTMLDivElement>('panel')
const { gridRef, handleKeyDown } = useGridFocus({ columns: CHAT_EMOJI_COLUMNS })

function setGrid(element: unknown): void {
  gridRef.value = element instanceof HTMLElement ? element : null
}

const options = computed(() => props.emojis ?? DEFAULT_CHAT_EMOJIS)
const visible = computed(() => filterEmojis(options.value, query.value))
const dialogLabel = computed(() => props.label ?? messages.value.emojiPicker.pickLabel)
const searchText = computed(() => props.searchLabel ?? t('@astryx.emojiPicker.searchLabel'))
const gridLabel = computed(() => t('@astryx.emojiPicker.label'))
const emptyText = computed(() => t('@astryx.emojiPicker.noResults', { query: query.value.trim() }))

function onOpenChange(open: boolean): void {
  isOpen.value = open
  if (!open)
    query.value = ''
}

function pick(emoji: string): void {
  emit('select', emoji)
  query.value = ''
  isOpen.value = false
}

defineExpose({ element: panel })
</script>

<template>
  <Popover
    :is-open="isOpen"
    :label="dialogLabel"
    placement="below"
    alignment="start"
    :padding="2"
    :width="320"
    @open-change="onOpenChange"
  >
    <slot />
    <template #content>
      <div ref="panel" class="astryx-chat-emoji-picker" v-bind="$attrs">
        <TextInput
          v-model="query"
          class="astryx-chat-emoji-picker__search"
          :label="searchText"
          is-label-hidden
          size="sm"
          :placeholder="searchText"
          has-clear
          width="100%"
        />
        <div v-if="visible.length === 0" class="astryx-chat-emoji-picker__empty">
          {{ emptyText }}
        </div>
        <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 焦点在格子按钮上，方向键冒泡到这层再按网格移动。 -->
        <div
          v-else
          :ref="setGrid"
          class="astryx-chat-emoji-picker__grid"
          role="group"
          :aria-label="gridLabel"
          @keydown="handleKeyDown"
        >
          <button
            v-for="option in visible"
            :key="option.emoji"
            type="button"
            class="astryx-chat-emoji-picker__cell"
            :data-emoji="option.emoji"
            :aria-label="messages.emojiPicker.reactWith(option.name)"
            @click="pick(option.emoji)"
          >
            <span aria-hidden="true">{{ option.emoji }}</span>
          </button>
        </div>
      </div>
    </template>
  </Popover>
</template>
