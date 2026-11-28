<script setup lang="ts">
import { TabBar, TabBarItem, TabBarMoreList } from '@astryx-vue/lab'
import { computed, ref } from 'vue'

interface Section {
  value: string
  label: string
  icon: string
  selectedIcon: string
  badge?: number
  badgeLabel?: string
}

const sections: readonly Section[] = [
  { value: 'home', label: 'Home', icon: 'i-heroicons-home', selectedIcon: 'i-heroicons-home-solid' },
  { value: 'inbox', label: 'Inbox', icon: 'i-heroicons-inbox', selectedIcon: 'i-heroicons-inbox-solid', badge: 3, badgeLabel: '3 unread' },
  { value: 'browse', label: 'Browse', icon: 'i-heroicons-squares-2x2', selectedIcon: 'i-heroicons-squares-2x2-solid' },
  { value: 'profile', label: 'Profile', icon: 'i-heroicons-user', selectedIcon: 'i-heroicons-user-solid' },
  { value: 'settings', label: 'Settings', icon: 'i-heroicons-cog-6-tooth', selectedIcon: 'i-heroicons-cog-6-tooth-solid' },
  { value: 'help', label: 'Help', icon: 'i-heroicons-question-mark-circle', selectedIcon: 'i-heroicons-question-mark-circle-solid' },
]

const selected = ref('home')
const current = computed(() => sections.find(section => section.value === selected.value))
const rows = Array.from({ length: 30 }, (_, index) => index + 1)
</script>

<template>
  <div class="tab-bar-demo">
    <div id="tab-bar-demo-panel" class="tab-bar-demo__panel">
      <TabBarMoreList v-if="selected === 'more'" v-model="selected">
        <TabBarItem
          v-for="section in sections"
          :key="section.value"
          v-bind="section"
        />
      </TabBarMoreList>
      <template v-else>
        <h2 class="tab-bar-demo__title">
          {{ current?.label }}
        </h2>
        <p v-for="row in rows" :key="row" class="tab-bar-demo__row">
          {{ current?.label }} item {{ row }}
        </p>
      </template>
    </div>
    <TabBar v-model="selected" label="Sections">
      <TabBarItem
        v-for="section in sections"
        :key="section.value"
        v-bind="section"
        panel-id="tab-bar-demo-panel"
      />
    </TabBar>
  </div>
</template>

<style scoped>
/* 手机大小的框：transform 让栏的 position: fixed 停在框里，而不是整个页面底部。 */
.tab-bar-demo {
  position: relative;
  width: 375px;
  max-width: 100%;
  height: 560px;
  overflow: hidden;
  transform: translateZ(0);
  border: 1px solid var(--astryx-color-border);
  border-radius: 24px;
}

.tab-bar-demo__panel {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: var(--astryx-spacing-4) var(--astryx-spacing-4) 83px;
}

.tab-bar-demo__title {
  margin: 0 0 var(--astryx-spacing-2);
  font-size: 28px;
}

.tab-bar-demo__row {
  margin: 0;
  padding: 12px 0;
  border-bottom: 1px solid var(--astryx-color-border);
}
</style>
