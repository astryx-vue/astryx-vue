<script setup lang="ts">
import { MetadataList, MetadataListItem } from '@astryx-vue/core/MetadataList'
import { HStack } from '@astryx-vue/core/Stack'
import { Token } from '@astryx-vue/core/Token'
</script>

<template>
  <MetadataList columns="multi">
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
    <MetadataListItem label="Tags">
      <HStack :gap="1">
        <Token label="component" />
        <Token label="xds" />
      </HStack>
    </MetadataListItem>
    <MetadataListItem label="Priority">
      Tier 1
    </MetadataListItem>
  </MetadataList>
</template>
