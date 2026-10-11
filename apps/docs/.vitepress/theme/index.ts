import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ComponentsOverview from '../../components/demo-infra/ComponentsOverview.vue'
import DemoExample from '../../components/demo-infra/DemoExample.vue'
import TokenReference from '../../components/theme-tokens/TokenReference.vue'
import ComponentDocsPage from './ComponentDocsPage.vue'
import 'virtual:uno.css'
import '../../styles/global.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('component-docs', ComponentDocsPage)
    app.component('DemoExample', DemoExample)
    app.component('ComponentsOverview', ComponentsOverview)
    app.component('TokenReference', TokenReference)
  },
} satisfies Theme
