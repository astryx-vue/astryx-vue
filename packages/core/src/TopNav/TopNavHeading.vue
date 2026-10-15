<script setup lang="ts">
import type { TopNavHeadingProps, TopNavHeadingSlots } from './types.js'
import { computed, useSlots } from 'vue'
import NavHeadingSurface from '../NavMenu/NavHeadingSurface.vue'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNavHeading' })

const props = defineProps<TopNavHeadingProps>()
defineSlots<TopNavHeadingSlots>()
const slots = useSlots()

const headingHref = computed(() => props.headingHref ?? props.href)
</script>

<template>
  <NavHeadingSurface
    kind="top"
    :as="as"
    :heading="heading"
    :heading-href="headingHref"
    :logo-label="logoLabel"
    :subheading="subheading"
    :subheading-href="subheadingHref"
    :superheading="superheading"
    :superheading-href="superheadingHref"
  >
    <template v-if="slots.logo || slots.icon" #icon>
      <slot name="logo" />
      <slot v-if="!slots.logo" name="icon" />
    </template>
    <template v-if="slots.end" #end>
      <slot name="end" />
    </template>
    <template v-if="slots.menu" #menu="scope">
      <slot name="menu" v-bind="scope" />
    </template>
  </NavHeadingSurface>
</template>
