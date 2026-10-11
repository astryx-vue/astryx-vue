<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref<string[]>([])
const { pick } = useDemoText()
const options = computed(() => [
  {
    type: 'section' as const,
    label: pick('阅读', 'Read'),
    options: [
      { value: 'read_posts', label: pick('阅读文章', 'Read posts') },
      { value: 'read_comments', label: pick('阅读评论', 'Read comments') },
      { value: 'read_users', label: pick('阅读用户', 'Read users') },
    ],
  },
  {
    type: 'section' as const,
    label: pick('编辑', 'Write'),
    options: [
      { value: 'write_posts', label: pick('编辑文章', 'Write posts') },
      { value: 'write_comments', label: pick('编辑评论', 'Write comments') },
    ],
  },
])
</script>

<template>
  <div class="demo-field">
    <MultiSelector
      v-model="selected"
      :options="options"
      :label="pick('权限', 'Permissions')"
      :placeholder="pick('选择权限', 'Select permissions...')"
    />
  </div>
</template>

<style scoped>
.demo-field {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
