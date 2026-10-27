<script setup lang="ts">
import type { InfoTipProps } from './types.js'
import { Icon, Tooltip } from '@astryx-vue/core'
import '../../styles/info-tip.css'

defineOptions({ name: 'AstryxInfoTip' })

withDefaults(defineProps<InfoTipProps>(), {
  content: undefined,
  label: 'More information',
  size: 'sm',
})
</script>

<template>
  <!--
    触发器是个真按钮，Tooltip 的 `auto` 触摸规则会把点击让给控件、不弹气泡。
    这里的按钮唯一目的就是弹气泡，所以用 `tap` 让点击总能打开，
    否则手机上的用户永远看不到说明。
  -->
  <Tooltip :content="content" touch-trigger="tap">
    <button type="button" class="astryx-info-tip" :aria-label="label">
      <Icon icon="info" :size="size" />
    </button>
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
  </Tooltip>
</template>
