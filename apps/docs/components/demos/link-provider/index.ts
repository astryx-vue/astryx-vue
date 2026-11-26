import { defineDemo } from '../../demo-infra/defineDemo'
import hookArticleCardDemo from './hook-article-card.vue'
import hookArticleCardSource from './hook-article-card.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'link-provider-preview' }

export const linkProviderOverview = defineDemo(overviewDemo, overviewSource, options)
export const linkProviderHookArticleCard = defineDemo(hookArticleCardDemo, hookArticleCardSource)
