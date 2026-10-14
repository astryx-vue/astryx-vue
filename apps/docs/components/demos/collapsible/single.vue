<script setup lang="ts">
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
import { Section } from '@astryx-vue/core/Section'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <CollapsibleGroup type="single" default-value="general">
    <Stack :gap="2" :max-width="440">
      <Section>
        <Collapsible trigger="General" value="general">
          <Text type="body" color="secondary">
            Language, time zone, and date format. Time zone drives every timestamp in the product, including exports and scheduled reports.
          </Text>
        </Collapsible>
      </Section>
      <Section>
        <Collapsible trigger="Privacy" value="privacy">
          <Text type="body" color="secondary">
            Control who can see your profile and activity. Turning off discovery also removes you from @-mention autocomplete for people outside your workspace.
          </Text>
        </Collapsible>
      </Section>
      <Section>
        <Collapsible trigger="Notifications" value="notifications">
          <Text type="body" color="secondary">
            Choose what you are notified about and how it reaches you. Mentions always come through; everything else can be batched into a daily digest.
          </Text>
        </Collapsible>
      </Section>
    </Stack>
  </CollapsibleGroup>
</template>
