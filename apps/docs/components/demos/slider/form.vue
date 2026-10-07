<script setup lang="ts">
import type { SliderValue } from '@astryx-vue/core/Slider'
import { Button } from '@astryx-vue/core/Button'
import { Slider } from '@astryx-vue/core/Slider'
import { shallowRef } from 'vue'

const price = shallowRef<[number, number]>([20, 80])
const committed = shallowRef('20 – 80')
const submitted = shallowRef('No values submitted yet.')
function finish(value: SliderValue): void {
  committed.value = Array.isArray(value) ? value.join(' – ') : String(value)
}
function submit(event: Event): void {
  submitted.value = `price: ${new FormData(event.currentTarget as HTMLFormElement).getAll('price').join(', ')}`
}
</script>

<template>
  <form class="slider-preview-stack" @submit.prevent="submit">
    <Slider v-model="price" label="Budget" html-name="price" value-display="text" @change-end="finish" />
    <p class="input-preview-note">
      Last completed adjustment: {{ committed }}
    </p>
    <Button label="Submit values" type="submit" />
    <p class="input-preview-note" role="status">
      {{ submitted }}
    </p>
  </form>
</template>
