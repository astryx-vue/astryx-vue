import { astryxLocaleKey } from '@astryx-vue/core/locale'
import { defineRuntimePlugin } from 'kawapress'
import { useRoute } from 'kawapress/client'
import { computed, defineAsyncComponent } from 'vue'
import ComponentAccessibility from './components/demo-infra/ComponentAccessibility.vue'
import ComponentAnatomy from './components/demo-infra/ComponentAnatomy.vue'
import ComponentsOverview from './components/demo-infra/ComponentsOverview.vue'
import DemoExample from './components/demo-infra/DemoExample.vue'
import TemplateIndex from './components/demo-infra/TemplateIndex.vue'
import TokenReference from './components/theme-tokens/TokenReference.vue'
import ThemeGallery from './components/themes/ThemeGallery.vue'
import ThemeStage from './components/themes/ThemeStage.vue'
import ComponentDocsLayout from './site/theme/ComponentDocsPage.vue'
import 'virtual:uno.css'
import './styles/global.css'
import './styles/playground.css'

export default defineRuntimePlugin({
  name: '@astryx-vue/docs',
  setup(api) {
    api.vueApp(async (app) => {
      // 文档页用 lucide 线框图标，与上游文档一致。注册表是全局的，服务端和客户端
      // 都要在渲染前注册同一份，两边才能画出同样的图标。演练场的预览框只在客户端
      // 渲染，保留 core 内置的图标。
      if (typeof window === 'undefined' || !/\/playground\/frame(?:\.html)?\/?$/.test(window.location.pathname))
        await import('./components/docsIcons')
      // Every demo reads its locale from the route, as the VitePress layout provided it.
      const route = app.runWithContext(useRoute)
      app.provide(astryxLocaleKey, computed(() => /^\/en(?:\/|$)/.test(route.value.path) ? 'en' : 'zh-CN'))
      app.component('component-docs', ComponentDocsLayout)
      app.component('ComponentAccessibility', ComponentAccessibility)
      app.component('ComponentAnatomy', ComponentAnatomy)
      app.component('DemoExample', DemoExample)
      app.component('TemplateIndex', TemplateIndex)
      app.component('ComponentsOverview', ComponentsOverview)
      app.component('TokenReference', TokenReference)
      app.component('ThemeGallery', ThemeGallery)
      app.component('ThemeStage', ThemeStage)
      app.component('PlaygroundApp', defineAsyncComponent(() => import('./components/playground/PlaygroundApp.vue')))
      app.component('PlaygroundFrame', defineAsyncComponent(() => import('./components/playground/PlaygroundFrame.vue')))
    })
  },
})
