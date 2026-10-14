<script setup lang="ts">
import type { DensityPreset, ThemeColorKey, ThemeState } from './theme'
import { computed, ref } from 'vue'
import {
  applyColorPicker,
  COLOR_FIELDS,
  colorInputValue,
  colorTokenLabel,
  createNeutralTheme,
  DENSITY_PRESETS,
  describeDuration,
  describeElementSize,
  describeRadius,
  describeSpacing,
  describeType,
  formatColorReadout,
  parseColorReadout,
  PLAYGROUND_FONTS,
  TYPE_SCALES,
} from './theme'

const props = defineProps<{
  theme: ThemeState
}>()

const emit = defineEmits<{
  field: [key: keyof ThemeState, value: ThemeState[keyof ThemeState]]
  color: [key: ThemeColorKey, value: string]
  density: [id: DensityPreset['id']]
}>()

const panel = ref<'base' | 'components' | 'advanced'>('base')
const activePreset = ref<DensityPreset['id'] | null>(null)
const neutralRadius = createNeutralTheme().radius

const FONT_LABELS: Record<string, string> = {
  'system': 'System (Default)',
  'inter': 'Inter',
  'roboto': 'Roboto',
  'dm-sans': 'DM Sans',
  'figtree': 'Figtree',
  'poppins': 'Poppins',
  'ibm-plex-sans': 'IBM Plex Sans',
  'source-sans': 'Source Sans',
  'noto-sans': 'Noto Sans',
  'georgia': 'Georgia (Serif)',
  'custom': 'Custom',
}

const FONT_ORDER = [
  'system',
  'inter',
  'roboto',
  'dm-sans',
  'figtree',
  'poppins',
  'ibm-plex-sans',
  'source-sans',
  'noto-sans',
  'georgia',
  'custom',
]

const SCALE_NAMES: Record<string, string> = {
  'minor-second': 'Minor Second',
  'major-second': 'Major Second',
  'minor-third': 'Minor Third',
  'major-third': 'Major Third',
  'perfect-fourth': 'Perfect Fourth',
  'augmented-fourth': 'Augmented Fourth',
  'perfect-fifth': 'Perfect Fifth',
  'golden': 'Golden Ratio',
}

interface ScaleStop {
  label: string
  value: number
}

interface ScaleSpec {
  key: 'typeSize' | 'radius' | 'spacing' | 'elementSize' | 'duration'
  label: string
  control: string
  tooltip: string
  stops: ScaleStop[]
  min: number
  max: number
  step: number
  units: string
  /** Neutral's stored radius is not one of the editor stops, so the field shows an em dash. */
  unsetAt: number | null
}

const scales = computed((): ScaleSpec[] => {
  const theme = props.theme
  const specs: Array<Omit<ScaleSpec, 'tooltip'>> = [
    {
      key: 'typeSize',
      label: 'Type Size',
      control: 'Type size',
      stops: [
        { label: 'S', value: 12 },
        { label: 'M', value: 14 },
        { label: 'L', value: 16 },
        { label: 'XL', value: 18 },
      ],
      min: 12,
      max: 22,
      step: 1,
      units: 'px',
      unsetAt: null,
    },
    {
      key: 'radius',
      label: 'Corner Radius',
      control: 'Radius',
      stops: [
        { label: 'S', value: 2 },
        { label: 'M', value: 4 },
        { label: 'L', value: 6 },
        { label: 'XL', value: 8 },
      ],
      min: 0,
      max: 28,
      step: 1,
      units: 'px',
      unsetAt: neutralRadius,
    },
    {
      key: 'spacing',
      label: 'Spacing',
      control: 'Spacing',
      stops: [
        { label: 'S', value: 2 },
        { label: 'M', value: 4 },
        { label: 'L', value: 6 },
        { label: 'XL', value: 8 },
      ],
      min: 2,
      max: 8,
      step: 1,
      units: 'px',
      unsetAt: null,
    },
    {
      key: 'elementSize',
      label: 'Element Size',
      control: 'Element size',
      stops: [
        { label: 'S', value: 28 },
        { label: 'M', value: 32 },
        { label: 'L', value: 40 },
        { label: 'XL', value: 48 },
      ],
      min: 24,
      max: 48,
      step: 1,
      units: 'px',
      unsetAt: null,
    },
    {
      key: 'duration',
      label: 'Duration',
      control: 'Duration',
      stops: [
        { label: '0.5×', value: 0.5 },
        { label: '1×', value: 1 },
        { label: '1.5×', value: 1.5 },
        { label: '2×', value: 2 },
      ],
      min: 0.5,
      max: 2,
      step: 0.1,
      units: '×',
      unsetAt: null,
    },
  ]
  return specs.map((spec) => {
    if (spec.key === 'typeSize')
      return { ...spec, tooltip: `Geometric scale: size = round(base × ratio^step). ${describeType(theme, 'en')}.` }
    if (spec.key === 'radius')
      return { ...spec, tooltip: describeRadius(theme, 'en') }
    if (spec.key === 'spacing')
      return { ...spec, tooltip: describeSpacing(theme, 'en') }
    if (spec.key === 'elementSize')
      return { ...spec, tooltip: describeElementSize(theme) }
    return { ...spec, tooltip: describeDuration(theme) }
  })
})

const fonts = computed(() => {
  return FONT_ORDER.flatMap((id) => {
    const font = PLAYGROUND_FONTS.find(item => item.id === id)
    return font ? [{ id, label: FONT_LABELS[id] ?? font.en }] : []
  })
})

