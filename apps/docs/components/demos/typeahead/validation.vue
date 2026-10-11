<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref(null)
const { pick } = useDemoText()
const source = computed(() => createStaticSource([
  { id: 'ny', label: pick('纽约', 'New York') },
  { id: 'sf', label: pick('旧金山', 'San Francisco') },
  { id: 'london', label: pick('伦敦', 'London') },
  { id: 'berlin', label: pick('柏林', 'Berlin') },
  { id: 'tokyo', label: pick('东京', 'Tokyo') },
]))
</script>

<template>
  <div class="demo-container">
    <Typeahead
      v-model="selected"
      :search-source="source"
      :label="pick('办公室', 'Office')"
      :placeholder="pick('搜索办公室', 'Search offices...')"
      status="error"
      :status-message="pick('请选择一个办公室', 'Please select an office location')"
      :debounce-ms="0"
    />
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
