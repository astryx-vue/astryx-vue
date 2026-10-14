<script setup lang="ts">
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
import { Link } from '@astryx-vue/core/Link'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Stack :gap="3" :max-width="560">
    <Text type="label">
      Billing and plans
    </Text>
    <CollapsibleGroup type="single" has-dividers default-value="proration">
      <Collapsible value="proration">
        <template #trigger>
          <Text type="body" weight="semibold">
            How is my bill prorated when I change plans mid-cycle?
          </Text>
        </template>
        <Stack :gap="2">
          <Text type="body" color="secondary">
            Upgrades take effect immediately and we charge the difference for the days remaining in the cycle. Downgrades take effect at the next renewal, so you keep the higher tier until the period you already paid for runs out.
          </Text>
          <Text type="body" color="secondary">
            Seat changes work the same way: added seats are prorated to the day, removed seats free up at renewal.
          </Text>
        </Stack>
      </Collapsible>
      <Collapsible value="username">
        <template #trigger>
          <Text type="body" weight="semibold">
            Can I change my username?
          </Text>
        </template>
        <Text type="body" color="secondary">
          Once every 30 days, from your profile settings. Old links keep working — we redirect them for a year.
        </Text>
      </Collapsible>
      <Collapsible value="cancel">
        <template #trigger>
          <Text type="body" weight="semibold">
            What happens to my data if I cancel?
          </Text>
        </template>
        <Stack :gap="2">
          <Text type="body" color="secondary">
            Your workspace goes read-only at the end of the billing period. Nothing is deleted for 30 days, so reactivating inside that window restores everything exactly as it was.
          </Text>
          <Text type="body" color="secondary">
            After 30 days the workspace and its backups are permanently removed. Export first if you want a copy — an export covers documents, comments, and version history.
          </Text>
          <Link href="#export" is-standalone has-underline>
            How to export your workspace
          </Link>
        </Stack>
      </Collapsible>
      <Collapsible value="discounts">
        <template #trigger>
          <Text type="body" weight="semibold">
            Do you offer discounts for non-profits or education?
          </Text>
        </template>
        <Text type="body" color="secondary">
          Yes — 50% off any paid plan for registered non-profits and accredited schools. Email your documentation and we usually apply it within two business days.
        </Text>
      </Collapsible>
    </CollapsibleGroup>
  </Stack>
</template>
