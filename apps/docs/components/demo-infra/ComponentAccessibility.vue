<script setup lang="ts">
import type { DocsLocale } from './docs-i18n'
import type { AccessibilityRequirement } from './reference/loadReference'
import { useData } from 'vitepress'
import { computed } from 'vue'
import { parseComponentDocsRoute } from './componentDocsRoute'
import { accessibilityFor } from './reference/loadReference'
import { richText } from './richText'

const { page } = useData()
const route = computed(() => parseComponentDocsRoute(`/${page.value.relativePath.replace(/\.md$/, '')}`))
const locale = computed<DocsLocale>(() => route.value?.locale === 'en' ? 'en' : 'zh')

const REQUIREMENT_ZH: Record<string, string> = {
  '3:1': '3:1',
  '3:1 if needed': '需要时 3:1',
  '3:1 if relied upon': '要靠它区分时 3:1',
  '4.5:1': '4.5:1',
  'Not required': '不要求',
}

const CRITERION_ZH: Record<string, string> = {
  '1.4.3 Contrast (Minimum)': '1.4.3 对比度（最低）',
  '1.4.11 Non-text Contrast': '1.4.11 非文本对比度',
  '1.4.3 and 1.4.11 exceptions': '1.4.3 与 1.4.11 的例外',
}

const STATE_ZH: Record<string, string> = {
  'Checked': '已勾选',
  'Disabled': '禁用',
  'Focus visible': '可见焦点',
  'Hover': '悬停',
  'Icon only': '仅图标',
  'Loading': '加载中',
  'Pointer down': '按下',
  'Rest': '静止',
  'Selected': '已选中',
  'Unselected': '未选中',
}

const items = computed(() => {
  const current = route.value
  if (current == null || current.kind !== 'detail')
    return null
  return accessibilityFor(current.slug, locale.value)
})

const copy = computed(() => locale.value === 'en'
  ? {
      applies: 'Applies to',
      category: 'Color contrast',
      criterion: 'Criterion',
      guidance: 'Guidance',
      intro: 'Measure the foreground and background as they appear together on screen. The ratios below are the WCAG 2.2 AA checks for this component.',
      label: 'Color contrast',
      ratio: 'Ratio',
      requirement: 'Check',
    }
  : {
      applies: '适用状态',
      category: '色彩对比',
      criterion: '条款',
      guidance: '怎么量',
      intro: '前景和背景按它们在屏幕上叠在一起的颜色来量。下面的比值是这个组件要达到的 WCAG 2.2 AA。',
      label: '色彩对比',
      ratio: '比值',
      requirement: '检查项',
    })

function requirementLabel(item: AccessibilityRequirement): string {
  if (locale.value === 'en')
    return item.requirement
  return REQUIREMENT_ZH[item.requirement] ?? item.requirement
}

function criterionLabel(item: AccessibilityRequirement): string {
  if (locale.value === 'en')
    return item.criterion
  return CRITERION_ZH[item.criterion] ?? item.criterion
}

function stateLabel(state: string): string {
  if (locale.value === 'en')
    return state
  return STATE_ZH[state] ?? state
}

const references = [
  {
    href: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
    label: 'WCAG 1.4.3',
  },
  {
    href: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html',
    label: 'WCAG 1.4.11',
  },
]
</script>

<template>
  <section v-if="items" class="component-a11y" :aria-label="copy.label">
    <h2>{{ copy.category }}</h2>
    <p>{{ copy.intro }}</p>
    <div class="component-api-table" role="region" :aria-label="copy.label" tabindex="0">
      <table>
        <thead>
          <tr>
            <th>{{ copy.requirement }}</th>
            <th>{{ copy.ratio }}</th>
            <th>{{ copy.applies }}</th>
            <th>{{ copy.guidance }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ requirementLabel(item) }}</td>
            <td>{{ item.states.map(stateLabel).join(locale === 'en' ? ', ' : '、') }}</td>
            <td>
              <p class="component-a11y__guidance">
                <template v-for="(run, index) in richText(item.description)" :key="index">
                  <code v-if="run.code">{{ run.text }}</code>
                  <template v-else>
                    {{ run.text }}
                  </template>
                </template>
              </p>
              <p class="component-a11y__criterion">
                {{ criterionLabel(item) }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="component-a11y__refs">
      <a v-for="reference in references" :key="reference.href" :href="reference.href" rel="noreferrer" target="_blank">{{ reference.label }}</a>
    </p>
  </section>
</template>
