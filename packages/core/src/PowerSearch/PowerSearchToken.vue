<script setup lang="ts">
import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { PowerSearchFilter, PowerSearchOperator } from './types.js'
import { computed, provide } from 'vue'
import { useCalendarSystem } from '../locale/calendar.js'
import { tokenNamingKey } from '../Token/namingContext.js'
import Token from '../Token/Token.vue'
import { characterCount } from '../utils/characters.js'
import { formatFilterValue } from './format.js'
import { formatTokenLabel, formatTokenText, tokenTextKeepsParts } from './formatTokenText.js'
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
  /** 点它会打开编辑器。为真时按钮带 `aria-haspopup="dialog"` 和 `aria-expanded`。 */
  opensEditor?: boolean
  /** 编辑器正为这个标签打开着。 */
  expanded?: boolean
  /** 给编辑器对话框引用的名称元素 id。量宽用的副本不传。 */
  nameId?: string
  /** 只展示、不能按（底部弹层呈现的字段里，整个框交给触发器）。 */
  displayOnly?: boolean
}>()

const emit = defineEmits<{
  activate: []
  remove: []
}>()

const calendar = useCalendarSystem(undefined, 'PowerSearch')
const operatorLabel = computed(() => resolveOperatorLabel(props.operator, props.messages))
const tokenLabel = computed(() => formatTokenLabel(props.messages, props.fieldLabel, operatorLabel.value))
const valueText = computed(() => {
  const room = Math.max(props.maxLength - characterCount(props.fieldLabel) - characterCount(operatorLabel.value), 10)
  return formatFilterValue(props.operator.value, props.filter.value, room, props.messages, props.locale, props.timeZone, calendar.value)
})
/** 标签的全部可见文字：字段、运算符和值。按钮、删除按钮和编辑器都按它命名，同一字段的两个条件读出来不再一样。 */
const visibleText = computed(() => valueText.value ? formatTokenText(props.messages, tokenLabel.value, valueText.value) : tokenLabel.value)
/** 语言把全文写成「标签 值」以外的形状时，标签上不再把值单独加粗，整句作为一段文字显示。 */
const showsParts = computed(() => !valueText.value || tokenTextKeepsParts(props.messages))

provide(tokenNamingKey, computed(() => ({ actionName: visibleText.value, removeName: visibleText.value })))
</script>

<template>
  <Token
    :label="showsParts ? tokenLabel : visibleText"
    :size="size"
    :disabled="disabled"
    :removable="removable"
    :aria-haspopup="opensEditor ? 'dialog' : undefined"
    :aria-expanded="opensEditor ? Boolean(expanded) : undefined"
    v-on="displayOnly ? {} : { click: () => emit('activate') }"
    @remove="emit('remove')"
  >
    <template v-if="(showsParts && valueText) || nameId" #end>
      <span v-if="showsParts && valueText" class="astryx-power-search-token-value">{{ valueText }}</span>
      <span v-if="nameId" :id="nameId" hidden>{{ visibleText }}</span>
    </template>
  </Token>
</template>
