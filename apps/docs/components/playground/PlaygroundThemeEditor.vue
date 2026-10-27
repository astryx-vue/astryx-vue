<script setup lang="ts">
import type { DensityPreset, ThemeColorKey, ThemeState } from './theme'
import type { ScaleKey } from './themeEditorModel'
import { computed, ref } from 'vue'
import PlaygroundThemeComponents from './PlaygroundThemeComponents.vue'
import PlaygroundThemeRawTokens from './PlaygroundThemeRawTokens.vue'
import PlaygroundThemeScale from './PlaygroundThemeScale.vue'
import {
  applyColorPicker,
  COLOR_FIELDS,
  colorInputValue,
  colorTokenLabel,
  DENSITY_PRESETS,
  formatColorReadout,
  parseColorReadout,
  TYPE_SCALES,
} from './theme'
import { fieldId, fontOptions, presetIconRadius, presetShapes, scaleLabel, scaleSpecs } from './themeEditorModel'

const props = defineProps<{
  theme: ThemeState
}>()

const emit = defineEmits<{
  field: [key: keyof ThemeState, value: ThemeState[keyof ThemeState]]
  color: [key: ThemeColorKey, value: string]
  density: [id: DensityPreset['id']]
  token: [name: string, value: string]
  componentToken: [name: string, value: string]
  addOverride: [entry: { component: string, property: string, value: string }]
  removeOverride: [id: string]
  updateOverride: [id: string, value: string]
}>()

/** 改了这些字段，就不再算是某个密度预设。 */
const PRESET_KEYS = new Set<keyof ThemeState>(['typeSize', 'typeScale', 'radius', 'spacing', 'elementSize', 'duration'])

const panel = ref<'base' | 'components' | 'advanced'>('base')
const activePreset = ref<DensityPreset['id'] | null>(null)
const fonts = fontOptions()

const scales = computed(() => scaleSpecs(props.theme))
const typeScales = computed(() => scales.value.filter(item => item.key === 'typeSize'))
const shapeScales = computed(() => scales.value.filter(item => item.key !== 'typeSize'))

function setField(key: keyof ThemeState, value: ThemeState[keyof ThemeState]): void {
  if (PRESET_KEYS.has(key))
    activePreset.value = null
  emit('field', key, value)
}

function onScale(key: ScaleKey, value: number): void {
  setField(key, value)
}

function onPreset(id: DensityPreset['id']): void {
  activePreset.value = id
  emit('density', id)
}

function onColorText(key: ThemeColorKey, event: Event): void {
  const next = parseColorReadout((event.target as HTMLInputElement).value)
  if (next)
    emit('color', key, next)
}

function onColorPicker(key: ThemeColorKey, event: Event): void {
  const colors = props.theme.dark ? props.theme.colors.dark : props.theme.colors.light
  emit('color', key, applyColorPicker(colors[key], (event.target as HTMLInputElement).value))
}

function onSelect(key: 'headingFont' | 'bodyFont' | 'typeScale', event: Event): void {
  setField(key, (event.target as HTMLSelectElement).value)
}

