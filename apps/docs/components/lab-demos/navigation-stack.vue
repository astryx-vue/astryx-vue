<script setup lang="ts">
import { Button } from '@astryx-vue/core'
import { NavigationScreen, NavigationStack, useNavigationStack } from '@astryx-vue/lab'
import { defineComponent, h, ref } from 'vue'

interface Entry {
  id: string
  title: string
  children: readonly Entry[]
}

const sections: readonly Entry[] = [
  {
    id: 'general',
    title: 'General',
    children: [
      { id: 'about', title: 'About', children: [] },
      { id: 'storage', title: 'Storage', children: [] },
      { id: 'language', title: 'Language & Region', children: [] },
    ],
  },
  {
    id: 'display',
    title: 'Display & Brightness',
    children: [
      { id: 'text-size', title: 'Text Size', children: [] },
      { id: 'night', title: 'Night Shift', children: [] },
    ],
  },
  { id: 'privacy', title: 'Privacy & Security', children: [] },
]

// 屏幕里的一行：用 useNavigationStack 推入下一屏，退出后焦点回到这一行。
const Rows = defineComponent({
  props: { entries: { type: Array as () => readonly Entry[], required: true } },
  setup(props) {
    const nav = useNavigationStack<Entry>()
    return () => h('div', { class: 'navigation-stack-demo__rows' }, props.entries.length > 0
      ? props.entries.map(entry => h('button', {
          type: 'button',
          class: 'navigation-stack-demo__row',
          onClick: () => nav.push(entry),
        }, entry.title))
      : h('p', { class: 'navigation-stack-demo__empty' }, 'Nothing more on this screen.'))
  },
})

const path = ref<Entry[]>([])
</script>

<template>
  <div class="navigation-stack-demo">
    <NavigationStack v-model:path="path" label="Settings" :get-key="(entry: Entry) => entry.id">
      <template #root>
        <NavigationScreen title="Settings" title-display-mode="large">
          <Rows :entries="sections" />
        </NavigationScreen>
      </template>
      <template #screen="{ entry }">
        <NavigationScreen :title="entry.title">
          <Rows :entries="entry.children" />
          <template v-if="path.length > 1" #endContent>
            <Button label="Done" variant="ghost" size="sm" @click="path = []" />
          </template>
        </NavigationScreen>
      </template>
    </NavigationStack>
  </div>
</template>

<style scoped>
.navigation-stack-demo {
  width: 375px;
  max-width: 100%;
  height: 560px;
  overflow: hidden;
  border: 1px solid var(--astryx-color-border);
  border-radius: 24px;
}

.navigation-stack-demo :deep(.navigation-stack-demo__rows) {
  display: flex;
  flex-direction: column;
  padding: var(--astryx-spacing-2) var(--astryx-spacing-4);
}

.navigation-stack-demo :deep(.navigation-stack-demo__row) {
  padding: 12px 0;
  border: 0;
  border-bottom: 1px solid var(--astryx-color-border);
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}

.navigation-stack-demo :deep(.navigation-stack-demo__empty) {
  margin: 0;
  padding: 12px 0;
  color: var(--astryx-color-text-secondary);
}
</style>
