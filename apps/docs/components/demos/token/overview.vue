<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { Token } from '@astryx-vue/core/Token'

function onRemove(): void {}
</script>

<template>
  <Stack align="center" direction="horizontal" :gap="2">
    <Token label="Default" />
    <Token label="Removable" color="blue" removable @remove="onRemove" />
    <Token label="Design" color="purple">
      <template #icon>
        <Icon icon="i-heroicons-tag" size="sm" color="inherit" />
      </template>
    </Token>
  </Stack>
</template>
