<script setup lang="ts">
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

const SUMMARY: Record<string, string> = {
  overview: 'Four projects, two of them due this week.',
  activity: 'Eighteen updates since Monday.',
  members: 'Twelve members, three invites still pending.',
}

const view = ref('overview')
const summary = computed(() => SUMMARY[view.value] ?? '')
</script>

<template>
  <div class="segmented-control-preview">
    <VStack class="segmented-control-preview__panel" :gap="3" align="start">
      <SegmentedControl v-model="view" label="Workspace view">
        <SegmentedControlItem label="Overview" value="overview" />
        <SegmentedControlItem label="Activity" value="activity" />
        <SegmentedControlItem label="Members" value="members" />
      </SegmentedControl>
      <Text type="body" color="secondary">
        {{ summary }}
      </Text>
    </VStack>
  </div>
</template>
