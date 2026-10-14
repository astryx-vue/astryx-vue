<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="/">
      <template #startIcon>
        <span class="i-heroicons-home css-icon css-icon--sm" />
      </template>
      Home
    </BreadcrumbItem>
    <BreadcrumbItem href="/settings">
      <template #startIcon>
        <span class="i-heroicons-cog-6-tooth css-icon css-icon--sm" />
      </template>
      Settings
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      Profile
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
