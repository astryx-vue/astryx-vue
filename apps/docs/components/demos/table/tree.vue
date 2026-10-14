<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { proportional, Table, useTableTreeState } from '@astryx-vue/core/Table'

interface Node extends Record<string, unknown> {
  id: string
  name: string
  owner: string
  children?: Node[]
}

const nodes: Node[] = [
  {
    id: 'platform',
    name: 'Platform',
    owner: 'Ada',
    children: [
      { id: 'api', name: 'API', owner: 'Grace' },
      {
        id: 'web',
        name: 'Web',
        owner: 'Lin',
        children: [
          { id: 'docs', name: 'Docs', owner: 'Maya' },
        ],
      },
    ],
  },
  { id: 'design', name: 'Design', owner: 'Noah' },
]

const columns: TableColumn<Node>[] = [
  { key: 'name', header: 'Name', width: proportional(2) },
  { key: 'owner', header: 'Owner', width: proportional(1) },
]

const { visibleData, plugin: treePlugin } = useTableTreeState<Node>({
  data: nodes,
  idKey: 'id',
  defaultExpandedIds: ['platform'],
  hasExpandAllControl: true,
  hasRowClickExpansion: true,
})
</script>

<template>
  <Table
    :data="visibleData"
    :columns="columns"
    id-key="id"
    has-hover
    :plugins="{ tree: treePlugin }"
  />
</template>
