<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { FormLayoutProps, FormLayoutSlots } from './types.js'
import { computed, provide, useAttrs, useTemplateRef } from 'vue'
import { formLayoutKey } from './context.js'
import '../../styles/form-layout.css'

defineOptions({
  name: 'AstryxFormLayout',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FormLayoutProps>(), {
  direction: 'vertical',
})

defineSlots<FormLayoutSlots>()

const attrs = useAttrs()
const root = useTemplateRef<HTMLDivElement>('root')

defineExpose({ element: root })

const context = computed(() => ({
  direction: props.direction,
  defaultOptionality: props.defaultOptionality,
}))

provide(formLayoutKey, context)

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

const rootClass = computed(() => ['astryx-form-layout', attrs.class])
const rootStyle = computed<StyleValue>(() => attrs.style as StyleValue)
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :data-direction="direction"
    :style="rootStyle"
  >
    <slot />
  </div>
</template>
