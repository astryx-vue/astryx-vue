<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref(null)
const { pick } = useDemoText()
const source = computed(() => createStaticSource([
  { id: 'olivia', label: pick('奥利维亚', 'Olivia Martin') },
  { id: 'jackson', label: pick('杰克逊', 'Jackson Lee') },
  { id: 'isabella', label: pick('伊莎贝拉', 'Isabella Nguyen') },
  { id: 'william', label: pick('威廉', 'William Kim') },
  { id: 'sofia', label: pick('索菲亚', 'Sofia Davis') },
]))
</script>

<template>
  <div class="demo-container">
    <Typeahead
      v-model="selected"
      :search-source="source"
      :label="pick('成员', 'Team member')"
      :placeholder="pick('搜索成员', 'Search people...')"
      :debounce-ms="0"
      show-on-focus
    >
      <template #icon>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>
      </template>
    </Typeahead>
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
.demo-container :deep(svg) {
  width: 1rem;
  height: 1rem;
}
</style>
