<script setup lang="ts">
import type { IconSize } from '../Icon/types.js'
import Icon from '../Icon/Icon.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import '../../styles/info-tip.css'

defineOptions({ name: 'AstryxInfoTip' })

/**
 * 对应原版 `InfoTip`：一个小「i」按钮，悬停或聚焦时预览帮助文字。
 */
withDefaults(defineProps<{
  /** 按钮展开的帮助内容，简短的纯文字。 */
  content?: string
  /**
   * 按钮的无障碍名称。
   * @default 'More information'
   */
  label?: string
  /**
   * 信息图标大小。
   * @default 'sm'
   */
  size?: IconSize
}>(), {
  content: '',
  label: 'More information',
  size: 'sm',
})
</script>

<template>
  <Tooltip :content="content" touch-trigger="tap" :has-hover-indication="false">
    <button type="button" class="astryx-info-tip" :aria-label="label">
      <Icon icon="info" :size="size" />
    </button>
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
  </Tooltip>
</template>
