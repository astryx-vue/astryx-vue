<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Section } from '@astryx-vue/core/Section'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const features = [
  '10 team members',
  'Unlimited projects',
  'Priority support',
  'Advanced analytics',
]
</script>

<template>
  <VStack :gap="2">
    <Section :padding="4" variant="section">
      <VStack :gap="3" h-align="center">
        <VStack :gap="1" h-align="center">
          <Text type="display-3">
            Pro Plan
          </Text>
          <Text color="secondary" type="body">
            Everything you need to scale your team.
          </Text>
        </VStack>
        <VStack :gap="2">
          <HStack v-for="feature in features" :key="feature" :gap="2" vAlign="center">
            <span class="i-carbon-checkmark nav-mark" />
            <Text type="body">
              {{ feature }}
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Section>
    <Section :padding="6" variant="muted">
      <VStack :gap="2" h-align="center">
        <HStack :gap="2" vAlign="center">
          <Text type="display-3">
            $49
          </Text>
          <Text color="secondary" type="supporting">
            / month
          </Text>
        </HStack>
        <Button label="Upgrade" variant="primary" />
      </VStack>
    </Section>
  </VStack>
</template>
