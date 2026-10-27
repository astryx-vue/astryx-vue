<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { MetadataList, MetadataListItem } from '@astryx-vue/core/MetadataList'
</script>

<template>
  <MetadataList title="Deployment">
    <MetadataListItem label="Environment">
      Production
    </MetadataListItem>
    <MetadataListItem label="Status">
      <Badge label="Healthy" variant="green" />
    </MetadataListItem>
    <MetadataListItem label="Version">
      v2.14.0
    </MetadataListItem>
    <MetadataListItem label="Last deployed">
      June 12, 2026
    </MetadataListItem>
  </MetadataList>
</template>
