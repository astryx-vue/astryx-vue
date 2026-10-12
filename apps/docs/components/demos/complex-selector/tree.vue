<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core/TreeList'
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { Token } from '@astryx-vue/core/Token'
import { TreeList } from '@astryx-vue/core/TreeList'
import { computed, ref } from 'vue'

interface Destination {
  id: string
  label: string
  path: string
  children?: Destination[]
}

const tree: Destination[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    path: '/Workspace',
    children: [
      {
        id: 'workspace-research',
        label: 'Research',
        path: '/Workspace/Research',
        children: [
          { id: 'workspace-research-field-notes', label: 'Field notes', path: '/Workspace/Research/Field notes' },
          { id: 'workspace-research-interviews', label: 'Interviews', path: '/Workspace/Research/Interviews' },
        ],
      },
      { id: 'workspace-roadmap', label: 'Roadmap', path: '/Workspace/Roadmap' },
    ],
  },
  {
    id: 'teams',
    label: 'Teams',
    path: '/Teams',
    children: [
      {
        id: 'teams-design-systems',
        label: 'Design systems',
        path: '/Teams/Design systems',
        children: [
          { id: 'teams-design-systems-components', label: 'Components', path: '/Teams/Design systems/Components' },
          { id: 'teams-design-systems-accessibility', label: 'Accessibility', path: '/Teams/Design systems/Accessibility' },
        ],
      },
      { id: 'teams-growth', label: 'Growth', path: '/Teams/Growth' },
    ],
  },
  {
    id: 'archive',
    label: 'Archive',
    path: '/Archive',
    children: [
      { id: 'archive-2025', label: '2025 projects', path: '/Archive/2025 projects' },
    ],
  },
]

const value = ref<Destination>({
  id: 'teams-design-systems-accessibility',
  label: 'Accessibility',
  path: '/Teams/Design systems/Accessibility',
})
const query = ref('')

function filterTree(nodes: Destination[], term: string): Destination[] {
  const normalized = term.trim().toLowerCase()
  if (normalized === '')
    return nodes
  return nodes.flatMap((node) => {
    const children = node.children ? filterTree(node.children, normalized) : []
    if (node.label.toLowerCase().includes(normalized) || children.length > 0)
      return [{ ...node, children }]
    return []
  })
}

function toItems(nodes: Destination[], selectedId: string, pick: (node: Destination) => void): TreeListItemData[] {
  return nodes.map(node => ({
    id: node.id,
    label: node.label,
    isExpanded: true,
    isSelected: node.id === selectedId,
    onClick: () => pick(node),
    children: node.children ? toItems(node.children, selectedId, pick) : undefined,
  }))
}

const visible = computed(() => filterTree(tree, query.value))

function items(selectedId: string, pick: (node: Destination) => void) {
  return toItems(visible.value, selectedId, pick)
}
</script>

<template>
  <ComplexSelector
    v-model="value"
    description="Search and browse nested folders from one selector."
    label="Project destination"
    :trigger-label="value.path"
    width="100%"
  >
    <template #default="{ value: selected, commit, close }">
      <VStack :gap="3">
        <TextInput
          v-model="query"
          has-clear
          is-label-hidden
          label="Search destinations"
          placeholder="Search folders or teams"
        />
        <TreeList
          v-if="visible.length > 0"
          density="compact"
          :items="items(selected.id, (node) => { commit(node); close() })"
        />
        <Text v-else color="secondary" type="supporting">
          No matching destinations.
        </Text>
        <HStack :gap="2">
          <Text color="secondary" type="supporting">
            Current:
          </Text>
          <Token color="blue" :label="selected.path" size="sm" />
        </HStack>
      </VStack>
    </template>
  </ComplexSelector>
</template>
