<script setup lang="ts">
import type { ColorBucket, TokenSectionId } from './parseTokens'
import { computed, ref } from 'vue'
import baseCss from '../../../../packages/themes/neutral/base.css?raw'
import {
  colorBucket,

  parseCustomProperties,
  resolveStop,
  sectionId,
  splitLightDark,

} from './parseTokens'

const props = defineProps<{
  locale: 'zh' | 'en'
}>()

const properties = parseCustomProperties(baseCss)
const byName = new Map(properties.map(property => [property.name, property.value]))

const copy = {
  light: { zh: '浅色', en: 'Light' },
  dark: { zh: '深色', en: 'Dark' },
  replay: { zh: '再播一次', en: 'Replay' },
  motionLead: {
    zh: '进入和退出各有淡入淡出、缩放，以及上、下、起始侧、结束侧四个方向的滑动。系统开启「减少动态效果」时，位移和缩放会收成 0，透明度直接落到结束状态。现有组件仍使用自己的动画名。',
    en: 'Enter and exit each have a fade, a scale, and slides from above, below, the start side, and the end side. When the system asks for reduced motion, the distance and scale collapse to zero and opacity jumps to the end state. Existing components still use their own animation names.',
  },
} as const

const sectionCopy: Record<TokenSectionId, { title: { zh: string, en: string }, description: { zh: string, en: string } }> = {
  color: {
    title: { zh: '颜色', en: 'Color' },
    description: {
      zh: '每一格左边是浅色，右边是深色。带透明度的颜色垫了棋盘格。',
      en: 'Each pair shows the light stop, then the dark stop. Translucent colors sit on a checkerboard.',
    },
  },
  spacing: {
    title: { zh: '间距', en: 'Spacing' },
    description: {
      zh: '0 到 12。条的宽度就是这个间距。',
      en: 'Steps 0 through 12. The bar is as wide as the token.',
    },
  },
  size: {
    title: { zh: '控件高度', en: 'Control size' },
    description: {
      zh: '小号、中号、大号控件的高度。',
      en: 'Heights for small, medium, and large controls.',
    },
  },
  border: {
    title: { zh: '边框', en: 'Border' },
    description: {
      zh: '默认边框粗细。',
      en: 'The default border width.',
    },
  },
  focus: {
    title: { zh: '焦点环', en: 'Focus ring' },
    description: {
      zh: '键盘焦点环。颜色跟随 accent。',
      en: 'The keyboard focus ring. Its color follows accent.',
    },
  },
  radius: {
    title: { zh: '圆角', en: 'Radius' },
    description: {
      zh: '色块的圆角就是这个变量。',
      en: 'The sample uses the token as its corner radius.',
    },
  },
  shadow: {
    title: { zh: '阴影', en: 'Shadow' },
    description: {
      zh: '外阴影三档，再加上五种内阴影。预览跟随当前的浅色或深色。',
      en: 'Three elevation shadows, plus five inset shadows. The preview follows the current color scheme.',
    },
  },
  duration: {
    title: { zh: '时长', en: 'Duration' },
    description: {
      zh: 'Neutral 的节奏比默认主题更快：fast 125ms，medium 300ms，slow 700ms，比例 0.75，再取整到 5ms。',
      en: 'Neutral is snappier than the default scale: fast 125ms, medium 300ms, slow 700ms, ratio 0.75, rounded to 5ms.',
    },
  },
  ease: {
    title: { zh: '缓动', en: 'Easing' },
    description: {
      zh: '进入动画用这条减速曲线。',
      en: 'Entrances use this decelerating curve.',
    },
  },
  font: {
    title: { zh: '字体', en: 'Font' },
    description: {
      zh: '字体族、字号阶梯和字重。字号从 14px 起，按 1.2 的比例取整。',
      en: 'Families, the size ramp, and weights. Sizes start at 14px and step by 1.2, then round.',
    },
  },
  type: {
    title: { zh: '字号角色', en: 'Type roles' },
    description: {
      zh: '标题、正文、辅助文字和展示字号。它们引用上面的字号和字重。',
      en: 'Headings, body, supporting text, and display roles. They point at the size and weight tokens above.',
    },
  },
}

