<script setup lang="ts">
import { Divider } from '@astryx-vue/core/Divider'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { Item } from '@astryx-vue/core/List'
import { HStack } from '@astryx-vue/core/Stack'

const tabs = [
  { name: 'Project brief', isActive: true },
  { name: 'Research notes', isActive: false },
  { name: 'Interaction prototype', isActive: false },
]

function onSelect(): void {}
function onClose(): void {}
function onAdd(): void {}
</script>

<template>
  <HStack align="center" class="item-tabs" :gap="0.5">
    <HStack
      align="center"
      class="item-tabs__strip"
      role="group"
      aria-label="Open documents"
      :gap="0.5"
      :padding-inline="2"
      :padding-block="1"
      is-scrollable
    >
      <template v-for="(tab, index) in tabs" :key="tab.name">
        <Divider v-if="index > 0" orientation="vertical" class="item-tabs__rule" />
        <Item
          class="item-tabs__tab"
          :label="tab.name"
          density="compact"
          :is-selected="tab.isActive"
          :aria-current="tab.isActive ? 'true' : undefined"
          @click="onSelect"
        >
          <template #startContent>
            <Icon
              icon="i-carbon-document"
              size="sm"
              :color="tab.isActive ? 'primary' : 'secondary'"
            />
          </template>
          <template #endContent>
            <IconButton
              class="item-tabs__close"
              :label="`Close ${tab.name}`"
              variant="ghost"
              size="sm"
              @click.stop="onClose"
            >
              <Icon icon="close" size="sm" />
            </IconButton>
          </template>
        </Item>
      </template>
    </HStack>
    <IconButton label="New document" variant="ghost" size="sm" @click="onAdd">
      <Icon icon="i-carbon-add" size="sm" color="secondary" />
    </IconButton>
  </HStack>
</template>

<style scoped>
.item-tabs {
  min-width: 0;
  width: min(100%, 600px);
}

.item-tabs__strip {
  min-width: 0;
  scrollbar-width: none;
}

.item-tabs__rule {
  height: 16px;
}

.item-tabs__tab {
  flex: 0 1 auto;
  width: 164px;
  min-width: 96px;
}

/* The close button stays in the layout and only shows on hover or focus, so the
   label never shifts when the pointer enters the tab. */
.item-tabs__close {
  visibility: hidden;
}

.item-tabs__tab:hover .item-tabs__close,
.item-tabs__tab:focus-within .item-tabs__close,
.item-tabs__tab[data-selected] .item-tabs__close {
  visibility: visible;
}
</style>
