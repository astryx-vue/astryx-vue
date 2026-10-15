<script setup lang="ts">
import type { TypeaheadItemProps } from './types.js'
import '../../styles/typeahead.css'

defineOptions({ name: 'AstryxTypeaheadItem' })

const props = defineProps<TypeaheadItemProps>()
</script>

<template>
  <span class="astryx-typeahead-item" :data-disabled="props.isDisabled || props.item.disabled || undefined">
    <span v-if="$slots.icon" class="astryx-typeahead-item-icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="astryx-typeahead-item-copy">
      <span class="astryx-typeahead-option-label">{{ props.item.label }}</span>
      <span v-if="props.description ?? props.item.description" class="astryx-typeahead-option-description">
        {{ props.description ?? props.item.description }}
      </span>
    </span>
  </span>
</template>
