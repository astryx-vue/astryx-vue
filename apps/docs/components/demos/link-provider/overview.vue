<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
import { LinkProvider } from '@astryx-vue/core/LinkProvider'
import { defineComponent, h, ref } from 'vue'

const intercepted = ref<string | null>(null)

/**
 * A stand-in for a framework router link (Vue Router's `RouterLink`, Nuxt's
 * `NuxtLink`). Instead of a full-page navigation it intercepts the click and
 * hands the destination to its own handler — the same hook real routers use.
 * Here it only reports the destination so the swap is observable.
 */
const RouterLink = defineComponent({
  name: 'RouterLink',
  inheritAttrs: false,
  props: {
    href: { type: String, default: undefined },
    to: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    return () => h('a', {
      ...attrs,
      href: props.href ?? props.to,
      onClick: (event: MouseEvent) => {
        event.preventDefault()
        ;(attrs.onClick as ((event: MouseEvent) => void) | undefined)?.(event)
        intercepted.value = props.to ?? props.href ?? ''
      },
    }, slots.default?.())
  },
})
</script>

<template>
  <div class="link-provider-preview">
    <LinkProvider :component="RouterLink">
      <Link href="/dashboard" is-standalone>
        Go to dashboard
      </Link>
    </LinkProvider>
    <p class="link-provider-preview__status">
      {{ intercepted ? `RouterLink intercepted navigation to: ${intercepted}` : 'Click the link to try the custom component.' }}
    </p>
  </div>
</template>
