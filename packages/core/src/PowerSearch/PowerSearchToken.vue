<script setup lang="ts">
import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { PowerSearchFilter, PowerSearchOperator } from './types.js'
import { computed } from 'vue'
import Token from '../Token/Token.vue'
import { characterCount } from '../utils/characters.js'
import { formatFilterValue } from './format.js'
import { resolveOperatorLabel } from './operators.js'

defineOptions({ name: 'AstryxPowerSearchToken' })

const props = defineProps<{
  fieldLabel: string
  operator: PowerSearchOperator
  filter: PowerSearchFilter
  maxLength: number
  messages: PowerSearchMessages
  locale: string
  timeZone?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  removable?: boolean
}>()

const emit = defineEmits<{
  activate: []
  remove: []
}>()

const operatorLabel = computed(() => resolveOperatorLabel(props.operator, props.messages))
const tokenLabel = computed(() => `${props.fieldLabel}: ${operatorLabel.value}`)
const valueText = computed(() => {
  const room = Math.max(props.maxLength - characterCount(props.fieldLabel) - characterCount(operatorLabel.value), 10)
  return formatFilterValue(props.operator.value, props.filter.value, room, props.messages, props.locale, props.timeZone)
})
</script>

<template>
  <Token
    :label="tokenLabel"
    :size="size"
    :disabled="disabled"
    :removable="removable"
    @click="emit('activate')"
    @remove="emit('remove')"
  >
    <template v-if="valueText" #end>
      <span class="astryx-power-search-token-value">{{ valueText }}</span>
    </template>
  </Token>
</template>
