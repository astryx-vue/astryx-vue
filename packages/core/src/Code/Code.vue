<script setup lang="ts">
import type { CodeProps, CodeSlots } from './types.js'
import { computed, useTemplateRef } from 'vue'

import '../../styles/code.css'

defineOptions({ name: 'AstryxCode' })

withDefaults(defineProps<CodeProps>(), {
  color: 'primary',
})

defineSlots<CodeSlots>()

const root = useTemplateRef<HTMLElement>('root')
const element = computed(() => root.value ?? null)

defineExpose({ element })
</script>

<template>
  <code ref="root" class="astryx-code" :data-color="color" :data-size="size">
    <slot />
  </code>
</template>
