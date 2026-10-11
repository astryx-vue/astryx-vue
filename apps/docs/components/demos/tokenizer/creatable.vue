<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const tags = ref<SearchableItem[]>([])
const members = ref<SearchableItem[]>([])
const { pick } = useDemoText()
const emptySource = createStaticSource<SearchableItem>([])
const people = computed(() => createStaticSource([
  { id: 'alice', label: pick('爱丽丝·约翰逊', 'Alice Johnson') },
  { id: 'bob', label: pick('鲍勃·史密斯', 'Bob Smith') },
  { id: 'charlie', label: pick('查理·布朗', 'Charlie Brown') },
  { id: 'diana', label: pick('戴安娜·普林斯', 'Diana Prince') },
  { id: 'eve', label: pick('伊芙·威廉斯', 'Eve Williams') },
]))
</script>

<template>
  <div class="demo-stack">
    <p class="demo-caption">
      {{ pick('只输入文字', 'Free-text only') }}
    </p>
    <Tokenizer
      v-model="tags"
      :search-source="emptySource"
      :label="pick('标签', 'Tags')"
      :placeholder="pick('输入标签后按回车', 'Type a tag and press Enter...')"
      creatable
      :debounce-ms="0"
    />
    <p class="demo-caption">
      {{ pick('新建或搜索', 'Create or search') }}
    </p>
    <Tokenizer
      v-model="members"
      :search-source="people"
      :label="pick('团队成员', 'Team Members')"
      :placeholder="pick('搜索或输入新名字', 'Search or type a new name...')"
      creatable
      show-on-focus
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
