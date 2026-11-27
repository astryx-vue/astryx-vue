<script setup lang="ts">
/**
 * 一个条件的标签：调用方的 `token` 插槽优先，其次 `components[type].token`，最后是内置标签。
 * 行内字段和底部弹层呈现的字段共用；`displayOnly` 时只展示，不交出点击和删除的回调。
 * 其余属性（命名用的 aria 属性等）落到内置标签上。
 */
import type { Component } from 'vue'
import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { PowerSearchLookup } from './config.js'
import type { PowerSearchConfig, PowerSearchFilter, PowerSearchSize, PowerSearchTokenProps } from './types.js'
import { computed } from 'vue'
import PowerSearchToken from './PowerSearchToken.vue'

defineOptions({ name: 'AstryxPowerSearchFilterToken', inheritAttrs: false })

const props = defineProps<{
  config: PowerSearchConfig
  lookup: PowerSearchLookup
  filter: PowerSearchFilter
  maxLength: number
  messages: PowerSearchMessages
  locale: string
  timeZone?: string
  size: PowerSearchSize
  disabled: boolean
  removable?: boolean
  displayOnly?: boolean
  custom?: Component
}>()

const emit = defineEmits<{
  activate: []
  remove: []
}>()

defineSlots<{
  token?: (props: PowerSearchTokenProps) => unknown
}>()

const field = computed(() => props.lookup.getField(props.filter.field))
const operator = computed(() => props.lookup.getOperator(props.filter.field, props.filter.operator))
const tokenProps = computed<PowerSearchTokenProps>(() => ({
  config: props.config,
  filter: props.filter,
  field: field.value!,
  operator: operator.value!,
  maxLength: props.maxLength,
  disabled: props.disabled,
  ...(props.displayOnly ? {} : { onClick: () => emit('activate'), onRemove: () => emit('remove') }),
}))
</script>

<template>
  <slot name="token" v-bind="tokenProps">
    <component :is="custom" v-if="custom" v-bind="tokenProps" />
    <PowerSearchToken
      v-else-if="field && operator"
      v-bind="$attrs"
      :field-label="field.label"
      :operator="operator"
      :filter="filter"
      :max-length="maxLength"
      :messages="messages"
      :locale="locale"
      :time-zone="timeZone"
      :size="size"
      :disabled="disabled"
      :removable="removable"
      :display-only="displayOnly"
      @activate="emit('activate')"
      @remove="emit('remove')"
    />
  </slot>
</template>
