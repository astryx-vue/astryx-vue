<script setup lang="ts">
import { Section } from '@astryx-vue/core/Section'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Stack direction="vertical" :gap="6">
    <Section variant="section" :padding="5">
      <Stack direction="vertical" :gap="1">
        <Text type="body" weight="bold">
          Section
        </Text>
        <Text type="supporting" color="secondary">
          White background.
        </Text>
      </Stack>
    </Section>
    <Section variant="muted" :padding="5">
      <Stack direction="vertical" :gap="1">
        <Text type="body" weight="bold">
          Wash
        </Text>
        <Text type="supporting" color="secondary">
          Gray background.
        </Text>
      </Stack>
    </Section>
    <Stack direction="vertical">
      <Section variant="transparent" :padding="5">
        <Stack direction="vertical" :gap="1">
          <Text type="body" weight="bold">
            Transparent
          </Text>
          <Text type="supporting" color="secondary">
            No background, shows the color behind it.
          </Text>
        </Stack>
      </Section>
    </Stack>
  </Stack>
</template>
