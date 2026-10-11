<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref<SearchableItem[]>([])
const { pick } = useDemoText()
const source = computed(() => createStaticSource([
  { id: 'ada', label: pick('阿达', 'Ada') },
  { id: 'grace', label: pick('格蕾丝', 'Grace') },
  { id: 'lin', label: pick('小林', 'Lin') },
]))
</script>

<template>
  <div class="demo-container">
    <Tokenizer
      v-model="selected"
      :search-source="source"
      :label="pick('参与者', 'Participants')"
      :placeholder="pick('搜索或输入新名字', 'Search or type a new name')"
      :debounce-ms="0"
      show-on-focus
      creatable
      clearable
    >
      <template #icon>
        <span class="demo-icon" aria-hidden="true">@</span>
      </template>
    </Tokenizer>
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
.demo-icon {
  color: var(--vp-c-text-2);
}
</style>
