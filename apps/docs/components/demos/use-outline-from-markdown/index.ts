import { defineDemo } from '../../demo-infra/defineDemo'
import docsArticleDemo from './docs-article.vue'
import docsArticleSource from './docs-article.vue?raw&highlighted'

export const useOutlineFromMarkdownDocsArticle = defineDemo(docsArticleDemo, docsArticleSource)
