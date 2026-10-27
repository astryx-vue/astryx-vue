<script setup lang="ts">
import type { TokenSectionId } from './parseTokens'
import type { LocalizedText } from './tokenReferenceCopy'
import { computed, ref } from 'vue'
import { REFERENCE_COPY, TOKEN_NOTES } from './tokenReferenceCopy'
import { colorGroups, MOTION_NAMES, MOTION_SAMPLES, swatch, tokenSections } from './tokenReferenceModel'

const props = withDefaults(defineProps<{
  locale: 'zh' | 'en'
  /** Limit the reference to these sections. Omit to show every section. */
  sections?: TokenSectionId[]
  /** Show the shared motion samples. Defaults to on only for the full reference. */
  motion?: boolean
  /** Render each section title and description. */
  headings?: boolean
}>(), {
  headings: true,
})

const sections = computed(() => tokenSections(props.sections))
const showMotion = computed(() => props.motion ?? props.sections == null)
const groups = colorGroups()

const playId = ref(0)

function text(value: LocalizedText) {
  return value[props.locale]
}

function noteText(name: string) {
  const note = TOKEN_NOTES[name]
  return note ? note[props.locale] : ''
}

function replay() {
  playId.value += 1
}
</script>

<template>
  <div class="token-reference">
    <section v-for="section in sections" :key="section.id" class="token-section">
      <h2 v-if="headings">
        {{ text(section.title) }}
      </h2>
      <p v-if="headings">
        {{ text(section.description) }}
      </p>

      <div v-if="section.id === 'color'" class="color-groups">
        <div v-for="group in groups" :key="group.bucket">
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
                <span class="scheme">{{ text(REFERENCE_COPY.light) }}</span>
                <span class="scheme">{{ text(REFERENCE_COPY.dark) }}</span>
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

    <section v-if="showMotion" class="token-section">
      <h2 v-if="headings">
        {{ text(REFERENCE_COPY.motionTitle) }}
      </h2>
      <p v-if="headings">
        {{ text(REFERENCE_COPY.motionLead) }}
      </p>
      <div class="motion-toolbar">
        <button type="button" class="replay" @click="replay">
          {{ text(REFERENCE_COPY.replay) }}
        </button>
      </div>
      <div :key="playId" class="motion-stage">
        <span
          v-for="sample in MOTION_SAMPLES"
          :key="sample.className"
          :class="sample.className"
          class="motion-chip"
        >
          {{ sample.label }}
        </span>
      </div>
      <ul class="motion-names">
        <li v-for="name in MOTION_NAMES" :key="name">
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
