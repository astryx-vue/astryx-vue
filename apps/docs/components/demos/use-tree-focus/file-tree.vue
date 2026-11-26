<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useTreeFocus } from '@astryx-vue/core'
import { Icon } from '@astryx-vue/core/Icon'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

interface FileNode {
  name: string
  children?: FileNode[]
}

const FILES: FileNode[] = [
  { name: 'src', children: [{ name: 'index.ts' }, { name: 'theme.ts' }] },
  { name: 'docs', children: [{ name: 'intro.md' }, { name: 'usage.md' }] },
  { name: 'package.json' },
  { name: 'README.md' },
]

const FOLDERS = new Set(FILES.filter(node => node.children != null).map(node => node.name))

const expanded = ref<ReadonlySet<string>>(new Set(['src']))
const openFile = ref<string | null>(null)

function toggle(name: string): void {
  const next = new Set(expanded.value)
  if (!next.delete(name))
    next.add(name)
  expanded.value = next
}

const { treeRef, handleKeyDown, handleFocus } = useTreeFocus({
  hasRovingTabIndex: true,
  onToggleExpand: toggle,
  onActivate: (_item, name) => {
    if (name == null || FOLDERS.has(name))
      return false
    openFile.value = name
    return true
  },
})

function bindTree(el: Element | ComponentPublicInstance | null): void {
  const node = el != null && '$el' in el ? el.$el : el
  treeRef.value = node instanceof HTMLElement ? node : null
}

const rows = computed(() => FILES.flatMap(node => [
  { node, level: 1 },
  ...(expanded.value.has(node.name) ? (node.children ?? []).map(child => ({ node: child, level: 2 })) : []),
]))

function indent(node: FileNode, level: number): 0 | 5 | 10 {
  if (node.children != null)
    return 0
  return level === 1 ? 5 : 10
}

function activate(node: FileNode): void {
  if (node.children != null)
    toggle(node.name)
  else
    openFile.value = node.name
}
</script>

<template>
  <VStack :gap="3" :width="240">
    <VStack
      :ref="bindTree"
      role="tree"
      aria-label="Files"
      :gap="1"
      @keydown="handleKeyDown"
      @focusin="handleFocus"
    >
      <HStack
        v-for="{ node, level } in rows"
        :key="node.name"
        align="center"
        role="treeitem"
        :aria-level="level"
        :aria-expanded="node.children != null ? expanded.has(node.name) : undefined"
        :aria-selected="node.children != null ? undefined : openFile === node.name"
        :data-tree-id="node.name"
        :gap="1"
        :padding-inline-start="indent(node, level)"
        @click="activate(node)"
      >
        <template v-if="node.children != null">
          <Icon v-if="expanded.has(node.name)" icon="chevronDown" />
          <!-- 收起的箭头指向行内结尾方向，也就是展开文件夹的那个方向键（RTL 下是 ArrowLeft）。 -->
          <Icon v-else class="file-tree__collapsed" icon="chevronRight" />
        </template>
        <Text type="body">
          {{ node.name }}
        </Text>
      </HStack>
    </VStack>
    <Text type="supporting">
      Open file: {{ openFile ?? 'none' }}
    </Text>
  </VStack>
</template>

<style scoped>
.file-tree__collapsed:dir(rtl) {
  transform: scaleX(-1);
}
</style>
