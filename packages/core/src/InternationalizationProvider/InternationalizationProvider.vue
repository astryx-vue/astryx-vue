<script setup lang="ts">
import type { InternationalizationProviderProps, InternationalizationProviderSlots } from './types.js'
import { computed, provide } from 'vue'
import { devPropError, isDevBuild } from '../composables/internal/devBuild.js'
import { provideAstryxLocale } from '../locale/context.js'
import { resolveProviderMessages } from './catalog.js'
import { astryxDirectionKey } from './context.js'
import { getLocaleDirection } from './direction.js'

defineOptions({ name: 'AstryxInternationalizationProvider', inheritAttrs: false })

const props = defineProps<InternationalizationProviderProps>()
defineSlots<InternationalizationProviderSlots>()

if (isDevBuild() && props.locale == null) {
  throw devPropError(
    'InternationalizationProvider',
    'locale',
    'is required: a BCP 47 language tag, for example locale="en" or locale="pt-BR".',
  )
}

const messages = computed(() => resolveProviderMessages(props.locale, props.messages, props.overrides))
const direction = computed(() => props.dir ?? getLocaleDirection(props.locale))

provideAstryxLocale(() => props.locale, messages)
provide(astryxDirectionKey, direction)
</script>

<template>
  <slot />
</template>
