import { defineDemo } from '../../demo-infra/defineDemo'
import keywordColorDemo from './keyword-color.vue'
import keywordColorSource from './keyword-color.vue?raw&highlighted'

export const useSyntaxThemeKeywordColor = defineDemo(keywordColorDemo, keywordColorSource)
