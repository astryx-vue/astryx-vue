<script setup lang="ts">
import type { PropType } from 'vue'
import type { DocsLocale } from './docs-i18n'
import { computed, defineComponent, onErrorCaptured, reactive, ref, watch } from 'vue'
import { playgroundSample, propsPlaygroundFor } from './propsPlayground'

const props = defineProps<{
  slug: string
  locale: DocsLocale
}>()

const spec = computed(() => propsPlaygroundFor(props.slug))
const state = reactive<Record<string, unknown>>({})
const error = ref('')

function reset(): void {
  const next = spec.value?.initial(props.locale) ?? {}
  for (const key of Object.keys(state))
    delete state[key]
  Object.assign(state, next)
  error.value = ''
}

watch(() => [props.slug, props.locale] as const, reset, { immediate: true })

const Stage = defineComponent({
  name: 'PropsPlaygroundStage',
  props: {
    draw: { type: Function as PropType<() => unknown>, required: true },
  },
  setup(stageProps) {
    return () => stageProps.draw()
  },
})
const sample = computed(() => spec.value ? playgroundSample(spec.value, state, props.locale) : '')
const copy = computed(() => props.locale === 'en'
  ? { controls: 'Properties', preview: 'Preview', sample: 'Markup for the current properties' }
  : { controls: '属性', preview: '预览', sample: '当前属性对应的写法' })

watch(state, () => {
  error.value = ''
}, { deep: true })

onErrorCaptured((err) => {
  error.value = err instanceof Error ? err.message : String(err)
  return false
})

function draw(): unknown {
  return spec.value?.render(state, props.locale)
}
</script>

<template>
  <section v-if="spec" class="props-playground" :aria-label="copy.preview">
    <div class="props-playground__stage">
      <p v-if="error" class="props-playground__error" role="alert">
        {{ error }}
      </p>
      <Stage v-else :draw="draw" />
    </div>
    <div class="props-playground__controls" :aria-label="copy.controls">
      <label v-for="knob in spec.knobs" :key="knob.key" class="props-playground__field" :for="`props-playground-${knob.key}`">
        <span>{{ knob.label[locale] }}</span>
        <select v-if="knob.kind === 'enum'" :id="`props-playground-${knob.key}`" v-model="state[knob.key]">
          <option v-for="option in knob.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <input v-else-if="knob.kind === 'boolean'" :id="`props-playground-${knob.key}`" v-model="state[knob.key]" type="checkbox">
        <input v-else-if="knob.kind === 'number'" :id="`props-playground-${knob.key}`" v-model.number="state[knob.key]" type="number">
        <input v-else :id="`props-playground-${knob.key}`" v-model="state[knob.key]" type="text">
      </label>
    </div>
    <pre class="props-playground__sample" :aria-label="copy.sample"><code>{{ sample }}</code></pre>
  </section>
</template>
