import { defineComponent, h } from 'vue'

/**
 * Injects a theme's compiled sheet. A template `<style>` is ignored by Vue.
 *
 * The sheet goes in as raw text: server rendering would otherwise
 * HTML-escape the quotes in `[data-astryx-theme="..."]` and `>` in
 * selectors, and break them. `compileThemeCss` never writes `</style`, so
 * the text cannot close the element early.
 */
export const ThemeStyle = defineComponent({
  name: 'AstryxThemeStyle',
  props: {
    css: { type: String, required: true },
  },
  setup(props) {
    return () => h('style', { 'data-astryx-theme-style': '', 'innerHTML': props.css })
  },
})
