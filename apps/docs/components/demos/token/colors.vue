<script setup lang="ts">
import type { TokenColor } from '@astryx-vue/core/Token'
import { Token } from '@astryx-vue/core/Token'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const colors: { color: TokenColor, en: string, zh: string }[] = [
  { color: 'default', zh: '默认', en: 'Default' },
  { color: 'red', zh: '红', en: 'Red' },
  { color: 'orange', zh: '橙', en: 'Orange' },
  { color: 'yellow', zh: '黄', en: 'Yellow' },
  { color: 'green', zh: '绿', en: 'Green' },
  { color: 'teal', zh: '青绿', en: 'Teal' },
  { color: 'cyan', zh: '青', en: 'Cyan' },
  { color: 'blue', zh: '蓝', en: 'Blue' },
  { color: 'purple', zh: '紫', en: 'Purple' },
  { color: 'pink', zh: '粉', en: 'Pink' },
  { color: 'gray', zh: '灰', en: 'Gray' },
]
</script>

<template>
  <div class="demo-stack">
    <p class="demo-caption">
      {{ pick('默认', 'Default') }}
    </p>
    <div class="demo-row">
      <Token v-for="item in colors" :key="item.color" :label="pick(item.zh, item.en)" :color="item.color" />
    </div>
    <p class="demo-caption">
      {{ pick('禁用', 'Disabled') }}
    </p>
    <div class="demo-row">
      <Token v-for="item in colors" :key="`disabled-${item.color}`" :label="pick(item.zh, item.en)" :color="item.color" disabled />
    </div>
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 25rem;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.demo-caption {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
.demo-caption:first-child {
  margin-top: 0;
}
</style>
