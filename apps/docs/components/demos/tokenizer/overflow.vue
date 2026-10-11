<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const people = computed<SearchableItem[]>(() => [
  { id: 'alice', label: pick('爱丽丝·约翰逊', 'Alice Johnson') },
  { id: 'bob', label: pick('鲍勃·史密斯', 'Bob Smith') },
  { id: 'charlie', label: pick('查理·布朗', 'Charlie Brown') },
  { id: 'diana', label: pick('戴安娜·普林斯', 'Diana Prince') },
  { id: 'eve', label: pick('伊芙·威廉斯', 'Eve Williams') },
  { id: 'frank', label: pick('弗兰克·米勒', 'Frank Miller') },
])
const source = computed(() => createStaticSource(people.value))
const inlineValue = ref<SearchableItem[]>([])
const layerValue = ref<SearchableItem[]>([])
inlineValue.value = people.value.map(item => ({ ...item }))
layerValue.value = people.value.map(item => ({ ...item }))
</script>

<template>
  <div class="demo-stack">
    <p class="demo-caption">
      {{ pick('行内溢出：展开时把下面的内容往下推', 'Inline overflow — content shifts down on expand') }}
    </p>
    <Tokenizer
      v-model="inlineValue"
      :search-source="source"
      :label="pick('行内溢出', 'Inline Overflow')"
      :placeholder="pick('继续添加', 'Add more...')"
      overflow="unfocused-inline"
      :debounce-ms="0"
    />
    <p class="demo-caption">
      {{ pick('浮层溢出：展开时盖在字段上，不推动布局', 'Layer overflow — expands as overlay, no layout shift') }}
    </p>
    <Tokenizer
      v-model="layerValue"
      :search-source="source"
      :label="pick('浮层溢出', 'Layer Overflow')"
      :placeholder="pick('继续添加', 'Add more...')"
      overflow="unfocused-layer"
      :debounce-ms="0"
    />
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 25rem;
  max-width: calc(100vw - 4rem);
}
.demo-caption {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
