<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Stack :gap="4" direction="vertical">
    <Stack :gap="1" direction="vertical">
      <Text type="supporting" color="secondary">
        With start icon
      </Text>
      <Breadcrumbs label="Breadcrumb with a start icon">
        <BreadcrumbItem href="#home">
          <template #startIcon>
            <Icon icon="i-heroicons-home" size="sm" />
          </template>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="#docs">
          Docs
        </BreadcrumbItem>
        <BreadcrumbItem is-current>
          Components
        </BreadcrumbItem>
      </Breadcrumbs>
    </Stack>
    <Stack :gap="1" direction="vertical">
      <Text type="supporting" color="secondary">
        As current page (non-link)
      </Text>
      <Breadcrumbs label="Breadcrumb ending on the current page">
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
    </Stack>
    <Stack :gap="1" direction="vertical">
      <Text type="supporting" color="secondary">
        Supporting variant
      </Text>
      <Breadcrumbs label="Supporting breadcrumb" variant="supporting">
        <BreadcrumbItem href="#home">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="#admin">
          Admin
        </BreadcrumbItem>
        <BreadcrumbItem href="#admin-users">
          Users
        </BreadcrumbItem>
        <BreadcrumbItem is-current>
          Permissions
        </BreadcrumbItem>
      </Breadcrumbs>
    </Stack>
    <Stack :gap="1" direction="vertical">
      <Text type="supporting" color="secondary">
        With onClick handler (no href)
      </Text>
      <Breadcrumbs label="Breadcrumb with click handlers">
        <BreadcrumbItem @click="() => {}">
          Dashboard
        </BreadcrumbItem>
        <BreadcrumbItem @click="() => {}">
          Projects
        </BreadcrumbItem>
        <BreadcrumbItem is-current>
          Project Alpha
        </BreadcrumbItem>
      </Breadcrumbs>
    </Stack>
  </Stack>
</template>
