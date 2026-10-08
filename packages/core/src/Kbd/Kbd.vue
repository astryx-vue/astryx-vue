<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { KbdProps } from './types.js'
import { computed, useAttrs } from 'vue'
import { parseShortcut } from './keys.js'
import { useIsApplePlatform } from './platform.js'
import '../../styles/kbd.css'

defineOptions({ name: 'AstryxKbd', inheritAttrs: false })

const props = defineProps<KbdProps>()

const attrs = useAttrs()
const isApple = useIsApplePlatform()

const keys = computed(() => parseShortcut(props.keys, isApple.value))

const accessibleName = computed(() => keys.value.map(key => key.label).join(' + '))

const controlledAttrs = new Set(['class', 'style', 'role', 'aria-label'])

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)),
))
</script>

<template>
  <span
    v-bind="forwardedAttrs"
    class="astryx-kbd"
    :class="attrs.class"
    role="img"
    :aria-label="accessibleName"
    :style="attrs.style as CSSProperties"
  >
    <kbd
      v-for="(key, index) in keys"
      :key="`${key.name}:${index}`"
      class="astryx-kbd__key"
      aria-hidden="true"
    >
      {{ key.display }}
    </kbd>
  </span>
</template>
