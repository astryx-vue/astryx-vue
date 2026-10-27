<script setup lang="ts">
import type { ThemeState } from './theme'
import type { TokenGroupKey } from './themeTokensRaw'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { computed } from 'vue'
import { themeVariables } from './theme'
import { NEUTRAL_TOKENS } from './themeDefaults'
import { parseLightDark, rewriteColor, shownColor } from './themeTokenColor'
import { editorKind, spacingToPx, tokenLabel, typePreviewStyle } from './themeTokensRaw'

/** Advanced 面板的一行：左边是 token 名，右边是预览和输入框。 */
const props = defineProps<{
  group: TokenGroupKey
  name: string
  theme: ThemeState
}>()

const emit = defineEmits<{
  change: [value: string]
}>()

const kind = computed(() => editorKind(props.group))
const mode = computed(() => props.theme.dark ? 'dark' : 'light')
/** 基础面板调出来的值也要显示，所以先看整套变量，没有再退回 Neutral 默认值。 */
const value = computed(() => themeVariables(props.theme)[props.name] ?? NEUTRAL_TOKENS[props.name] ?? '')
const color = computed(() => shownColor(value.value, mode.value))
const readout = computed(() => kind.value === 'color' ? color.value.readout : value.value)
const barWidth = computed(() => `${Math.min(spacingToPx(value.value) || 0, 48)}px`)
const hasPair = computed(() => parseLightDark(value.value) != null)

function onColorText(text: string): void {
  emit('change', rewriteColor(value.value, mode.value, text))
}

function onPicker(event: Event): void {
  emit('change', rewriteColor(value.value, mode.value, (event.target as HTMLInputElement).value, color.value.alpha))
}
</script>

<template>
  <div class="theme-token-row" :data-has-pair="hasPair || undefined">
    <Text type="body" color="primary" :max-lines="1" class="theme-token-row__name">
      {{ tokenLabel(name) }}
    </Text>
    <div class="theme-token-row__controls">
      <span v-if="kind === 'color'" class="theme-token-row__swatch" :style="{ background: color.display }">
        <input
          v-if="color.hex"
          class="theme-token-row__picker"
          type="color"
          :aria-label="tokenLabel(name)"
          :value="color.hex"
          @input="onPicker"
        >
      </span>
      <span v-else-if="kind === 'spacing'" class="theme-token-row__bar" :style="{ width: barWidth }" />
      <span v-else-if="kind === 'radius'" class="theme-token-row__radius" :style="{ borderRadius: value }" />
      <span v-else-if="kind === 'type'" class="theme-token-row__type" :style="typePreviewStyle(name, value)">Aa</span>
      <TextInput
        :label="name"
        is-label-hidden
        size="sm"
        :class="`theme-token-row__input theme-token-row__input--${kind}`"
        :model-value="readout"
        @update:model-value="kind === 'color' ? onColorText($event) : emit('change', $event)"
      />
    </div>
  </div>
</template>
