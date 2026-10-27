<script setup lang="ts">
import type { HomeStageLocale } from './homeStageCopy'
import { useClipboard } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { IconButton } from '@astryx-vue/core/IconButton'
import { computed } from 'vue'
import HomeStageChat from './HomeStageChat.vue'
import { HOME_STAGE_COPY } from './homeStageCopy'

const props = defineProps<{
  locale: HomeStageLocale
}>()

const install = 'pnpm add @astryx-vue/core @astryx-vue/themes'

const text = computed(() => HOME_STAGE_COPY[props.locale])
const prefix = computed(() => props.locale === 'en' ? '/en' : '')
const clipboard = useClipboard({ announce: text.value.copied })

async function copyInstall(): Promise<void> {
  await clipboard.copy(install)
}
</script>

<template>
  <div class="home-stage">
    <section class="home-press" aria-labelledby="home-title">
      <div class="home-mark" role="img" :aria-label="text.mark">
        <span class="home-mark__logo" />
      </div>

      <div class="home-copy">
        <h1 id="home-title">
          {{ text.title }}
        </h1>
        <div class="home-actions">
          <Button variant="primary" :href="`${prefix}/guide/getting-started`" :label="text.start" />
          <Button variant="secondary" :href="`${prefix}/components/`" :label="text.components" />
        </div>
        <div class="home-install">
          <code>{{ install }}</code>
          <IconButton
            class="home-copy-btn"
            size="sm"
            variant="ghost"
            :label="clipboard.isCopied.value ? text.copied : text.copy"
            @click="copyInstall"
          >
            <span
              class="home-copy-icon"
              :class="clipboard.isCopied.value ? 'i-carbon-checkmark' : 'i-carbon-copy'"
              aria-hidden="true"
            />
          </IconButton>
        </div>

        <div class="home-features">
          <div
            v-for="feat in text.features"
            :key="feat.title"
            class="home-feature-item"
          >
            <h2 class="home-feature-title">
              {{ feat.title }}
            </h2>
            <p class="home-feature-subtitle">
              {{ feat.subtitle }}
            </p>
          </div>
        </div>
      </div>

      <div class="home-chat-column">
        <HomeStageChat :locale="locale" />
      </div>
    </section>
  </div>
</template>

<style>
html:has(.home-stage),
.page-home {
  --vp-nav-bg-color: var(--astryx-color-background-body) !important;
  --vp-nav-home-bg-color: var(--astryx-color-background-body) !important;
  --astryx-bg: var(--astryx-color-background-body) !important;
}

html:has(.home-stage),
html:has(.home-stage) body,
html:has(.home-stage) .VPNav,
html:has(.home-stage) .VPNavBar,
html:has(.home-stage) .VPNavBar::before,
html:has(.home-stage) .VPContent,
html:has(.home-stage) .VPPage,
.page-home,
.page-home body,
.page-home .VPNav,
.page-home .VPNavBar,
.page-home .VPNavBar::before,
.page-home .VPContent,
.page-home .VPPage {
  background: var(--astryx-color-background-body) !important;
  background-color: var(--astryx-color-background-body) !important;
  box-shadow: none !important;
}

html:has(.home-stage) .VPNav,
.page-home .VPNav {
  border-bottom: 1px solid var(--astryx-color-border) !important;
}

html:has(.home-stage) .home-stage :where(a, button, input, textarea, select, summary):focus-visible,
.page-home .home-stage :where(a, button, input, textarea, select, summary):focus-visible {
  outline-color: var(--astryx-focus-outline-color);
}
</style>

<style scoped>
.home-stage {
  color: var(--astryx-color-text-primary);
  font-family: var(--astryx-font-family-body);
  background: var(--astryx-color-background-body);
}

.home-press {
  display: grid;
  grid-template-areas:
    "mark"
    "copy"
    "chat";
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;
  width: min(1200px, calc(100% - 2.5rem));
  min-height: calc(100svh - var(--vp-nav-height));
  margin: 0 auto;
  padding: clamp(3.5rem, 6vw, 5.5rem) 0 4rem;
  box-sizing: border-box;
}

.home-mark {
  grid-area: mark;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: clamp(2rem, 4vw, 3.5rem);
}

.home-mark__logo {
  display: block;
  width: min(100%, 28rem);
  aspect-ratio: 1060 / 200;
  margin: 0 auto;
  background: var(--astryx-color-text-primary);
  mask: url('/full-text-logo.svg') center / contain no-repeat;
}

.home-copy {
  grid-area: copy;
  max-width: 38rem;
}

.home-copy h1 {
  margin: 0;
  color: var(--astryx-color-text-primary);
  font-family: var(--astryx-font-family-heading);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1.15;
  text-wrap: balance;
  font-size: clamp(2rem, 4.2vw, 3.25rem);
}

.home-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  margin-top: 1.5rem;
}

.home-install {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  max-width: 100%;
  box-sizing: border-box;
  margin-top: 1.25rem;
  padding: 0.3rem 0.35rem 0.3rem 0.85rem;
  border: 1px solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-inner);
  background: var(--astryx-color-background-muted);
}

.home-install code {
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  font-family: var(--astryx-font-family-code);
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--astryx-color-text-primary);
  background: transparent;
  padding: 0;
}

.home-install code::-webkit-scrollbar {
  display: none;
}

.home-copy-btn {
  flex-shrink: 0;
}

.home-copy-icon {
  width: 1rem;
  height: 1rem;
}

.home-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding-top: clamp(2rem, 4vw, 2.75rem);
  border-top: 1px solid var(--astryx-color-border);
}

.home-feature-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.home-feature-title {
  margin: 0;
  font-family: var(--astryx-font-family-heading);
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--astryx-color-text-primary);
  letter-spacing: -0.015em;
}

.home-feature-subtitle {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--astryx-color-text-secondary);
}

.home-chat-column {
  grid-area: chat;
  min-width: 0;
}

@media (width >= 960px) {
  .home-press {
    grid-template-areas:
      "mark mark"
      "copy chat";
    grid-template-columns: minmax(0, 0.95fr) minmax(20rem, 1.05fr);
    gap: 2rem 3.5rem;
    align-items: start;
    padding-top: clamp(4rem, 6.5vw, 6rem);
    padding-bottom: 4rem;
  }

  .home-mark__logo {
    width: min(44vw, 29rem);
  }
}

@media (width < 960px) {
  .home-press {
    padding-top: 3.5rem;
    gap: 1.75rem;
  }

  .home-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .home-actions :deep(.astryx-button) {
    width: 100%;
  }
}
</style>
