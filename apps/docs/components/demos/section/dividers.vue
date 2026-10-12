<script setup lang="ts">
import { Section } from '@astryx-vue/core/Section'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="0">
    <Section :dividers="['bottom']" :padding="5" variant="section">
      <VStack :gap="1">
        <p class="layout-title">
          Account
        </p>
        <Text color="secondary" type="body">
          Manage your profile, email, and password.
        </Text>
      </VStack>
    </Section>
    <Section :dividers="['bottom']" :padding="5" variant="section">
      <VStack :gap="1">
        <p class="layout-title">
          Notifications
        </p>
        <Text color="secondary" type="body">
          Choose what updates you receive and how.
        </Text>
      </VStack>
    </Section>
    <Section :padding="5" variant="section">
      <VStack :gap="1">
        <p class="layout-title">
          Privacy
        </p>
        <Text color="secondary" type="body">
          Control who can see your activity and data.
        </Text>
      </VStack>
    </Section>
  </VStack>
</template>