function onCustomFont(key: 'customHeadingFont' | 'customBodyFont', event: Event): void {
  setField(key, (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="theme-editor">
    <div class="theme-editor__tabs" role="tablist" aria-label="Theme editor">
      <button
        type="button"
        class="theme-editor__tab"
        role="tab"
        :aria-selected="panel === 'base'"
        @click="panel = 'base'"
      >
        Base Styles
      </button>
      <button
        type="button"
        class="theme-editor__tab"
        role="tab"
        :aria-selected="panel === 'components'"
        @click="panel = 'components'"
      >
        Components
      </button>
      <button
        type="button"
        class="theme-editor__tab"
        role="tab"
        :aria-selected="panel === 'advanced'"
        @click="panel = 'advanced'"
      >
        Advanced
      </button>
    </div>

    <div v-show="panel === 'base'" class="theme-editor__body" role="tabpanel">
      <section class="theme-editor__section">
        <h2 class="theme-editor__heading">
          Colors
        </h2>
        <div
          v-for="field in COLOR_FIELDS"
          :key="field.key"
          class="theme-editor__color"
        >
          <span class="theme-editor__color-name">{{ colorTokenLabel(field.variable) }}</span>
          <div class="theme-editor__color-controls">
            <span
              class="theme-editor__swatch"
              :style="{ background: theme.dark ? theme.colors.dark[field.key] : theme.colors.light[field.key] }"
            >
              <input
                class="theme-editor__picker"
                type="color"
                :aria-label="colorTokenLabel(field.variable)"
                :value="colorInputValue(theme.dark ? theme.colors.dark[field.key] : theme.colors.light[field.key])"
                @input="onColorPicker(field.key, $event)"
              >
            </span>
            <input
              :id="fieldId(field.key)"
              class="theme-editor__hex"
              type="text"
              spellcheck="false"
              :aria-label="`${colorTokenLabel(field.variable)} value`"
              :value="formatColorReadout(theme.dark ? theme.colors.dark[field.key] : theme.colors.light[field.key])"
              @change="onColorText(field.key, $event)"
            >
          </div>
        </div>
      </section>

      <section class="theme-editor__section">
        <h2 class="theme-editor__heading">
          Preset
        </h2>
        <div class="theme-editor__presets" role="group" aria-label="Preset">
          <button
            v-for="preset in DENSITY_PRESETS"
            :key="preset.id"
            type="button"
            class="theme-editor__preset"
            :aria-pressed="activePreset === preset.id"
            :aria-label="`${preset.en} preset`"
            @click="onPreset(preset.id)"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
              <rect
                v-for="(shape, index) in presetShapes(preset.id)"
                :key="index"
                :x="shape.x"
                :y="shape.y"
                :width="shape.width"
                :height="shape.height"
                :rx="presetIconRadius(preset.id)"
                :opacity="shape.opacity"
              />
            </svg>
            <span>{{ preset.en }}</span>
          </button>
        </div>
      </section>

      <section class="theme-editor__section theme-editor__section--type">
        <div class="theme-editor__fields">
          <label class="theme-editor__field" :for="fieldId('heading-font')">
            <span class="theme-editor__heading">Heading Font</span>
            <select :id="fieldId('heading-font')" :value="theme.headingFont" @change="onSelect('headingFont', $event)">
              <option v-for="font in fonts" :key="font.id" :value="font.id">
                {{ font.label }}
              </option>
            </select>
          </label>
          <label v-if="theme.headingFont === 'custom'" class="theme-editor__field" :for="fieldId('heading-custom')">
            <span class="theme-editor__sr">Custom heading font</span>
            <input
              :id="fieldId('heading-custom')"
              type="text"
              spellcheck="false"
              placeholder="Custom"
              :value="theme.customHeadingFont"
              @change="onCustomFont('customHeadingFont', $event)"
            >
          </label>
          <label class="theme-editor__field" :for="fieldId('body-font')">
            <span class="theme-editor__heading">Body Font</span>
            <select :id="fieldId('body-font')" :value="theme.bodyFont" @change="onSelect('bodyFont', $event)">
              <option v-for="font in fonts" :key="font.id" :value="font.id">
                {{ font.label }}
              </option>
            </select>
          </label>
          <label v-if="theme.bodyFont === 'custom'" class="theme-editor__field" :for="fieldId('body-custom')">
            <span class="theme-editor__sr">Custom body font</span>
            <input
              :id="fieldId('body-custom')"
              type="text"
              spellcheck="false"
              placeholder="Custom"
              :value="theme.customBodyFont"
              @change="onCustomFont('customBodyFont', $event)"
            >
          </label>
          <label class="theme-editor__field" :for="fieldId('type-scale')">
            <span class="theme-editor__heading">Type Scale</span>
            <select :id="fieldId('type-scale')" :value="theme.typeScale" @change="onSelect('typeScale', $event)">
              <option v-for="scale in TYPE_SCALES" :key="scale.id" :value="scale.id">
                {{ scaleLabel(scale.id) }}
              </option>
            </select>
          </label>
        </div>
        <PlaygroundThemeScale
          v-for="spec in typeScales"
          :key="spec.key"
          :spec="spec"
          :value="theme[spec.key]"
          @change="onScale(spec.key, $event)"
        />
      </section>

      <section class="theme-editor__section theme-editor__section--shape">
        <PlaygroundThemeScale
          v-for="spec in shapeScales"
          :key="spec.key"
          :spec="spec"
          :value="theme[spec.key]"
          @change="onScale(spec.key, $event)"
        />
      </section>
    </div>

    <div v-if="panel === 'components'" class="theme-editor__body" role="tabpanel">
      <PlaygroundThemeComponents
        :theme="theme"
        @token="(name, value) => emit('componentToken', name, value)"
        @add-override="emit('addOverride', $event)"
        @remove-override="emit('removeOverride', $event)"
        @update-override="(id, value) => emit('updateOverride', id, value)"
      />
    </div>

    <div v-if="panel === 'advanced'" class="theme-editor__body" role="tabpanel">
      <PlaygroundThemeRawTokens :theme="theme" @token="(name, value) => emit('token', name, value)" />
    </div>
  </div>
</template>
