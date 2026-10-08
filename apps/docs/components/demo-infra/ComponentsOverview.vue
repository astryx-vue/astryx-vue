<script setup lang="ts">
import type { DocsLocale } from './docs-i18n'
import { computed } from 'vue'
import { avatarSizes } from '../demos/avatar'
import { avatarGroupBasic } from '../demos/avatar-group'
import { badgeColors } from '../demos/badge'
import { bannerStatuses } from '../demos/banner'
import { blockquoteCite } from '../demos/blockquote'
import { breadcrumbsBasic } from '../demos/breadcrumbs'
import { buttonVariants } from '../demos/button'
import { buttonGroupBasic } from '../demos/button-group'
import { checkboxIndicatorOverview } from '../demos/checkbox-indicator'
import { checkboxInputBasic } from '../demos/checkbox-input'
import { dialogOverview } from '../demos/dialog'
import { dividerOverview } from '../demos/divider'
import { fieldCustom } from '../demos/field'
import { headingLevels } from '../demos/heading'
import { iconButtonActionBar } from '../demos/icon-button'
import { linkColors } from '../demos/link'
import { popoverOverview } from '../demos/popover'
import { progressBarBasic } from '../demos/progress-bar'
import { radioBasic } from '../demos/radio'
import { skeletonProfile } from '../demos/skeleton'
import { sliderBasic } from '../demos/slider'
import { spinnerBasic } from '../demos/spinner'
import { stackDirections } from '../demos/stack'
import { statusDotVariants } from '../demos/status-dot'
import { switchBasic } from '../demos/switch'
import { tabListBasic } from '../demos/tab-list'
import { textTypes } from '../demos/text'
import { textAreaBasic } from '../demos/text-area'
import { textInputBasic } from '../demos/text-input'
import { toastPreview } from '../demos/toast'
import { tooltipOverview } from '../demos/tooltip'
import { visuallyHiddenContext } from '../demos/visually-hidden'
import { componentDocsCopy } from './componentDocsRoute'
import { localePath } from './docs-i18n'
import VueDemoHost from './VueDemoHost.vue'

const props = defineProps<{ locale: DocsLocale }>()
const nav = computed(() => componentDocsCopy[props.locale])
const groups = computed(() => [
  { title: nav.value.action, cards: [
    { demo: buttonVariants, slug: 'button', name: nav.value.button },
    { demo: buttonGroupBasic, slug: 'button-group', name: nav.value.buttonGroup },
    { demo: iconButtonActionBar, slug: 'icon-button', name: nav.value.iconButton },
  ] },
  { title: nav.value.form, cards: [
    { demo: textInputBasic, slug: 'text-input', name: nav.value.textInput },
    { demo: textAreaBasic, slug: 'text-area', name: nav.value.textArea },
    { demo: checkboxInputBasic, slug: 'checkbox-input', name: nav.value.checkboxInput },
    { demo: checkboxIndicatorOverview, slug: 'checkbox-indicator', name: nav.value.checkboxIndicator },
    { demo: progressBarBasic, slug: 'progress-bar', name: nav.value.progressBar },
    { demo: radioBasic, slug: 'radio', name: nav.value.radio },
    { demo: switchBasic, slug: 'switch', name: nav.value.switch },
    { demo: sliderBasic, slug: 'slider', name: nav.value.slider },
    { demo: fieldCustom, slug: 'field', name: nav.value.field },
  ] },
  { title: nav.value.layout, cards: [
    { demo: stackDirections, slug: 'stack', name: nav.value.stack },
    { demo: dividerOverview, slug: 'divider', name: nav.value.divider },
  ] },
  { title: nav.value.content, cards: [
    { demo: avatarSizes, slug: 'avatar', name: nav.value.avatar },
    { demo: avatarGroupBasic, slug: 'avatar-group', name: nav.value.avatarGroup },
    { demo: blockquoteCite, slug: 'blockquote', name: nav.value.blockquote },
    { demo: headingLevels, slug: 'heading', name: nav.value.heading },
    { demo: textTypes, slug: 'text', name: nav.value.text },
  ] },
  { title: nav.value.navigation, cards: [
    { demo: linkColors, slug: 'link', name: nav.value.link },
    { demo: breadcrumbsBasic, slug: 'breadcrumbs', name: nav.value.breadcrumbs },
    { demo: tabListBasic, slug: 'tab-list', name: nav.value.tabList },
  ] },
  { title: nav.value.feedback, cards: [
    { demo: bannerStatuses, slug: 'banner', name: nav.value.banner },
    { demo: badgeColors, slug: 'badge', name: nav.value.badge },
    { demo: skeletonProfile, slug: 'skeleton', name: nav.value.skeleton },
    { demo: spinnerBasic, slug: 'spinner', name: nav.value.spinner },
    { demo: statusDotVariants, slug: 'status-dot', name: nav.value.statusDot },
  ] },
  { title: nav.value.overlays, cards: [
    { demo: tooltipOverview, slug: 'tooltip', name: nav.value.tooltip },
    { demo: popoverOverview, slug: 'popover', name: nav.value.popover },
    { demo: dialogOverview, slug: 'dialog', name: nav.value.dialog },
    { demo: toastPreview, slug: 'toast', name: nav.value.toast },
  ] },
  { title: nav.value.utilities, cards: [{ demo: visuallyHiddenContext, slug: 'visually-hidden', name: nav.value.visuallyHidden }] },
])
</script>

<template>
  <div class="component-overview__content">
    <header class="component-overview__header">
      <h1>{{ locale === 'en' ? 'Browse components' : '浏览组件库' }}</h1>
      <p>{{ locale === 'en' ? 'Find astryx-vue components by purpose and explore their states and variants.' : '按用途查找 astryx-vue 组件，并查看各个状态与变体。' }}</p>
    </header>
    <section v-for="(group, index) in groups" :key="group.title" class="component-overview__catalog" :aria-labelledby="`${locale}-group-${index}`">
      <h2 :id="`${locale}-group-${index}`">
        {{ group.title }}
      </h2>
      <div class="component-overview__grid">
        <article v-for="card in group.cards" :key="card.slug" class="component-card">
          <div aria-hidden="true" class="component-card__preview" inert>
            <VueDemoHost :class-name="card.demo.className" :component="card.demo.component" :data-kind="card.demo.dataKind" />
          </div>
          <a class="component-card__name" :href="localePath(locale, `/components/${card.slug}`)">{{ card.name }}</a>
        </article>
      </div>
    </section>
  </div>
</template>
