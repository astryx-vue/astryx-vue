<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="/">
      首页
    </BreadcrumbItem>
    <BreadcrumbItem href="/components">
      组件
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      面包屑
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
