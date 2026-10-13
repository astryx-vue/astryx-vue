import type { Component, PropType } from 'vue'
import { provideAstryxLocale } from '@astryx-vue/core'
import { defineComponent, h } from 'vue'

export const PreviewHost = defineComponent({
  name: 'PlaygroundPreviewHost',
  props: {
    preview: { type: Object as PropType<Component>, required: true },
    locale: { type: String, required: true },
  },
  setup(props) {
    provideAstryxLocale(() => props.locale)
    return () => h(props.preview)
  },
})
