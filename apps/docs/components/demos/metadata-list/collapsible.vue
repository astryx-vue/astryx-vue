<script setup lang="ts">
import { MetadataList, MetadataListItem } from '@astryx-vue/core/MetadataList'
</script>

<template>
  <MetadataList :max-num-of-items="3">
    <MetadataListItem label="Name">
      MetadataList
    </MetadataListItem>
    <MetadataListItem label="Status">
      Active
    </MetadataListItem>
    <MetadataListItem label="Owner">
      Joey
    </MetadataListItem>
    <MetadataListItem label="Created">
      Jan 15, 2026
    </MetadataListItem>
    <MetadataListItem label="Updated">
      Mar 26, 2026
    </MetadataListItem>
    <MetadataListItem label="Priority">
      Tier 1
    </MetadataListItem>
  </MetadataList>
</template>
