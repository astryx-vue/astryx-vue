<script setup lang="ts">
import type { ThemeId } from './themeCatalog'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { CodeBlock } from '@astryx-vue/core/Code'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { Link } from '@astryx-vue/core/Link'
import { Popover } from '@astryx-vue/core/Popover'
import { SelectableCard } from '@astryx-vue/core/SelectableCard'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useAppearance, usePageData } from 'kawapress/client'
import { computed, onMounted, shallowRef, watch } from 'vue'
import { themeCatalog, themeIds } from './themeCatalog'
import ThemeShowcase from './ThemeShowcase.vue'

/** 原版主题卡的顺序；Chocolate 原版没有，排在最后。 */
const ORDER: ThemeId[] = ['neutral', 'stone', 'gothic', 'matcha', 'y2k', 'butter', 'chocolate']

const page = usePageData()
const { isDark } = useAppearance()
const english = computed(() => page.value?.path.startsWith('/en/') ?? false)
const prefix = computed(() => english.value ? '/en' : '')

const copy = computed(() => english.value
  ? {
      title: 'Themes',
      intro: 'Astryx comes with a default theme built in. To make it your own, copy any theme you see here into a theme file you own.',
      learn: 'Learn how theming works',
      use: 'Use this theme',
      tryIt: 'Try in Playground',
      popover: (label: string) => `Import this stylesheet in your app entry to load ${label}, then put the attribute on the element it should theme.`,
      toLight: 'Switch preview to light mode',
      toDark: 'Switch preview to dark mode',
      preview: (label: string) => `Preview ${label} theme`,
    }
  : {
      title: '主题',
      intro: 'Astryx 内置一套默认主题。想做成自己的样子，可以把这里任意一套主题复制成你自己的主题文件。',
      learn: '了解主题的工作方式',
      use: '使用这套主题',
      tryIt: '在演练场中试试',
      popover: (label: string) => `在应用入口引入这份样式表加载 ${label}，再把属性写到要套用主题的元素上。`,
      toLight: '预览切到浅色',
      toDark: '预览切到深色',
      preview: (label: string) => `预览 ${label} 主题`,
    })

const themes = ORDER.map(id => themeCatalog.find(item => item.id === id)!).filter(Boolean)

const current = shallowRef<ThemeId>('neutral')
// 预览的深浅色默认跟站点走，面板上的按钮只切预览。
const previewDark = shallowRef(isDark.value)
watch(isDark, value => previewDark.value = value)

const label = computed(() => themes.find(item => item.id === current.value)?.label ?? 'Neutral')
const snippet = computed(() => `import '@astryx-vue/themes/${current.value}.css'\n\n<div data-astryx-theme="${current.value}">`)

function isThemeId(value: string | null): value is ThemeId {
  return !!value && (themeIds as readonly string[]).includes(value)
}

onMounted(() => {
  const fromQuery = new URLSearchParams(window.location.search).get('theme')
  if (isThemeId(fromQuery))
    current.value = fromQuery
})

function select(id: ThemeId) {
  current.value = id
  const url = new URL(window.location.href)
  if (id === 'neutral')
    url.searchParams.delete('theme')
  else
    url.searchParams.set('theme', id)
  window.history.replaceState(window.history.state, '', url)
}
</script>

