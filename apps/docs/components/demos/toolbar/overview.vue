<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Heading } from '@astryx-vue/core/Heading'
import { Toolbar } from '@astryx-vue/core/Toolbar'
</script>

<template>
  <div class="nav-overview">
    <Toolbar label="Document">
      <template #start>
        <Button is-icon-only label="Back" size="sm" variant="ghost">
          <template #icon>
            <span class="i-carbon-arrow-left" />
          </template>
        </Button>
      </template>
      <template #center>
        <Heading :level="4" display="inline" type="label">
          Title
        </Heading>
      </template>
      <template #end>
        <Button label="Discard" size="sm" />
        <Button label="Save" size="sm" variant="primary" />
      </template>
    </Toolbar>
  </div>
</template>
