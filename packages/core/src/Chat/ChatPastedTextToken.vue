<script setup lang="ts">
import { computed } from 'vue'
import Badge from '../Badge/Badge.vue'
import Button from '../Button/Button.vue'
import { createTapStop } from '../composables/internal/tapStop.js'
import HoverCard from '../HoverCard/HoverCard.vue'
import { useComponentMessages } from '../locale/context.js'
import { chatMessages } from '../locale/messages/chat.js'
import { pastedTextLabel } from './useChatPasteAsToken.js'

const props = defineProps<{
  text: string
}>()

const emit = defineEmits<{
  expand: []
}>()

const messages = useComponentMessages({ chat: chatMessages })
// 手指或笔轻点令牌是要开预览：取消浏览器补发的鼠标按下，外层的输入框就不会拿到焦点和光标，
// 手机上键盘也不会升起来盖住预览。点击照常到达卡片的触发器；鼠标按下仍然放置光标。
const tapStop = createTapStop()
const label = computed(() => pastedTextLabel(props.text, messages.value.chat.pastedTextLabel))
</script>

<template>
  <HoverCard placement="above" alignment="start" :has-hover-indication="false">
    <Badge :label="label" variant="neutral" @pointerdown="tapStop.onPointerdown" @mousedown="tapStop.onCancel" />
    <template #content>
      <div class="astryx-chat-paste">
        <div class="astryx-chat-paste__text">
          {{ text }}
        </div>
        <div class="astryx-chat-paste__footer">
          <span class="astryx-chat-paste__meta">{{ label }}</span>
          <Button
            :label="messages.chat.expandPastedText"
            variant="ghost"
            size="sm"
            @click="emit('expand')"
          />
        </div>
      </div>
    </template>
  </HoverCard>
</template>
