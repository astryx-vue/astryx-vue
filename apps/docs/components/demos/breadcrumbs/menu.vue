<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'

const teamMenu = [
  { label: 'Design' },
  { label: 'Engineering' },
  { type: 'divider' as const },
  { label: 'Data' },
]
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="/">
      Home
    </BreadcrumbItem>
    <BreadcrumbItem :menu="teamMenu">
      Teams
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      Overview
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
