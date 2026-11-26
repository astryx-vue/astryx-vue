<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core/TreeList'
import { useAnimatedLayout } from '@astryx-vue/core'
import { Collapsible } from '@astryx-vue/core/Collapsible'
import { Text } from '@astryx-vue/core/Text'
import { TreeList } from '@astryx-vue/core/TreeList'
import { useTemplateRef } from 'vue'

const panel = useTemplateRef<HTMLElement>('panel')
const animatedLayout = useAnimatedLayout({ containerRef: panel })

const items: TreeListItemData[] = [
  {
    id: 'src',
    label: 'src',
    isExpanded: true,
    icon: 'i-heroicons-folder',
    children: [
      {
        id: 'components',
        label: 'components',
        icon: 'i-heroicons-folder',
        children: [
          { id: 'button', label: 'Button.vue', icon: 'i-heroicons-document' },
          { id: 'card', label: 'Card.vue', icon: 'i-heroicons-document' },
          { id: 'dialog', label: 'Dialog.vue', icon: 'i-heroicons-document' },
        ],
      },
      { id: 'app', label: 'App.vue', icon: 'i-heroicons-document' },
      { id: 'main', label: 'main.ts', icon: 'i-heroicons-document' },
    ],
  },
  { id: 'pkg', label: 'package.json', icon: 'i-heroicons-document' },
]
</script>

<template>
  <div ref="panel" class="animated-layout-panel">
    <TreeList :items="items" label="Project files" :animated-layout="animatedLayout" />
    <Collapsible trigger="Notes" :default-is-open="false" :animated-layout="animatedLayout">
      <Text type="body" color="secondary">
        Everything below a folder you open or close glides to its new place.
      </Text>
    </Collapsible>
    <Text type="supporting">
      Last edited today
    </Text>
  </div>
</template>

<style scoped>
.animated-layout-panel {
  display: flex;
  flex-direction: column;
  gap: var(--astryx-spacing-3, 12px);
  width: min(100%, 320px);
}
</style>
