<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref<SearchableItem | null>(null)
const { pick } = useDemoText()
const source = computed(() => createStaticSource([
  { id: 'apple', label: pick('苹果', 'Apple') },
  { id: 'apricot', label: pick('杏', 'Apricot') },
  { id: 'banana', label: pick('香蕉', 'Banana') },
  { id: 'cherry', label: pick('樱桃', 'Cherry') },
  { id: 'grape', label: pick('葡萄', 'Grape') },
], { keywords: item => item.id === 'grape' ? [pick('提子', 'raisin')] : [] }))
</script>

<template>
  <div class="demo-container">
    <Typeahead
      v-model="selected"
      :search-source="source"
      :label="pick('水果', 'Fruit')"
      :placeholder="pick('搜索水果', 'Search fruit')"
      :debounce-ms="0"
      show-on-focus
    />
    <p class="demo-result">
      {{ pick('选中：', 'Selected: ') }}{{ selected?.label || pick('未选择', 'none') }}
    </p>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(20rem, 100%);
}
.demo-result {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
