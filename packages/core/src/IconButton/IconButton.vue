<script setup lang="ts">
import type { ButtonRootElement } from '../Button/types.js'
import type { IconButtonEmits, IconButtonProps, IconButtonSlots } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'

import Button from '../Button/Button.vue'

defineOptions({
  name: 'IconButton',
  inheritAttrs: false,
})

defineProps<IconButtonProps>()
const emit = defineEmits<IconButtonEmits>()
defineSlots<IconButtonSlots>()

const attrs = useAttrs()
const button = useTemplateRef<InstanceType<typeof Button>>('button')
const element = computed<ButtonRootElement | null>(() => button.value?.element ?? null)

defineExpose({
  element,
})
</script>

<template>
  <Button
    ref="button"
    v-bind="attrs"
    :as="as"
    :click-action="clickAction"
    :elevation="elevation"
    :form="form"
    :href="href"
    :is-disabled="isDisabled"
    is-icon-only
    :is-interruptible="isInterruptible"
    :is-loading="isLoading"
    :label="label"
    :loading-label="loadingLabel"
    :name="name"
    :rel="rel"
    :size="size"
    :target="target"
    :tooltip="tooltip"
    :type="type"
    :value="value"
    :variant="variant"
    :width="width"
    @click="emit('click', $event)"
  >
    <template #icon>
      <slot />
    </template>
  </Button>
</template>
