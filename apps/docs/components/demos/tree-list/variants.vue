<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core/TreeList'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TreeList } from '@astryx-vue/core/TreeList'

function noop() {}

const items: TreeListItemData[] = [
  {
    id: 'src',
    label: 'src',
    isExpanded: true,
    children: [
      {
        id: 'components',
        label: 'components',
        isExpanded: true,
        children: [
          { id: 'button', label: 'Button.tsx', onClick: noop },
          { id: 'card', label: 'Card.tsx', onClick: noop },
        ],
      },
      { id: 'app', label: 'App.tsx', onClick: noop },
    ],
  },
  { id: 'readme', label: 'README.md', onClick: noop },
]
</script>

<template>
  <Stack align="start" direction="horizontal" :gap="6" h-align="start" wrap="wrap">
    <Stack direction="vertical" :gap="2">
      <Text type="supporting" color="secondary" weight="bold">
        lineGuides (default)
      </Text>
      <TreeList :items="items" variant="lineGuides" />
    </Stack>
    <Stack direction="vertical" :gap="2">
      <Text type="supporting" color="secondary" weight="bold">
        noGuides
      </Text>
      <TreeList :items="items" variant="noGuides" />
    </Stack>
  </Stack>
</template>
