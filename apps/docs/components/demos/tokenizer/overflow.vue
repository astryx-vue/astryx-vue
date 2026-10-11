<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const selected = ref([
  { id: 'design', label: pick('设计系统', 'Design system') },
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
  { id: 'web', label: 'Web' },
  { id: 'api', label: 'API' },
])
const source = computed(() => createStaticSource(selected.value))
</script>

<template>
  <div class="demo-container">
    <Tokenizer
      v-model="selected"
      :search-source="source"
      :label="pick('标签', 'Tags')"
      overflow="unfocused-inline"
      :debounce-ms="0"
    />
    <p class="demo-note">
      {{ pick('失焦时收成一行，点进去会展开。', 'It stays on one line until focused.') }}
    </p>
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
.demo-note {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
