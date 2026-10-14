<script setup lang="ts">
import type { ChatSendButtonEmits, ChatSendButtonProps, ChatSendButtonSlots } from './types.js'
import { computed } from 'vue'
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import { useChatComposerContext } from './context.js'
import { hasEmitListener, wasPropPassed } from './events.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatSendButton', inheritAttrs: false })

const props = withDefaults(defineProps<ChatSendButtonProps>(), {
  size: 'md',
})
const emit = defineEmits<ChatSendButtonEmits>()
defineSlots<ChatSendButtonSlots>()

const messages = useAstryxMessages()
const composer = useChatComposerContext()
const sendListened = hasEmitListener('send')
const stopListened = hasEmitListener('stop')
const stopPassed = wasPropPassed('isStopShown')
const disabledPassed = wasPropPassed('isDisabled')

const stopShown = computed(() => stopPassed ? Boolean(props.isStopShown) : (composer?.isStopShown.value ?? false))
const sendDisabled = computed(() => disabledPassed ? Boolean(props.isDisabled) : !(composer?.canSend.value ?? false))
const label = computed(() => stopShown.value ? messages.value.chat.stop : messages.value.chat.send)

function onClick(event: MouseEvent): void {
  if (stopShown.value) {
    emit('stop')
    if (!stopListened)
      composer?.onStop()
  }
  else if (!sendDisabled.value) {
    emit('send')
    if (!sendListened)
      composer?.onSubmit(composer.value.value)
  }
  emit('click', event)
}
</script>

<template>
  <Button
    v-bind="$attrs"
    class="astryx-chat-send"
    :label="label"
    :variant="stopShown ? 'secondary' : 'primary'"
    :size="size"
    is-icon-only
    :is-disabled="!stopShown && sendDisabled"
    @click="onClick"
  >
    <template #icon>
      <slot v-if="stopShown" name="stopIcon">
        <Icon icon="stop" />
      </slot>
      <slot v-else name="sendIcon">
        <Icon icon="arrowUp" />
      </slot>
    </template>
  </Button>
</template>
