<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { MetadataList, MetadataListItem } from '@astryx-vue/core/MetadataList'

provideAstryxLocale('en')
</script>

<template>
  <MetadataList>
    <MetadataListItem label="Name">
      MetadataList
    </MetadataListItem>
    <MetadataListItem label="Status">
      Active
    </MetadataListItem>
    <MetadataListItem label="Owner">
      Joey
    </MetadataListItem>
  </MetadataList>
</template>
