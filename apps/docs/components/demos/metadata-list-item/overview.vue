<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Link } from '@astryx-vue/core/Link'
import { MetadataList, MetadataListItem } from '@astryx-vue/core/MetadataList'
</script>

<template>
  <MetadataList title="Project Details">
    <MetadataListItem label="Name">
      Design System v2
    </MetadataListItem>
    <MetadataListItem label="Status">
      <Badge label="Active" variant="green" />
    </MetadataListItem>
    <MetadataListItem label="Owner">
      <Link href="#">
        Alice Johnson
      </Link>
    </MetadataListItem>
    <MetadataListItem label="Created">
      January 15, 2025
    </MetadataListItem>
    <MetadataListItem label="Priority">
      <Badge label="High" variant="red" />
    </MetadataListItem>
    <MetadataListItem label="Repository">
      <Link href="#">
        github.com/org/design-system
      </Link>
    </MetadataListItem>
  </MetadataList>
</template>
