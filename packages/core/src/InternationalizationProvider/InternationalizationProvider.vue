<script setup lang="ts">
import type { InternationalizationProviderProps, InternationalizationProviderSlots } from './types.js'
import { computed, provide } from 'vue'
import { provideAstryxLocale } from '../locale/context.js'
import { resolveProviderMessages } from './catalog.js'
import { astryxDirectionKey } from './context.js'
import { getLocaleDirection } from './direction.js'

defineOptions({ name: 'AstryxInternationalizationProvider', inheritAttrs: false })

const props = defineProps<InternationalizationProviderProps>()
defineSlots<InternationalizationProviderSlots>()

const messages = computed(() => resolveProviderMessages(props.locale, props.messages, props.overrides))
const direction = computed(() => props.dir ?? getLocaleDirection(props.locale))

provideAstryxLocale(() => props.locale, messages)
provide(astryxDirectionKey, direction)
</script>

<template>
  <slot />
</template>
