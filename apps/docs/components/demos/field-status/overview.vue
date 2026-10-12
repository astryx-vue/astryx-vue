<script setup lang="ts">
import { FieldStatus } from '@astryx-vue/core/FieldStatus'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack :gap="4">
    <FieldStatus type="error" message="This field is required" variant="detached" />
    <FieldStatus type="warning" message="This username is already taken by another team" variant="detached" />
    <FieldStatus type="success" message="Your changes have been saved" variant="detached" />
  </VStack>
</template>
