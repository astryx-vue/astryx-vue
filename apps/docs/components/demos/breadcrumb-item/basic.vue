<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="#home">
      Home
    </BreadcrumbItem>
    <BreadcrumbItem href="#settings">
      Settings
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      Profile
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