const bucketOrder = ['core', 'text', 'icon', 'status', 'line', 'blue', 'cyan', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow'] as const satisfies readonly ColorBucket[]

const bucketCopy: Record<ColorBucket, { zh: string, en: string }> = {
  core: { zh: '底色与强调', en: 'Surfaces and accent' },
  text: { zh: '文字', en: 'Text' },
  icon: { zh: '图标', en: 'Icon' },
  status: { zh: '状态', en: 'Status' },
  line: { zh: '边框与效果', en: 'Border and effect' },
  blue: { zh: '蓝', en: 'Blue' },
  cyan: { zh: '青', en: 'Cyan' },
  gray: { zh: '灰', en: 'Gray' },
  green: { zh: '绿', en: 'Green' },
  orange: { zh: '橙', en: 'Orange' },
  pink: { zh: '粉', en: 'Pink' },
  purple: { zh: '紫', en: 'Purple' },
  red: { zh: '红', en: 'Red' },
  teal: { zh: '蓝绿', en: 'Teal' },
  yellow: { zh: '黄', en: 'Yellow' },
}

const notes: Record<string, { zh: string, en: string }> = {
  '--astryx-color-text-secondary': {
    zh: '浅色保持 #525252。原版 Neutral 是 #737373。输入框、选择器和说明文字已经在用现在这个值。',
    en: 'The light stop stays #525252. Upstream Neutral uses #737373. Inputs, selectors, and supporting text already use the current value.',
  },
  '--astryx-color-text-accent': {
    zh: '语义值和 accent 相同。text.css 里另有一套蓝色，会盖住这里，组件仍显示蓝色。',
    en: 'The semantic value matches accent. text.css still declares a blue pair that wins, so components stay blue.',
  },
  '--astryx-color-track': {
    zh: 'Neutral 没有覆盖这一项，所以用原版默认色。',
    en: 'Neutral does not override this token, so the upstream default is used.',
  },
  '--astryx-color-background-inverted': {
    zh: 'Neutral 没有覆盖，使用原版默认值。',
    en: 'Neutral does not override this token, so the upstream default is used.',
  },
  '--astryx-color-background-error-inverted': {
    zh: 'Neutral 没有覆盖，使用原版默认值。',
    en: 'Neutral does not override this token, so the upstream default is used.',
  },
  '--astryx-color-background-gray': {
    zh: '深色直接引用 color-neutral，也就是半透明白。',
    en: 'The dark stop references color-neutral, a translucent white.',
  },
  '--astryx-radius-none': {
    zh: '保持 0。原版 Neutral 写成 0.25rem。方形头像和圆角为 none 的骨架屏用它表示直角。',
    en: 'Stays 0. Upstream Neutral uses 0.25rem. Square avatars and skeletons with radius none use this token for a square corner.',
  },
  '--astryx-radius-chat': {
    zh: 'Neutral 没有单独覆盖。28px 在 16px 根字号下等于页面圆角 1.75rem。',
    en: 'Neutral does not override this token. 28px equals the 1.75rem page radius at a 16px root.',
  },
  '--astryx-font-weight-regular': {
    zh: '组件已经在用这个名字。它指向 font-weight-normal，也就是 400。原版变量名是 normal。',
    en: 'Components already use this name. It points at font-weight-normal, which is 400. Upstream calls that token normal.',
  },
  '--astryx-font-family-code': {
    zh: '以 JetBrains Mono 开头，后面是 ui-monospace、SFMono-Regular、Menlo、Consolas、monospace。Neutral 主题入口会加载 400、500、600、700 和 400 斜体。',
    en: 'Starts with JetBrains Mono, then ui-monospace, SFMono-Regular, Menlo, Consolas, and monospace. The Neutral theme entry loads 400, 500, 600, 700, and 400 italic.',
  },
}

const sectionOrder: TokenSectionId[] = ['color', 'spacing', 'size', 'border', 'focus', 'radius', 'shadow', 'duration', 'ease', 'font', 'type']

const sections = computed(() => sectionOrder.map((id) => {
  const items = properties.filter(property => sectionId(property.name) === id)
  return {
    id,
    ...sectionCopy[id],
    items,
  }
}))

const colorGroups = computed(() => {
  const colors = properties.filter(property => sectionId(property.name) === 'color')
  return bucketOrder.flatMap((bucket) => {
    const items = colors.filter(property => colorBucket(property.name) === bucket)
    if (items.length === 0)
      return []
    return [{ bucket, title: bucketCopy[bucket], items }]
  })
})

const motionNames = [
  'astryx-fade-in',
  'astryx-fade-out',
  'astryx-scale-in',
  'astryx-scale-out',
  'astryx-slide-in-above',
  'astryx-slide-out-above',
  'astryx-slide-in-below',
  'astryx-slide-out-below',
  'astryx-slide-in-start',
  'astryx-slide-out-start',
  'astryx-slide-in-end',
  'astryx-slide-out-end',
]

const motionSamples = [
  { className: 'astryx-motion-fade-in', label: 'fade' },
  { className: 'astryx-motion-scale-in', label: 'scale' },
  { className: 'astryx-motion-slide-in-above', label: 'above' },
  { className: 'astryx-motion-slide-in-below', label: 'below' },
  { className: 'astryx-motion-slide-in-start', label: 'start' },
  { className: 'astryx-motion-slide-in-end', label: 'end' },
]

const playId = ref(0)

function text(value: { zh: string, en: string }) {
  return value[props.locale]
}

function noteText(name: string) {
  const note = notes[name]
  return note ? note[props.locale] : ''
}

function swatch(value: string) {
  const stops = splitLightDark(value)
  if (!stops) {
    const resolved = resolveStop(value, byName, 'light')
    return { light: resolved, dark: resolveStop(value, byName, 'dark') }
  }
  return {
    light: resolveStop(stops.light, byName, 'light'),
    dark: resolveStop(stops.dark, byName, 'dark'),
  }
}

function replay() {
  playId.value += 1
}
</script>

<template>
  <div class="token-reference">
    <section v-for="section in sections" :key="section.id" class="token-section">
      <h2>{{ text(section.title) }}</h2>
      <p>{{ text(section.description) }}</p>

      <div v-if="section.id === 'color'" class="color-groups">
        <div v-for="group in colorGroups" :key="group.bucket">
          <h3>{{ text(group.title) }}</h3>
          <div class="swatch-grid">
            <article v-for="property in group.items" :key="property.name" class="swatch-card">
              <div class="swatch-pair">
                <span class="chip-frame">
                  <span class="chip" :style="{ background: swatch(property.value).light }" />
                </span>
                <span class="chip-frame">
                  <span class="chip" :style="{ background: swatch(property.value).dark }" />
                </span>
                <span class="scheme">{{ text(copy.light) }}</span>
                <span class="scheme">{{ text(copy.dark) }}</span>
              </div>
              <code>{{ property.name }}</code>
              <p class="token-value">
                {{ property.value }}
              </p>
              <p v-if="noteText(property.name)" class="token-note">
                {{ noteText(property.name) }}
              </p>
            </article>
          </div>
        </div>
      </div>

      <div v-else class="token-list">
        <article v-for="property in section.items" :key="property.name" class="token-row">
          <code>{{ property.name }}</code>
          <p class="token-value">
            {{ property.value }}
          </p>
          <span
            v-if="section.id === 'spacing'"
            class="spacing-track"
            aria-hidden="true"
          >
            <span class="spacing-bar" :style="{ width: property.value }" />
          </span>
          <span
            v-else-if="section.id === 'radius'"
            class="radius-box"
            :style="{ borderRadius: property.value }"
            aria-hidden="true"
          />
          <span
            v-else-if="section.id === 'shadow'"
            class="shadow-box"
            :style="{ boxShadow: property.value }"
            aria-hidden="true"
          />
          <p v-if="noteText(property.name)" class="token-note">
            {{ noteText(property.name) }}
          </p>
        </article>
      </div>
    </section>

    <section class="token-section">
      <h2>{{ props.locale === 'zh' ? '动画' : 'Motion' }}</h2>
      <p>{{ text(copy.motionLead) }}</p>
      <div class="motion-toolbar">
        <button type="button" class="replay" @click="replay">
          {{ text(copy.replay) }}
        </button>
      </div>
      <div :key="playId" class="motion-stage">
        <span
          v-for="sample in motionSamples"
          :key="sample.className"
          :class="sample.className"
          class="motion-chip"
        >
          {{ sample.label }}
        </span>
      </div>
      <ul class="motion-names">
        <li v-for="name in motionNames" :key="name">
          <code>{{ name }}</code>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.token-reference {
  display: grid;
  gap: 28px;
}

.token-section h2 {
  margin: 0 0 8px;
}

.token-section h3 {
  margin: 18px 0 10px;
  font-size: 16px;
}

.token-section p {
  margin: 0;
}

.swatch-grid,
.token-list,
.motion-stage,
.motion-names {
  margin-top: 14px;
}

.swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  gap: 12px;
}

