<script setup lang="ts">
import type { IndicatorState } from '@astryx-vue/core/Indicator'
import { RadioIndicator, useIndicator } from '@astryx-vue/core/Indicator'
import { defineTheme, Theme } from '@astryx-vue/core/Theme'
import { defineComponent, h } from 'vue'

const radioMarks = defineTheme({
  name: 'radio-marks',
  indicators: { check: RadioIndicator },
})

const states = ['unchecked', 'checked'] as const satisfies readonly IndicatorState<'singleSelection'>[]

const Marks = defineComponent({
  name: 'IndicatorMarkRow',
  setup() {
    const Mark = useIndicator('check')
    return () => h('div', { class: 'indicator-board-row' }, states.map(state =>
      h(Mark.value, { state, size: 'md' }),
    ))
  },
})
</script>

<template>
  <div class="indicator-replace">
    <div class="indicator-replace-card">
      <Marks />
      <span>Default check</span>
    </div>
    <Theme :theme="radioMarks">
      <div class="indicator-replace-card">
        <Marks />
        <span>Radio instead</span>
      </div>
    </Theme>
  </div>
</template>
