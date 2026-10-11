<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core/Typeahead'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref<SearchableItem | null>(null)
const { pick } = useDemoText()
const people = computed(() => [
  { id: 'ada', label: pick('阿达', 'Ada') },
  { id: 'grace', label: pick('格蕾丝', 'Grace') },
  { id: 'lin', label: pick('小林', 'Lin') },
  { id: 'kai', label: pick('凯', 'Kai') },
])
const source = computed(() => ({
  bootstrap: () => people.value.slice(0, 3),
  search(query: string) {
    return new Promise<SearchableItem[]>((resolve, reject) => {
      window.setTimeout(() => {
        if (query.toLowerCase().includes('error') || query.includes('错误'))
          reject(new Error('offline'))
        else
          resolve(people.value.filter(item => item.label.toLowerCase().includes(query.toLowerCase())))
      }, 400)
    })
  },
}))
</script>

<template>
  <div class="demo-container">
    <Typeahead
      v-model="selected"
      :search-source="source"
      :label="pick('同事', 'Teammate')"
      :placeholder="pick('输入名字，输入“错误”会失败', 'Type a name. “error” fails')"
      show-on-focus
    />
  </div>
</template>

<style scoped>
.demo-container {
  width: min(20rem, 100%);
}
</style>
