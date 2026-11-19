<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="/">
      Home
    </BreadcrumbItem>
    <BreadcrumbItem href="/projects">
      Projects
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      My Project
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
