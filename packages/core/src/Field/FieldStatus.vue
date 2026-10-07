<script setup lang="ts">
import type { FieldStatusProps } from './types.js'
import { nextTick, onMounted, onScopeDispose, shallowRef, useTemplateRef, watch } from 'vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import FieldIcon from './FieldIcon.vue'
import '../../styles/field.css'

defineOptions({ name: 'AstryxFieldStatus', inheritAttrs: false })
const props = withDefaults(defineProps<FieldStatusProps>(), { variant: 'attached' })
const element = useTemplateRef<HTMLElement>('message')
defineExpose({ element })
const assertive = shallowRef('')
const polite = shallowRef('')
let mounted = false
let revision = 0

async function announce(): Promise<void> {
  const current = ++revision
  assertive.value = ''
  polite.value = ''
  await nextTick()
  if (!mounted || current !== revision)
    return
  if (props.type === 'error')
    assertive.value = props.message
  else
    polite.value = props.message
}

onMounted(() => {
  mounted = true
  void announce()
})
watch(() => [props.type, props.message], () => {
  void announce()
})
onScopeDispose(() => {
  mounted = false
  revision += 1
})
</script>

<template>
  <div v-if="message" v-bind="$attrs" ref="message" class="astryx-field-status" :data-type="type" :data-variant="variant" :data-hidden="isVisuallyHidden || undefined">
    <FieldIcon v-if="variant === 'detached'" :type="type" />
    <span>{{ message }}</span>
  </div>
  <VisuallyHidden aria-live="assertive" aria-atomic="true">
    {{ assertive }}
  </VisuallyHidden>
  <VisuallyHidden aria-live="polite" aria-atomic="true">
    {{ polite }}
  </VisuallyHidden>
</template>
