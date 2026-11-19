<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card :width="420" max-width="100%">
    <CollapsibleGroup type="single" default-value="notifications">
      <Stack :gap="4">
        <Collapsible value="general">
          <template #trigger>
            <Text type="body" weight="semibold">
              General
            </Text>
          </template>
          <Text type="body" color="secondary">
            Display name, language, and time zone. Time zone drives every date
            shown in the product, including scheduled reports.
          </Text>
        </Collapsible>

        <Collapsible value="notifications">
          <template #trigger>
            <Text type="body" weight="semibold">
              Notifications
            </Text>
          </template>
          <Stack :gap="2">
            <Text type="body" color="secondary">
              Choose which email and push notifications you receive. Mentions
              and direct messages are always delivered — everything else can
              be turned off or batched into a daily digest.
            </Text>
            <Text type="body" color="secondary">
              Quiet hours pause push notifications overnight in your local
              time zone without affecting email.
            </Text>
          </Stack>
        </Collapsible>

        <Collapsible value="privacy">
          <template #trigger>
            <Text type="body" weight="semibold">
              Privacy
            </Text>
          </template>
          <Text type="body" color="secondary">
            Control who can see your profile and activity, and whether your
            workspace appears in search for people outside your organization.
          </Text>
        </Collapsible>
      </Stack>
    </CollapsibleGroup>
  </Card>
</template>
