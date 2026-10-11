<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="/">
      Home
    </BreadcrumbItem>
    <BreadcrumbItem href="/components">
      Components
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      Breadcrumbs
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
