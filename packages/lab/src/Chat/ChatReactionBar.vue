<script setup lang="ts">
import type { ChatReaction, ChatReactionBarEmits, ChatReactionBarProps } from './types.js'
import { Tooltip, useAstryxMessages, useTranslator } from '@astryx-vue/core'
import { computed, getCurrentInstance, useTemplateRef } from 'vue'
import ChatEmojiPicker from './ChatEmojiPicker.vue'
import '../../styles/chat-reaction-bar.css'

defineOptions({ name: 'AstryxChatReactionBar', inheritAttrs: false })

const props = defineProps<ChatReactionBarProps>()
defineEmits<ChatReactionBarEmits>()
const instance = getCurrentInstance()
const { t } = useTranslator()
const messages = useAstryxMessages()
const root = useTemplateRef<HTMLDivElement>('root')

const groupLabel = computed(() => props.label ?? messages.value.comments.reactionsLabel)
const addLabel = computed(() => props.addLabel ?? t('@astryx.comments.addReaction'))
const hasAdd = computed(() => {
  const vnodeProps = instance?.vnode.props
  return vnodeProps?.onAdd != null || vnodeProps?.onAddOnce != null
})

function pillLabel(reaction: ChatReaction): string {
  return reaction.label ?? messages.value.comments.reactionWith(reaction.count, reaction.emoji)
}

defineExpose({ element: root })
</script>

<template>
  <div
    ref="root"
    class="astryx-chat-reaction-bar"
    role="group"
    :aria-label="groupLabel"
    v-bind="$attrs"
  >
    <template v-for="reaction in reactions" :key="reaction.emoji">
      <Tooltip v-if="reaction.label != null" :content="reaction.label">
        <button
          type="button"
          class="astryx-chat-reaction-bar__pill"
          :data-selected="reaction.isSelected === true || undefined"
          :aria-pressed="reaction.isSelected === true"
          :aria-label="pillLabel(reaction)"
          @click="$emit('toggle', reaction.emoji)"
        >
          <span class="astryx-chat-reaction-bar__emoji" aria-hidden="true">{{ reaction.emoji }}</span>
          <span class="astryx-chat-reaction-bar__count">{{ reaction.count }}</span>
        </button>
      </Tooltip>
      <button
        v-else
        type="button"
        class="astryx-chat-reaction-bar__pill"
        :data-selected="reaction.isSelected === true || undefined"
        :aria-pressed="reaction.isSelected === true"
        :aria-label="pillLabel(reaction)"
        @click="$emit('toggle', reaction.emoji)"
      >
        <span class="astryx-chat-reaction-bar__emoji" aria-hidden="true">{{ reaction.emoji }}</span>
        <span class="astryx-chat-reaction-bar__count">{{ reaction.count }}</span>
      </button>
    </template>
    <ChatEmojiPicker v-if="hasAdd" :emojis="emojis" :label="addLabel" @select="$emit('add', $event)">
      <Tooltip :content="addLabel">
        <button type="button" class="astryx-chat-reaction-bar__add" :aria-label="addLabel">
          +
        </button>
      </Tooltip>
    </ChatEmojiPicker>
  </div>
</template>
