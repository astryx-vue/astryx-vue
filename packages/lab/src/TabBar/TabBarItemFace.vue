<script setup lang="ts">
/**
 * 一个标签的图标和名字，普通样子或选中样子。透镜里的副本把它们藏起来，不进无障碍树。
 */
import type { TabBarItemProps } from './types'
import { Icon } from '@astryx-vue/core'
import { computed } from 'vue'

const props = defineProps<{
  item: TabBarItemProps
  isSelectedLook: boolean
  isCopy?: boolean
}>()

const icon = computed(() => props.isSelectedLook ? (props.item.selectedIcon ?? props.item.icon) : props.item.icon)
</script>

<template>
  <span aria-hidden="true" class="astryx-tab-bar__icon">
    <Icon v-if="typeof icon === 'string'" :icon="icon" />
    <component :is="icon" v-else-if="icon" />
  </span>
  <span
    :aria-hidden="isCopy || undefined"
    class="astryx-tab-bar__label"
    :class="{ 'astryx-tab-bar__label--selected': isSelectedLook }"
  >{{ item.label }}</span>
</template>
