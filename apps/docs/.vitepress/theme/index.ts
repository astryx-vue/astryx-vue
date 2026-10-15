import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { defineAsyncComponent } from 'vue'
import ComponentAccessibility from '../../components/demo-infra/ComponentAccessibility.vue'
import ComponentAnatomy from '../../components/demo-infra/ComponentAnatomy.vue'
import ComponentsOverview from '../../components/demo-infra/ComponentsOverview.vue'
import DemoExample from '../../components/demo-infra/DemoExample.vue'
import TemplateIndex from '../../components/demo-infra/TemplateIndex.vue'
import TokenReference from '../../components/theme-tokens/TokenReference.vue'
import ThemeGallery from '../../components/themes/ThemeGallery.vue'
import ThemeStage from '../../components/themes/ThemeStage.vue'
import ComponentDocsPage from './ComponentDocsPage.vue'
import 'virtual:uno.css'
import '../../styles/global.css'
import '../../styles/playground.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('component-docs', ComponentDocsPage)
    app.component('ComponentAccessibility', ComponentAccessibility)
    app.component('ComponentAnatomy', ComponentAnatomy)
    app.component('DemoExample', DemoExample)
    app.component('TemplateIndex', TemplateIndex)
    app.component('ComponentsOverview', ComponentsOverview)
    app.component('TokenReference', TokenReference)
    app.component('ThemeGallery', ThemeGallery)
    app.component('ThemeStage', ThemeStage)
    app.component('PlaygroundApp', defineAsyncComponent(() => import('../../components/playground/PlaygroundApp.vue')))
    app.component('PlaygroundFrame', defineAsyncComponent(() => import('../../components/playground/PlaygroundFrame.vue')))
  },
} satisfies Theme
