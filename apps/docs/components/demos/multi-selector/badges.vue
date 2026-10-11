<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref(['design', 'ios', 'android', 'web', 'api'])
const { pick } = useDemoText()
const options = computed(() => [
  { value: 'design', label: pick('设计', 'Design') },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'web', label: 'Web' },
  { value: 'api', label: 'API' },
])
</script>

<template>
  <div class="demo-container">
    <MultiSelector
      v-model="selected"
      :options="options"
      :label="pick('平台', 'Platforms')"
      trigger-display="badges"
      :max-badges="2"
    />
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
