<script setup lang="ts">
import type { NavLinkComponent } from '../NavItem/types.js'
import { resolveNavRoot } from '../NavItem/link.js'

defineOptions({ name: 'AstryxNavHeadingText' })

const props = defineProps<{
  block: string
  heading?: string
  superheading?: string
  subheading?: string
  headingHref?: string
  superheadingHref?: string
  subheadingHref?: string
  as?: NavLinkComponent
  /** 每一行自己是链接。整段标题已经是链接时不要打开。 */
  independent?: boolean
}>()

defineSlots<{
  chevron?: () => unknown
}>()

function root(href: string | undefined): string | object {
  return props.independent && href ? resolveNavRoot(href, false, props.as) : 'span'
}

function hrefOf(href: string | undefined): string | undefined {
  return props.independent ? href : undefined
}

function toOf(href: string | undefined): string | undefined {
  return props.independent && props.as != null ? href : undefined
}

function stopIfLink(event: MouseEvent, href: string | undefined): void {
  if (props.independent && href)
    event.stopPropagation()
}
</script>

<template>
  <span :class="`${block}__text`">
    <component
      :is="root(superheadingHref)"
      v-if="superheading"
      :class="[`${block}__super`, { [`${block}__link`]: independent && superheadingHref }]"
      :href="hrefOf(superheadingHref)"
      :to="toOf(superheadingHref)"
      @click="stopIfLink($event, superheadingHref)"
    >
      {{ superheading }}
    </component>
    <span :class="`${block}__row`">
      <component
        :is="root(headingHref)"
        v-if="heading"
        :class="[`${block}__title`, { [`${block}__link`]: independent && headingHref }]"
        :href="hrefOf(headingHref)"
        :to="toOf(headingHref)"
        @click="stopIfLink($event, headingHref)"
      >
        {{ heading }}
      </component>
      <slot name="chevron" />
    </span>
    <component
      :is="root(subheadingHref)"
      v-if="subheading"
      :class="[`${block}__sub`, { [`${block}__link`]: independent && subheadingHref }]"
      :href="hrefOf(subheadingHref)"
      :to="toOf(subheadingHref)"
      @click="stopIfLink($event, subheadingHref)"
    >
      {{ subheading }}
    </component>
  </span>
</template>
