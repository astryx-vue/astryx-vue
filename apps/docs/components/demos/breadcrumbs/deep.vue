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
    <BreadcrumbItem href="/products">
      Products
    </BreadcrumbItem>
    <BreadcrumbItem href="/products/electronics">
      Electronics
    </BreadcrumbItem>
    <BreadcrumbItem href="/products/electronics/phones">
      Phones
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      iPhone 15 Pro
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
