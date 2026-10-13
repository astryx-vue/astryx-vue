<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core/TreeList'
import { Button } from '@astryx-vue/core/Button'
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { Token } from '@astryx-vue/core/Token'
import { TreeList } from '@astryx-vue/core/TreeList'
import { computed, ref } from 'vue'

interface Category {
  id: string
  label: string
  path: string
  children?: Category[]
}

const tree: Category[] = [
  {
    id: 'produce',
    label: 'Produce',
    path: 'Produce',
    children: [
      {
        id: 'produce-fruit',
        label: 'Fruit',
        path: 'Produce / Fruit',
        children: [
          { id: 'produce-fruit-citrus', label: 'Citrus', path: 'Produce / Fruit / Citrus' },
          { id: 'produce-fruit-stone', label: 'Stone fruit', path: 'Produce / Fruit / Stone fruit' },
        ],
      },
      { id: 'produce-vegetables', label: 'Vegetables', path: 'Produce / Vegetables' },
    ],
  },
  {
    id: 'pantry',
    label: 'Pantry',
    path: 'Pantry',
    children: [
      { id: 'pantry-grains', label: 'Grains', path: 'Pantry / Grains' },
      { id: 'pantry-snacks', label: 'Snacks', path: 'Pantry / Snacks' },
    ],
  },
]

const value = ref<Category>({
  id: 'produce-fruit-citrus',
  label: 'Citrus',
  path: 'Produce / Fruit / Citrus',
})
const query = ref('')

function filterTree(nodes: Category[], term: string): Category[] {
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

function toItems(nodes: Category[], selectedId: string, pick: (node: Category) => void): TreeListItemData[] {
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
</script>

<template>
  <VStack :gap="4">
    <ComplexSelector
      v-model="value"
      description="Search or browse a category tree."
      label="Product category"
      :trigger-label="value.path"
      width="100%"
    >
      <template #default="{ value: selected, commit, close }">
        <VStack :gap="3">
          <TextInput
            v-model="query"
            has-clear
            is-label-hidden
            label="Search categories"
            placeholder="Search categories"
          />
          <TreeList
            v-if="visible.length > 0"
            density="compact"
            :items="toItems(visible, selected.id, (node) => { commit(node); close() })"
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
    <Button label="Save category" variant="primary" />
  </VStack>
</template>
