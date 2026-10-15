<script setup lang="ts">
import type { IndicatorState } from '@astryx-vue/core/Indicator'
import { Button } from '@astryx-vue/core/Button'
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
import { RadioIndicator, useIndicator } from '@astryx-vue/core/Indicator'
import { ref } from 'vue'

const checkbox = ref<IndicatorState<'multiSelection'>>('unchecked')
const chosen = ref<IndicatorState<'singleSelection'>>('unchecked')
const Mark = useIndicator('check')

function cycleCheckbox(): void {
  checkbox.value = checkbox.value === 'unchecked'
    ? 'checked'
    : checkbox.value === 'checked'
      ? 'indeterminate'
      : 'unchecked'
}

function cycleChosen(): void {
  chosen.value = chosen.value === 'checked' ? 'unchecked' : 'checked'
}
</script>

<template>
  <div class="indicator-board">
    <div class="indicator-board-row">
      <span class="indicator-board-item">
        <CheckboxIndicator :state="checkbox" />
        <Button size="sm" variant="secondary" label="Checkbox" @click="cycleCheckbox" />
      </span>
      <span class="indicator-board-item">
        <component :is="Mark" :state="chosen" />
        <Button size="sm" variant="secondary" label="Check" @click="cycleChosen" />
      </span>
      <span class="indicator-board-item">
        <RadioIndicator :state="chosen" />
        <Button size="sm" variant="secondary" label="Radio" @click="cycleChosen" />
      </span>
    </div>
  </div>
</template>
