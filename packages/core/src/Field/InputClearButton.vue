<script setup lang="ts">
import { useAttrs } from 'vue'
import IconButton from '../IconButton/IconButton.vue'
import { useTranslator } from '../locale/useTranslator.js'
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

const { t } = useTranslator()

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
    :tooltip="t('@astryx.inputClearButton.tooltip')"
    @pointerdown="press"
    @mousedown="press"
    @click="emit('click', $event)"
  >
    <FieldIcon class="astryx-input-clear-icon" type="clear" />
  </IconButton>
</template>
