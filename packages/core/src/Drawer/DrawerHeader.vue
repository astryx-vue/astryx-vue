<script setup lang="ts">
import type { DrawerHeaderEmits, DrawerHeaderProps, DrawerHeaderSlots } from './types.js'
import { computed, useSlots } from 'vue'
import DialogHeader from '../Dialog/DialogHeader.vue'

/**
 * 抽屉的标题行。布局、标题语义和关闭按钮的补偿边都复用 `DialogHeader`，
 * 这里只把关闭按钮的默认值和事件名换成抽屉的说法。
 */
defineOptions({ name: 'AstryxDrawerHeader' })
const props = withDefaults(defineProps<DrawerHeaderProps>(), {
  subtitle: undefined,
  hasCloseButton: undefined,
  closeButtonLabel: undefined,
})
const emit = defineEmits<DrawerHeaderEmits>()
defineSlots<DrawerHeaderSlots>()
const slots = useSlots()

const showClose = computed(() => props.hasCloseButton ?? slots.default == null)
</script>

<template>
  <DialogHeader
    :close-button-label="closeButtonLabel"
    :has-close-button="showClose"
    :subtitle="subtitle"
    :title="title"
    @open-change="emit('openChange', false)"
  >
    <template v-if="slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="slots.subtitle" #subtitle>
      <slot name="subtitle" />
    </template>
    <template v-if="slots.startContent" #startContent>
      <slot name="startContent" />
    </template>
    <template v-if="slots.endContent" #endContent>
      <slot name="endContent" />
    </template>
  </DialogHeader>
</template>
