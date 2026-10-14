<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const separators = [
  { char: '›', label: 'Chevron' },
  { char: '→', label: 'Arrow' },
  { char: '·', label: 'Dot' },
]
</script>

<template>
  <VStack :gap="4">
    <VStack v-for="item in separators" :key="item.label" :gap="1">
      <Text color="secondary" type="supporting">
        {{ item.label }}
      </Text>
      <Breadcrumbs :separator="item.char">
        <BreadcrumbItem href="/">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="/docs">
          Docs
        </BreadcrumbItem>
        <BreadcrumbItem is-current>
          API Reference
        </BreadcrumbItem>
      </Breadcrumbs>
    </VStack>
  </VStack>
</template>
