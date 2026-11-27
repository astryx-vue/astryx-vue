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

const sizes = [
  { label: 'Small', size: 'sm' as const },
  { label: 'Medium', size: 'md' as const },
  { label: 'Large', size: 'lg' as const },
]
</script>

<template>
  <div class="nav-stack">
    <Card v-for="item in sizes" :key="item.size">
      <Toolbar :label="`${item.label} toolbar`" :size="item.size">
        <template #start>
          <Heading :level="4" display="inline" type="label">
            {{ item.label }}
          </Heading>
        </template>
        <template #end>
          <Button is-icon-only label="Filter" :size="item.size" variant="ghost" @click="demo('Filter')">
            <template #icon>
              <span class="i-carbon-filter" />
            </template>
          </Button>
          <Button label="Add" :size="item.size" @click="demo('Add')" />
        </template>
      </Toolbar>
    </Card>
  </div>
</template>