<template>
  <div class="themes-page">
    <aside class="themes-page__aside">
      <Card class="themes-page__panel" :padding="0">
        <VStack :gap="4">
          <VStack :gap="5">
            <VStack :gap="2">
              <HStack :gap="2" h-align="between" align="center">
                <Heading :level="1" class="themes-page__title">
                  {{ copy.title }}
                </Heading>
                <Button
                  :label="previewDark ? copy.toLight : copy.toDark"
                  :tooltip="previewDark ? copy.toLight : copy.toDark"
                  variant="ghost"
                  size="lg"
                  is-icon-only
                  @click="previewDark = !previewDark"
                >
                  <template #icon>
                    <span :class="previewDark ? 'i-carbon-sun' : 'i-carbon-moon'" aria-hidden="true" />
                  </template>
                </Button>
              </HStack>
              <VStack :gap="1">
                <Text type="body" color="secondary">
                  {{ copy.intro }}
                </Text>
                <Link :href="`${prefix}/guide/theming`" color="secondary" has-underline>
                  {{ copy.learn }}
                </Link>
              </VStack>
            </VStack>
            <VStack :gap="2">
              <Popover :label="copy.use" placement="below" :width="340" :padding="3">
                <Button :label="copy.use" variant="primary" size="lg" width="100%" class="themes-page__pill" />
                <template #content>
                  <VStack :gap="2">
                    <Text type="body">
                      {{ copy.popover(label) }}
                    </Text>
                    <CodeBlock :code="snippet" language="ts" />
                  </VStack>
                </template>
              </Popover>
              <Button
                :label="copy.tryIt"
                variant="secondary"
                size="lg"
                width="100%"
                class="themes-page__pill"
                :href="`${prefix}/playground/?template=theme-showcase`"
              />
            </VStack>
          </VStack>
          <Divider class="themes-page__divider" />
          <div class="themes-page__pickers" role="group" :aria-label="copy.title">
            <SelectableCard
              v-for="item in themes"
              :key="item.id"
              :label="copy.preview(item.label)"
              :is-selected="item.id === current"
              variant="transparent"
              :padding="0"
              class="themes-page__picker"
              @change="select(item.id)"
            >
              <div
                class="themes-page__swatch"
                :data-astryx-theme="item.id"
                data-astryx-color-mode="light"
                :style="item.picker ? { backgroundImage: `url(${item.picker})` } : undefined"
              >
                <Text type="display-3" class="themes-page__swatch-label">
                  {{ item.label }}
                </Text>
              </div>
            </SelectableCard>
          </div>
        </VStack>
      </Card>
    </aside>
    <div class="themes-page__main">
      <ThemeShowcase :theme="current" :color-mode="previewDark ? 'dark' : 'light'" />
    </div>
  </div>
</template>

<style scoped>
.themes-page {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  /* 原版导航下面还空一行 24px，画廊从 y=120 开始。 */
  padding: 48px 24px 24px;
}

.themes-page__panel {
  /* 原版面板是 16px 内边距外加 1px 边框；core 的 Card 把边框算进内边距里，这里直接写死。 */
  padding: 16px;
}

.themes-page__aside {
  position: sticky;
  top: 24px;
  flex: 0 0 260px;
  width: 260px;
  max-height: calc(100svh - var(--nagi-nav-height, 64px) - 48px);
  overflow: auto;
  border-radius: 16px;
  scrollbar-width: none;
}

.themes-page__title {
  margin: 0;
  font-size: 29px;
  line-height: 36px;
}

.themes-page__main {
  flex: 1 1 auto;
  min-width: 0;
}

.themes-page__pickers {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.themes-page__picker {
  overflow: hidden;
  border-radius: 16px;
}

.themes-page__swatch {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 120px;
  padding: 16px;
  border-radius: 12px;
  background-color: var(--astryx-color-background-body);
  background-position: center;
  background-size: cover;
}

.themes-page__swatch-label {
  /* 字体由各主题的 display 样式给，这里只定字号。 */
  font-size: 24px;
  font-weight: 700;
  line-height: 29px;
}

/* 原版站点的按钮是胶囊形。 */
.themes-page__pill {
  border-radius: 9999px;
}

/* 窄屏照原版：面板去掉卡片外框，标题和说明居中，主题卡横向排成一行。 */
@media (max-width: 960px) {
  .themes-page {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 48px 16px 16px;
  }

  .themes-page__aside {
    position: static;
    flex: none;
    width: auto;
    max-height: none;
    overflow: visible;
  }

  .themes-page__panel {
    padding: 0;
    border-color: transparent;
    background: transparent;
  }

  .themes-page__title {
    flex: 1;
    padding-left: 36px;
    text-align: center;
  }

  .themes-page__panel :deep(.astryx-text) {
    text-align: center;
  }

  .themes-page__panel :deep(.astryx-link) {
    align-self: center;
  }

  .themes-page__divider {
    display: none;
  }

  .themes-page__pickers {
    flex-direction: row;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .themes-page__picker {
    flex: 0 0 168px;
  }

  .themes-page__swatch {
    height: 144px;
  }
}
</style>
