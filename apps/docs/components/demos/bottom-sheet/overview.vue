<script setup lang="ts">
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { CheckboxList, CheckboxListItem } from '@astryx-vue/core/CheckboxList'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { Section } from '@astryx-vue/core/Section'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const isOpen = ref(false)
const inStock = ref(false)
const onSale = ref(false)
const freeShipping = ref(false)
</script>

<template>
  <Button label="Open sheet" @click="isOpen = true" />
  <BottomSheet v-model:is-open="isOpen" label="Filters">
    <Section :padding="4">
      <VStack :gap="4">
        <Heading :level="3">
          Filters
        </Heading>
        <Divider />
        <CheckboxList label="Filters" is-label-hidden>
          <CheckboxListItem label="In stock" :is-checked="inStock" @check="inStock = $event" />
          <CheckboxListItem label="On sale" :is-checked="onSale" @check="onSale = $event" />
          <CheckboxListItem label="Free shipping" :is-checked="freeShipping" @check="freeShipping = $event" />
        </CheckboxList>
        <Button label="Apply" @click="isOpen = false" />
      </VStack>
    </Section>
  </BottomSheet>
</template>
