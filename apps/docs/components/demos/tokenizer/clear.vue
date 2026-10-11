<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const people = computed(() => [
  { id: 'alice', label: pick('爱丽丝', 'Alice Johnson') },
  { id: 'bob', label: pick('鲍勃', 'Bob Smith') },
  { id: 'charlie', label: pick('查理', 'Charlie Brown') },
  { id: 'diana', label: pick('戴安娜', 'Diana Prince') },
  { id: 'eve', label: pick('伊芙', 'Eve Williams') },
])
const source = computed(() => createStaticSource(people.value))
const selected = ref<SearchableItem[]>([])
selected.value = people.value.slice(0, 2)
</script>

<template>
  <div class="demo-container">
    <Tokenizer
      v-model="selected"
      :search-source="source"
      :label="pick('团队成员', 'Team Members')"
      :placeholder="pick('搜索成员', 'Search people...')"
      :debounce-ms="0"
      clearable
    />
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