.swatch-card,
.token-row {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  padding: 12px;
}

.swatch-pair {
  display: grid;
  grid-template-columns: 36px 36px;
  gap: 8px 10px;
  align-items: center;
  margin-bottom: 10px;
}

.chip-frame {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #d4d4d4 25%, transparent 25%),
    linear-gradient(-45deg, #d4d4d4 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d4d4d4 75%),
    linear-gradient(-45deg, transparent 75%, #d4d4d4 75%);
  background-position: 0 0, 0 6px, 6px -6px, -6px 0;
  background-size: 12px 12px;
}

.chip {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid rgb(0 0 0 / 16%);
  border-radius: inherit;
}

.scheme {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.swatch-card code,
.token-row code,
.motion-names code {
  display: block;
  overflow-wrap: break-word;
  color: var(--vp-c-text-1);
  font-size: 12px;
}

.token-value {
  margin-top: 6px;
  overflow-wrap: break-word;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.5;
}

.token-note {
  margin-top: 8px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.5;
}

.token-list {
  display: grid;
  gap: 10px;
}

.token-row {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.4fr) auto;
  gap: 8px 16px;
  align-items: center;
}

.token-row .token-note {
  grid-column: 1 / -1;
}

.spacing-track {
  display: flex;
  align-items: center;
  width: 72px;
  height: 16px;
}

.spacing-bar {
  display: block;
  height: 8px;
  max-width: 72px;
  border-radius: 999px;
  background: var(--astryx-color-accent);
}

.radius-box,
.shadow-box,
.motion-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 36px;
  background: var(--vp-c-bg);
}

.radius-box {
  border: 1px solid var(--astryx-color-accent);
}

.shadow-box {
  background: var(--astryx-color-background-surface, #fff);
}

.motion-toolbar {
  margin-top: 12px;
}

.replay {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font: inherit;
  padding: 6px 12px;
}

.motion-stage {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.motion-chip {
  width: auto;
  min-width: 72px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--astryx-color-accent);
  color: var(--astryx-color-on-accent);
  font-size: 13px;
}

.motion-names {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: 8px 16px;
  padding: 0;
  list-style: none;
}

@media (max-width: 720px) {
  .token-row {
    grid-template-columns: 1fr;
  }
}
</style>
