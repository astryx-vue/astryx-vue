import { defineComponent, h } from 'vue'

/** Injects compiled component rules. A template `<style>` is ignored by Vue. */
export const ThemeStyle = defineComponent({
  name: 'AstryxThemeStyle',
  props: {
    css: { type: String, required: true },
  },
  setup(props) {
    return () => h('style', { 'data-astryx-theme-style': '' }, props.css)
  },
})
