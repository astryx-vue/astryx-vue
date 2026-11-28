<script setup lang="ts">
import { provide, useAttrs } from 'vue'
import { buttonHitAreaContextKey } from '../Button/context.js'
import IconButton from '../IconButton/IconButton.vue'
import { useComponentMessages } from '../locale/context.js'
import { inputMessages } from '../locale/messages/input.js'
import FieldIcon from './FieldIcon.vue'

defineOptions({ name: 'AstryxInputClearButton', inheritAttrs: false })

defineProps<{
  /** 读屏用的名字，例如「Clear Name」。提示文字另算，固定是「Clear」。 */
  label: string
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const attrs = useAttrs()
// 清除按钮用输入框自己的那一小圈触控范围（field.css），不画按钮的热区：
// 它旁边的箭头、状态图标不是可点元素，按钮的热区挡不住，会盖过去。
provide(buttonHitAreaContextKey, false)

const messages = useComponentMessages({ input: inputMessages })

function press(event: Event): void {
  // 按下时别把焦点从输入框偷走，否则清除之后页面会跳。
  event.preventDefault()
}
</script>

<template>
  <IconButton
    v-bind="attrs"
    class="astryx-input-clear-button"
    variant="ghost"
    size="sm"
    :label="label"
    :tooltip="messages.input.tooltip"
    @pointerdown="press"
    @mousedown="press"
    @click="emit('click', $event)"
  >
    <FieldIcon class="astryx-input-clear-icon" type="clear" />
  </IconButton>
</template>