function scaleLabel(id: string): string {
  const scale = TYPE_SCALES.find(item => item.id === id)
  if (!scale)
    return id
  return `${scale.ratio.toFixed(3)} — ${SCALE_NAMES[id] ?? scale.en}`
}

function shownValue(spec: ScaleSpec): number | null {
  const value = props.theme[spec.key]
  if (spec.unsetAt != null && value === spec.unsetAt && !spec.stops.some(stop => stop.value === value))
    return null
  return value
}

function stopValue(spec: ScaleSpec): number | null {
  const value = props.theme[spec.key]
  return spec.stops.some(stop => stop.value === value) ? value : null
}

function formatShown(spec: ScaleSpec): string {
  const value = shownValue(spec)
  if (value == null)
    return ''
  if (spec.step >= 1)
    return String(Math.round(value))
  return String(Math.round(value * 10) / 10)
}

function fieldId(key: string): string {
  return `playground-${key}`
}

function clearPreset(): void {
  activePreset.value = null
}

function setField(key: keyof ThemeState, value: ThemeState[keyof ThemeState]): void {
  if (key === 'typeSize' || key === 'typeScale' || key === 'radius' || key === 'spacing' || key === 'elementSize' || key === 'duration')
    clearPreset()
  emit('field', key, value)
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

function onNumber(spec: ScaleSpec, event: Event): void {
  const raw = (event.target as HTMLInputElement).value.trim()
  if (raw === '' || raw === '—')
    return
  const value = Number(raw)
  if (!Number.isFinite(value))
    return
  const rounded = spec.step >= 1 ? Math.round(value) : Math.round(value * 10) / 10
  const clamped = Math.min(spec.max, Math.max(spec.min, rounded))
  setField(spec.key, clamped)
}

function presetIcon(id: DensityPreset['id']): { gap: number, radius: number } {
  if (id === 'compact')
    return { gap: 1, radius: 1 }
  if (id === 'default')
    return { gap: 2, radius: 2 }
  if (id === 'comfortable')
    return { gap: 3, radius: 3 }
  return { gap: 4, radius: 5 }
}

function presetShapes(id: DensityPreset['id']): Array<{ x: number, y: number, width: number, height: number, opacity: number }> {
  const { gap, radius: _radius } = presetIcon(id)
  const top = 8
  const body = 32 - top - gap
  const leftWidth = 15 - gap / 2
  const rightX = 15 + gap / 2
  const rightWidth = 32 - rightX
  const row = (body - gap) / 2
  return [
    { x: 0, y: 0, width: 32, height: top, opacity: 0.5 },
    { x: 0, y: top + gap, width: leftWidth, height: body, opacity: 1 },
    { x: rightX, y: top + gap, width: rightWidth, height: row, opacity: 0.7 },
    { x: rightX, y: top + gap + row + gap, width: rightWidth, height: row, opacity: 0.7 },
  ]
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
                :rx="presetIcon(preset.id).radius"
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
        <div v-for="spec in scales.filter(item => item.key === 'typeSize')" :key="spec.key" class="theme-editor__scale">
          <div class="theme-editor__scale-label">
            <span>{{ spec.label }}</span>
            <button type="button" class="theme-editor__info" :aria-label="spec.tooltip" :title="spec.tooltip">
              <span class="i-carbon-information" aria-hidden="true" />
            </button>
          </div>
          <div class="theme-editor__scale-row">
            <div class="theme-editor__stops" role="group" :aria-label="`${spec.control} preset`">
              <button
                v-for="stop in spec.stops"
                :key="stop.label"
                type="button"
                :aria-pressed="stopValue(spec) === stop.value"
                @click="setField(spec.key, stop.value)"
              >
                {{ stop.label }}
              </button>
            </div>
            <label class="theme-editor__number" :for="fieldId(spec.key)">
              <span class="theme-editor__sr">{{ spec.control }}</span>
              <input
                :id="fieldId(spec.key)"
                :value="formatShown(spec)"
                inputmode="decimal"
                placeholder="—"
                @change="onNumber(spec, $event)"
              >
              <span aria-hidden="true">{{ spec.units }}</span>
            </label>
          </div>
        </div>
      </section>

      <section class="theme-editor__section theme-editor__section--shape">
        <div v-for="spec in scales.filter(item => item.key !== 'typeSize')" :key="spec.key" class="theme-editor__scale">
          <div class="theme-editor__scale-label">
            <span>{{ spec.label }}</span>
            <button type="button" class="theme-editor__info" :aria-label="spec.tooltip" :title="spec.tooltip">
              <span class="i-carbon-information" aria-hidden="true" />
            </button>
          </div>
          <div class="theme-editor__scale-row">
            <div class="theme-editor__stops" role="group" :aria-label="`${spec.control} preset`">
              <button
                v-for="stop in spec.stops"
                :key="stop.label"
                type="button"
                :aria-pressed="stopValue(spec) === stop.value"
                @click="setField(spec.key, stop.value)"
              >
                {{ stop.label }}
              </button>
            </div>
            <label class="theme-editor__number" :for="fieldId(spec.key)">
              <span class="theme-editor__sr">{{ spec.control }}</span>
              <input
                :id="fieldId(spec.key)"
                :value="formatShown(spec)"
                inputmode="decimal"
                placeholder="—"
                @change="onNumber(spec, $event)"
              >
              <span aria-hidden="true">{{ spec.units }}</span>
            </label>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
