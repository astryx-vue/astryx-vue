<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <CollapsibleGroup type="multiple" :default-value="['features', 'pricing']">
    <Stack :gap="2" :max-width="440">
      <Card>
        <Collapsible trigger="Features" value="features">
          <Text type="body" color="secondary">
            Real-time collaboration, full version history, and granular permissions. Every plan includes unlimited documents and unlimited guests — seats are counted for editors only.
          </Text>
        </Collapsible>
      </Card>
      <Card>
        <Collapsible trigger="Pricing" value="pricing">
          <Stack :gap="2">
            <Text type="body" color="secondary">
              Free for up to 5 editors. Pro is $12 per editor per month billed annually, or $15 month to month.
            </Text>
            <Text type="supporting">
              Non-profit and education pricing is 50% off any paid plan.
            </Text>
          </Stack>
        </Collapsible>
      </Card>
      <Card>
        <Collapsible trigger="Integrations" value="integrations">
          <Text type="body" color="secondary">
            Slack, GitHub, Jira, Figma, and 40 more through pre-built connectors, plus a REST API and outbound webhooks for anything not on the list.
          </Text>
        </Collapsible>
      </Card>
    </Stack>
  </CollapsibleGroup>
</template>
