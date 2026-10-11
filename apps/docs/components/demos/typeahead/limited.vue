<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref(null)
const { pick } = useDemoText()
const source = computed(() => createStaticSource([
  { id: 'us', label: pick('美国', 'United States') },
  { id: 'uk', label: pick('英国', 'United Kingdom') },
  { id: 'ca', label: pick('加拿大', 'Canada') },
  { id: 'au', label: pick('澳大利亚', 'Australia') },
  { id: 'de', label: pick('德国', 'Germany') },
  { id: 'fr', label: pick('法国', 'France') },
  { id: 'jp', label: pick('日本', 'Japan') },
  { id: 'br', label: pick('巴西', 'Brazil') },
]))
</script>

<template>
  <div class="demo-container">
    <Typeahead
      v-model="selected"
      :search-source="source"
      :label="pick('国家', 'Country')"
      :placeholder="pick('搜索国家', 'Search countries...')"
      :debounce-ms="0"
      :max-menu-items="3"
      show-on-focus
    />
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
