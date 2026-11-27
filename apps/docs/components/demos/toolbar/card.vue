<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { useToast } from '@astryx-vue/core/Toast'
import { Toolbar } from '@astryx-vue/core/Toolbar'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
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
        <Button is-icon-only label="Filter" size="sm" variant="ghost" @click="demo('Filter')">
          <template #icon>
            <span class="i-carbon-filter" />
          </template>
        </Button>
        <Button is-icon-only label="Add user" size="sm" @click="demo('Add user')">
          <template #icon>
            <span class="i-carbon-add" />
          </template>
        </Button>
      </template>
    </Toolbar>
  </Card>
</template>
