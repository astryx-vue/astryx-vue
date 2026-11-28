<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Icon } from '@astryx-vue/core/Icon'
import { Section } from '@astryx-vue/core/Section'
import { useToast } from '@astryx-vue/core/Toast'
import { Toolbar } from '@astryx-vue/core/Toolbar'

const showToast = useToast()
</script>

<template>
  <Card class="toolbar-overview">
    <Toolbar label="Document toolbar" :dividers="['bottom']">
      <template #start>
        <Button label="Back" variant="ghost" is-icon-only @click="showToast({ body: 'Demo: Back would run here' })">
          <template #icon>
            <Icon icon="i-heroicons-arrow-left" class="toolbar-overview__back" />
          </template>
        </Button>
      </template>
      <template #center>
        <Heading :level="4">
          Title
        </Heading>
      </template>
      <template #end>
        <Button
          label="Discard"
          variant="secondary"
          @click="showToast({ body: 'Demo: your changes would be discarded here' })"
        />
        <Button
          label="Save"
          variant="primary"
          @click="showToast({ body: 'Demo: your changes would be saved here' })"
        />
      </template>
    </Toolbar>
    <Section />
  </Card>
</template>

<style scoped>
.toolbar-overview {
  width: 600px;
  max-width: 100%;
  height: 100%;
  margin-top: 260px;
}

.toolbar-overview__back:dir(rtl) {
  transform: scaleX(-1);
}
</style>
