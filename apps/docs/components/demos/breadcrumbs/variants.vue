<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="4">
    <VStack :gap="1">
      <Text color="secondary" type="supporting">
        Default
      </Text>
      <Breadcrumbs label="Default breadcrumb">
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
    </VStack>
    <VStack :gap="1">
      <Text color="secondary" type="supporting">
        Supporting
      </Text>
      <Breadcrumbs label="Supporting breadcrumb" variant="supporting">
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
    </VStack>
  </VStack>
</template>
