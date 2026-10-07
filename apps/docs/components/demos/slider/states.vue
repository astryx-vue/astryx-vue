<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { shallowRef } from 'vue'

const value = shallowRef(70)
</script>

<template>
  <div class="slider-preview-stack">
    <Slider v-model="value" label="Disabled volume" is-disabled value-display="text" />
    <Slider v-model="value" label="Managed volume" is-disabled disabled-message="Volume is locked while sharing your screen." />
    <Slider v-model="value" label="Listening volume" value-display="text" :status="value > 60 ? { type: 'warning', message: 'Lower the volume for extended listening.' } : { type: 'success', message: 'Volume is within the recommended range.' }" label-tooltip="This setting controls all audio output." />
  </div>
</template>
