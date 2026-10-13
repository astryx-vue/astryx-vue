<script setup lang="ts">
import type { PlaygroundLocale } from './protocol'
import type { DensityPreset, ThemeColorKey, ThemeState } from './theme'
import { computed } from 'vue'
import { playgroundCopy } from './messages'
import {
  activeColors,
  applyColorPicker,
  COLOR_FIELDS,
  colorInputValue,
  DENSITY_PRESETS,
  describeDuration,
  describeElementSize,
  describeRadius,
  describeSpacing,
  describeType,
  PLAYGROUND_FONTS,
  TYPE_SCALES,
} from './theme'

const props = defineProps<{
  theme: ThemeState
  locale: PlaygroundLocale
  density: DensityPreset['id'] | null
}>()

const emit = defineEmits<{
  field: [key: keyof ThemeState, value: ThemeState[keyof ThemeState]]
  color: [key: ThemeColorKey, value: string]
  density: [id: DensityPreset['id']]
}>()

const copy = computed(() => playgroundCopy(props.locale))
const colors = computed(() => activeColors(props.theme))

const ranges = computed(() => [
  {
    key: 'typeSize' as const,
    min: 12,
    max: 22,
    step: 1,
    label: copy.value.typeSize,
    hint: describeType(props.theme, props.locale),
  },
  {
    key: 'radius' as const,
    min: 0,
    max: 28,
    step: 1,
    label: copy.value.radius,
    hint: describeRadius(props.theme, props.locale),
  },
  {
    key: 'spacing' as const,
    min: 2,
    max: 8,
    step: 1,
    label: copy.value.spacing,
    hint: describeSpacing(props.theme, props.locale),
  },
  {
    key: 'elementSize' as const,
    min: 24,
    max: 48,
    step: 1,
    label: copy.value.elementSize,
    hint: describeElementSize(props.theme),
  },
  {
    key: 'duration' as const,
    min: 0.5,
    max: 2,
    step: 0.1,
    label: copy.value.duration,
    hint: describeDuration(props.theme),
  },
])

function fieldId(key: string): string {
  return `playground-${key}`
}

function colorName(key: ThemeColorKey): string {
  const field = COLOR_FIELDS.find(item => item.key === key)
  return props.locale === 'zh' ? field?.zh ?? key : field?.en ?? key
}

function fontName(id: string): string {
  const font = PLAYGROUND_FONTS.find(item => item.id === id)
  return props.locale === 'zh' ? font?.zh ?? id : font?.en ?? id
}

function scaleName(id: string): string {
  const scale = TYPE_SCALES.find(item => item.id === id)
  if (!scale)
    return id
  const label = props.locale === 'zh' ? scale.zh : scale.en
  return `${scale.ratio.toFixed(3)} — ${label}`
}

function onColorText(key: ThemeColorKey, event: Event): void {
  const value = (event.target as HTMLInputElement).value
  emit('color', key, value)
}

function onColorPicker(key: ThemeColorKey, event: Event): void {
  const picked = (event.target as HTMLInputElement).value
  emit('color', key, applyColorPicker(colors.value[key], picked))
}

function onRange(key: 'typeSize' | 'radius' | 'spacing' | 'elementSize' | 'duration', event: Event, step: number): void {
  const value = Number((event.target as HTMLInputElement).value)
  if (!Number.isFinite(value))
    return
  const rounded = step >= 1 ? Math.round(value) : Math.round(value * 10) / 10
  emit('field', key, rounded)
}

function onSelect(key: 'headingFont' | 'bodyFont' | 'typeScale', event: Event): void {
  emit('field', key, (event.target as HTMLSelectElement).value)
}

