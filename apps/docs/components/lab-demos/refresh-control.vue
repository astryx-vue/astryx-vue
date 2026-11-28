<script setup lang="ts">
import { Button, Spinner } from '@astryx-vue/core'
import { REFRESH_REVEAL_VAR, useRefreshControl } from '@astryx-vue/lab'
import { ref } from 'vue'

const count = ref(0)

const pull = useRefreshControl({
  onRefresh: async () => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    count.value++
  },
  announce: 'Refreshing',
})

const revealed = { opacity: `var(${REFRESH_REVEAL_VAR}, 0)` }
</script>

<template>
  <div class="refresh-demo">
    <div class="refresh-demo__scroller" role="region" aria-label="Inbox" tabindex="0">
      <div :ref="pull.contentRef" class="refresh-demo__content" :aria-busy="pull.isRefreshing.value || undefined">
        <ul class="refresh-demo__list">
          <li v-for="index in 30" :key="index">
            Message {{ index }}<span v-if="index === 1"> · refreshed {{ count }} times</span>
          </li>
        </ul>
        <div class="refresh-demo__clip">
          <div :ref="pull.indicatorRef" class="refresh-demo__indicator" aria-hidden="true">
            <span :style="revealed">
              <Spinner size="lg" shade="subtle" label="Refreshing" />
            </span>
          </div>
        </div>
      </div>
    </div>
    <Button label="Refresh" :disabled="pull.isRefreshing.value" @click="pull.refresh()" />
  </div>
</template>

<style scoped>
.refresh-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.refresh-demo__scroller {
  width: min(100%, 360px);
  height: 334px;
  overflow-y: auto;
  border-radius: 12px;
  border: 1px solid var(--astryx-color-border, #ddd);
}

.refresh-demo__content {
  position: relative;
}

.refresh-demo__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.refresh-demo__list li {
  padding: 12px 16px;
  border-bottom: 1px solid var(--astryx-color-border, #eee);
}

.refresh-demo__clip {
  position: absolute;
  inset-inline: 0;
  bottom: 100%;
  height: 100lvh;
  overflow: hidden;
  pointer-events: none;
}

.refresh-demo__indicator {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
