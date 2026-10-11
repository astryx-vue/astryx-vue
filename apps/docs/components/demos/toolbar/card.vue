<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Toolbar } from '@astryx-vue/core/Toolbar'
</script>

<template>
  <Card width="min(100%, 28rem)">
    <Toolbar :dividers="['bottom']" label="User list actions" size="sm">
      <template #start>
        <Heading :level="4" display="inline" type="label">
          Card title
        </Heading>
      </template>
      <template #end>
        <Button is-icon-only label="Filter" size="sm" variant="ghost">
          <template #icon>
            <span class="i-carbon-filter" />
          </template>
        </Button>
        <Button is-icon-only label="Add user" size="sm">
          <template #icon>
            <span class="i-carbon-add" />
          </template>
        </Button>
      </template>
    </Toolbar>
  </Card>
</template>