function onCustomFont(key: 'customHeadingFont' | 'customBodyFont', event: Event): void {
  emit('field', key, (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="theme-editor">
    <div class="theme-editor__row">
      <button
        type="button"
        class="theme-editor__switch"
        role="switch"
        :aria-checked="theme.dark"
        @click="emit('field', 'dark', !theme.dark)"
      >
        <span>{{ copy.darkMode }}</span>
        <span class="theme-editor__switch-ui" aria-hidden="true" />
      </button>
    </div>

    <section class="theme-editor__section">
      <h2>{{ copy.colors }}</h2>
      <p>{{ copy.colorHint }}</p>
      <div v-for="field in COLOR_FIELDS" :key="field.key" class="theme-editor__color">
        <span class="theme-editor__label">{{ colorName(field.key) }}</span>
        <code>{{ field.variable }}</code>
        <label class="theme-editor__hex-label" :for="fieldId(field.key)">
          <span class="theme-editor__sr">{{ colorName(field.key) }}</span>
          <input
            :id="fieldId(field.key)"
            class="theme-editor__hex"
            type="text"
            spellcheck="false"
            :value="colors[field.key]"
            @change="onColorText(field.key, $event)"
          >
        </label>
        <label class="theme-editor__picker-label" :for="fieldId(`${field.key}-picker`)">
          <span class="theme-editor__sr">{{ colorName(field.key) }}</span>
          <input
            :id="fieldId(`${field.key}-picker`)"
            class="theme-editor__picker"
            type="color"
            :value="colorInputValue(colors[field.key])"
            @input="onColorPicker(field.key, $event)"
          >
        </label>
      </div>
    </section>

    <section class="theme-editor__section">
      <h2>{{ copy.density }}</h2>
      <div class="theme-editor__choices" role="radiogroup" :aria-label="copy.density">
        <button
          v-for="preset in DENSITY_PRESETS"
          :key="preset.id"
          type="button"
          role="radio"
          :aria-checked="density === preset.id"
          @click="emit('density', preset.id)"
        >
          {{ locale === 'zh' ? preset.zh : preset.en }}
        </button>
      </div>
    </section>

    <section class="theme-editor__section">
      <h2>{{ copy.fonts }}</h2>
      <label class="theme-editor__label" :for="fieldId('heading-font')">
        {{ copy.headingFont }}
        <select :id="fieldId('heading-font')" :value="theme.headingFont" @change="onSelect('headingFont', $event)">
          <option v-for="font in PLAYGROUND_FONTS" :key="font.id" :value="font.id">
            {{ fontName(font.id) }}
          </option>
        </select>
      </label>
      <label v-if="theme.headingFont === 'custom'" class="theme-editor__label" :for="fieldId('heading-custom')">
        {{ copy.customFont }}
        <input
          :id="fieldId('heading-custom')"
          type="text"
          :value="theme.customHeadingFont"
          @change="onCustomFont('customHeadingFont', $event)"
        >
      </label>

      <label class="theme-editor__label" :for="fieldId('body-font')">
        {{ copy.bodyFont }}
        <select :id="fieldId('body-font')" :value="theme.bodyFont" @change="onSelect('bodyFont', $event)">
          <option v-for="font in PLAYGROUND_FONTS" :key="font.id" :value="font.id">
            {{ fontName(font.id) }}
          </option>
        </select>
      </label>
      <label v-if="theme.bodyFont === 'custom'" class="theme-editor__label" :for="fieldId('body-custom')">
        {{ copy.customFont }}
        <input
          :id="fieldId('body-custom')"
          type="text"
          :value="theme.customBodyFont"
          @change="onCustomFont('customBodyFont', $event)"
        >
      </label>
    </section>

    <section class="theme-editor__section">
      <h2>{{ copy.typeScale }}</h2>
      <label class="theme-editor__label" :for="fieldId('type-scale')">
        {{ copy.typeScale }}
        <select :id="fieldId('type-scale')" :value="theme.typeScale" @change="onSelect('typeScale', $event)">
          <option v-for="scale in TYPE_SCALES" :key="scale.id" :value="scale.id">
            {{ scaleName(scale.id) }}
          </option>
        </select>
      </label>
      <div v-for="range in ranges" :key="range.key" class="theme-editor__range">
        <label class="theme-editor__label" :for="fieldId(range.key)">
          {{ range.label }}
          <input
            :id="fieldId(range.key)"
            type="range"
            :min="range.min"
            :max="range.max"
            :step="range.step"
            :value="theme[range.key]"
            @input="onRange(range.key, $event, range.step)"
          >
        </label>
        <p>{{ range.hint }}</p>
      </div>
    </section>
  </div>
</template>
