<script setup lang="ts">
import type { MobileNavToggleProps } from './types.js'
import { computed } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/mobile-nav.css'

defineOptions({ name: 'AstryxMobileNavToggle' })

const props = defineProps<Omit<MobileNavToggleProps, 'isOpen'>>()
const messages = useAstryxMessages()
const isOpen = defineModel<boolean>('isOpen', { default: false })
const label = computed(() => props.label || (isOpen.value ? messages.value.nav.close : messages.value.nav.openMenu))

function onClick(): void {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <button
    type="button"
    class="astryx-mobile-nav-toggle"
    :aria-label="label"
    :aria-expanded="isOpen ? 'true' : 'false'"
    :aria-controls="controls"
    @click="onClick"
  >
    <span class="astryx-mobile-nav-toggle__glyph" :class="{ 'astryx-mobile-nav-toggle__glyph--open': isOpen }" aria-hidden="true" />
  </button>
</template>
