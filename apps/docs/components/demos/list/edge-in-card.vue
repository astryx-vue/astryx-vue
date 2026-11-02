<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { List, ListItem } from '@astryx-vue/core/List'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const outsetSelected = ref('mentions')
const bleedSelected = ref('mentions')
</script>

<template>
  <div class="list-preview__stack">
    <Card :width="360">
      <VStack :gap="2">
        <Heading :level="4">
          Outset rows
        </Heading>
        <List edge="outset" has-dividers>
          <ListItem
            label="Mentions"
            description="Comments that name you"
            :is-selected="outsetSelected === 'mentions'"
            @click="outsetSelected = 'mentions'"
          />
          <ListItem
            label="Follows"
            description="New followers this week"
            :is-selected="outsetSelected === 'follows'"
            @click="outsetSelected = 'follows'"
          />
        </List>
      </VStack>
    </Card>
    <Card :width="360">
      <VStack :gap="2">
        <Heading :level="4">
          Bleed rows
        </Heading>
        <List edge="bleed" has-dividers>
          <ListItem
            label="Mentions"
            description="Comments that name you"
            :is-selected="bleedSelected === 'mentions'"
            @click="bleedSelected = 'mentions'"
          />
          <ListItem
            label="Follows"
            description="New followers this week"
            :is-selected="bleedSelected === 'follows'"
            @click="bleedSelected = 'follows'"
          />
        </List>
      </VStack>
    </Card>
  </div>
</template>
