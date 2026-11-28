<script setup lang="ts">
import type { ToggleButtonGroupBaseProps, ToggleButtonGroupEmits, ToggleButtonGroupSlots, ToggleButtonGroupValue } from './types.js'
import { computed, provide, useTemplateRef } from 'vue'
import { buttonHitAreaContextKey } from '../Button/context.js'
import { useActionGroupTracking } from '../composables/internal/useActionGroupTracking.js'
import { GROUP_HIT_AREA, useTouchHitArea } from '../composables/internal/useTouchHitArea.js'
import { useCoarsePointer } from '../composables/useCoarsePointer.js'

import { toggleButtonGroupContextKey } from './context.js'
import '../../styles/toggle-button.css'

defineOptions({ name: 'AstryxToggleButtonGroup' })

const props = withDefaults(defineProps<ToggleButtonGroupBaseProps>(), {
  isDisabled: false,
  orientation: 'horizontal',
  size: 'md',
  type: 'single',
})

const emit = defineEmits<ToggleButtonGroupEmits>()
defineSlots<ToggleButtonGroupSlots>()

const value = defineModel<ToggleButtonGroupValue>('value', { default: null })

const isMultiple = computed(() => props.type === 'multiple')
const selectedValues = computed<Set<string>>(() => {
  const current = value.value

  if (isMultiple.value)
    return new Set(Array.isArray(current) ? current : [])

  return typeof current === 'string' ? new Set([current]) : new Set()
})

const size = computed(() => props.size)
const isDisabled = computed(() => props.isDisabled)

function toggle(member: string): void {
  const current = value.value

  if (isMultiple.value) {
    const members = Array.isArray(current) ? current : []
    const next = members.includes(member)
      ? members.filter(item => item !== member)
      : [...members, member]

    value.value = next
    emit('change', next)
    return
  }

  const next = current === member ? null : member
  value.value = next
  emit('change', next)
}

/**
 * 触屏为主的设备上，手指和笔可以按住一个切换按钮滑到别的上面，只切换松手时手指下的那个；
 * 在组外松手什么都不切换。鼠标还是原生按钮的行为。
 * 手指的目标通过组画的一圈热区朝 44px 长，长到离组外相邻控件一半间距为止；
 * 按在热区上的触摸交给最近的成员。成员自己不画热区。
 */
const root = useTemplateRef<HTMLElement>('root')
const isCoarse = useCoarsePointer()
const tracksPress = computed(() => isCoarse.value && !props.isDisabled)
useActionGroupTracking(root, { isEnabled: tracksPress, growsTargets: true })
useTouchHitArea(root, tracksPress, GROUP_HIT_AREA)
provide(buttonHitAreaContextKey, false)

provide(toggleButtonGroupContextKey, {
  isDisabled,
  selectedValues,
  size,
  toggle,
  tracksPress,
})
</script>

<template>
  <div
    ref="root"
    class="astryx-toggle-button-group"
    :class="{ 'astryx-touch-hit-area-below': tracksPress }"
    :aria-label="label"
    :data-orientation="orientation"
    :data-press-tracking="tracksPress || undefined"
    :data-size="size"
    role="group"
  >
    <slot />
  </div>
</template>
