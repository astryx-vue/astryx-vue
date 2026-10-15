<script setup lang="ts">
import { BreadcrumbItem, BreadcrumbMenuRadioGroup, BreadcrumbMenuRadioItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
import { Icon } from '@astryx-vue/core/Icon'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

const team = ref('design')
const teamLabel = computed(() => team.value === 'design' ? 'Design' : team.value === 'engineering' ? 'Engineering' : 'Data')
</script>

<template>
  <VStack :gap="3">
    <Breadcrumbs>
      <BreadcrumbItem href="/">
        <template #startIcon>
          <Icon name="carbon:home" />
        </template>
        Home
      </BreadcrumbItem>
      <BreadcrumbItem>
        {{ teamLabel }}
        <template #menu>
          <BreadcrumbMenuRadioGroup v-model="team" label="Team">
            <BreadcrumbMenuRadioItem value="design" label="Design" />
            <BreadcrumbMenuRadioItem value="engineering" label="Engineering" />
            <BreadcrumbMenuRadioItem value="data" label="Data" />
          </BreadcrumbMenuRadioGroup>
        </template>
      </BreadcrumbItem>
      <BreadcrumbItem is-current>
        Overview
      </BreadcrumbItem>
    </Breadcrumbs>
    <Text color="secondary" type="supporting">
      Current team: {{ teamLabel }}
    </Text>
  </VStack>
</template>
