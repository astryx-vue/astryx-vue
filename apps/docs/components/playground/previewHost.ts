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
    // 预览内容固定用英文 locale：原版演练场只提供英文，组件内文案（日期、相对时间、
    // 无障碍标签）要和原版一致；界面编译报错仍看 PlaygroundFrame 传进来的 locale。
    provideAstryxLocale(() => 'en')
    return () => h('div', { class: 'playground-preview__content' }, [h(props.preview)])
  },
})
