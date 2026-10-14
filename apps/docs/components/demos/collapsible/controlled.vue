<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

const steps = ['profile', 'security', 'billing'] as const
const open = ref<(typeof steps)[number]>('profile')
const index = computed(() => steps.indexOf(open.value))

function previous() {
  open.value = steps[Math.max(0, index.value - 1)]
}
function next() {
  open.value = steps[Math.min(steps.length - 1, index.value + 1)]
}
</script>

<template>
  <Stack :gap="3" :max-width="440">
    <Stack align="center" direction="horizontal" :gap="2">
      <Button label="Previous" variant="secondary" size="sm" :is-disabled="index <= 0" @click="previous" />
      <Button label="Next" variant="secondary" size="sm" :is-disabled="index >= steps.length - 1" @click="next" />
      <Text type="supporting">
        Step {{ index + 1 }} of {{ steps.length }}
      </Text>
    </Stack>
    <CollapsibleGroup v-model:value="open" type="single">
      <Stack :gap="2">
        <Card>
          <Collapsible trigger="Profile" value="profile">
            <Text type="body" color="secondary">
              Name, email, and photo. Changes save as you type; the email address needs confirmation from the new inbox before it takes effect.
            </Text>
          </Collapsible>
        </Card>
        <Card>
          <Collapsible trigger="Security" value="security">
            <Text type="body" color="secondary">
              Two-factor authentication, active sessions, and recent login history. Signing out of a session revokes its token immediately.
            </Text>
          </Collapsible>
        </Card>
        <Card>
          <Collapsible trigger="Billing" value="billing">
            <Text type="body" color="secondary">
              Invoices, payment method, and plan. Invoices stay downloadable for seven years, including after a downgrade.
            </Text>
          </Collapsible>
        </Card>
      </Stack>
    </CollapsibleGroup>
  </Stack>
</template>
