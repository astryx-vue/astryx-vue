<script setup lang="ts">
import { Tooltip } from '@astryx-vue/core'
import { nextTick, onMounted, shallowRef } from 'vue'

/**
 * 禁用的列表里，一行重排手柄的提示和说明：告诉用户这一行为什么不动。
 * 手柄由 core 的 ListItem 画在行尾，所以挂载后去行里找它：取行里最后一个开关按钮，也就是行尾的手柄。
 */
defineOptions({ name: 'AstryxTransferListDisabledHandleTooltip' })

const props = defineProps<{
  findRow: () => HTMLElement | null
  content: string
}>()

const anchor = shallowRef<HTMLElement | null>(null)

onMounted(() => nextTick(() => {
  const toggles = props.findRow()?.querySelectorAll<HTMLElement>('button[aria-pressed]')
  anchor.value = toggles == null || toggles.length === 0 ? null : toggles[toggles.length - 1]!
}))
</script>

<template>
  <Tooltip v-if="anchor" :anchor="anchor" :content="content" />
</template>
