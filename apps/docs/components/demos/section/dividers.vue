<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
import { Section } from '@astryx-vue/core/Section'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="0">
    <Section :dividers="['bottom']" :padding="5" variant="section">
      <VStack :gap="1">
        <Heading :level="4">
          Account
        </Heading>
        <Text color="secondary" type="body">
          Manage your profile, email, and password.
        </Text>
      </VStack>
    </Section>
    <Section :dividers="['bottom']" :padding="5" variant="section">
      <VStack :gap="1">
        <Heading :level="4">
          Notifications
        </Heading>
        <Text color="secondary" type="body">
          Choose what updates you receive and how.
        </Text>
      </VStack>
    </Section>
    <Section :padding="5" variant="section">
      <VStack :gap="1">
        <Heading :level="4">
          Privacy
        </Heading>
        <Text color="secondary" type="body">
          Control who can see your activity and data.
        </Text>
      </VStack>
    </Section>
  </VStack>
</template>
