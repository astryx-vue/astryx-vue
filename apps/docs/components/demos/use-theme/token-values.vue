<script setup lang="ts">
import { Code } from '@astryx-vue/core/Code'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useTheme } from '@astryx-vue/core/Theme'

const theme = useTheme()

const samples = ['--color-accent', '--color-background-surface', '--color-text-primary']
</script>

<template>
  <VStack :gap="3">
    <Text color="secondary">
      {{ theme.name.value }} · {{ theme.mode.value }}
    </Text>
    <Text weight="semibold">
      Resolved token values
    </Text>
    <HStack
      v-for="name in samples"
      :key="name"
      :gap="4"
      align="center"
      justify="between"
    >
      <Code color="secondary">
        {{ name }}
      </Code>
      <Code>{{ theme.token(name) }}</Code>
    </HStack>
  </VStack>
</template>
