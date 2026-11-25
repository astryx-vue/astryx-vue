<script setup lang="ts">
import type { InputGroupTextProps, InputGroupTextSlots } from './types.js'
import { Comment, Text, useSlots } from 'vue'
import { textDirection } from '../utils/textDirection.js'

defineOptions({ name: 'AstryxInputGroupText', inheritAttrs: false })

defineProps<InputGroupTextProps>()
defineSlots<InputGroupTextSlots>()

const slots = useSlots()

/** 插槽里只有纯文字时返回这段文字的排版方向，混进别的节点就交给调用方自己标。 */
function slotDirection(): 'ltr' | undefined {
  const nodes = slots.default?.() ?? []
  let text = ''
  for (const node of nodes) {
    if (node.type === Comment)
      continue
    if (node.type !== Text)
      return undefined
    text += String(node.children ?? '')
  }
  return text === '' ? undefined : textDirection(text)
}
</script>

<template>
  <span class="astryx-input-group-text" v-bind="$attrs">
    <!-- 方向放在里层：外框的逻辑圆角和边框重叠仍跟着组的方向走。 -->
    <span v-if="slotDirection()" dir="ltr"><slot /></span>
    <slot v-else />
  </span>
</template>
