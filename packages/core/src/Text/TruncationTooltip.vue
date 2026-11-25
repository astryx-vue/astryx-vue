<script setup lang="ts">
import type { TooltipPresentInterestState } from '../Tooltip/tooltipPresentInterest.js'
import type { TooltipPlacement } from '../Tooltip/types.js'
import { provide } from 'vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import { tooltipPresentInterestKey } from '../Tooltip/tooltipPresentInterest.js'

defineOptions({ name: 'AstryxTruncationTooltip' })

/**
 * 截断文字的提示。Text、Heading 和 Lab 的 LineClamp 共用，等第一次悬停、轻点或聚焦才挂载；
 * 挂上后把那次交互交给 Tooltip，由它按自己的规则回应。
 */
const props = defineProps<{
  /** 被截断的元素，提示挂在它身上。 */
  anchor: HTMLElement | null
  /** 完整文字。 */
  content: string
  placement: TooltipPlacement
  /** 让提示挂载的那次交互。 */
  interest: TooltipPresentInterestState
}>()

provide(tooltipPresentInterestKey, props.interest)
</script>

<template>
  <Tooltip
    v-if="anchor"
    :anchor="anchor"
    :content="content"
    :placement="placement"
    :has-hover-indication="false"
  />
</template>
