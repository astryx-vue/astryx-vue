import vue from '@shikijs/langs/vue'

type VueRule = NonNullable<(typeof vue)[number]['patterns']>[number]

function isGenericTag(rule: VueRule): boolean {
  return String(rule.begin) === '([-0-:A-Za-z]+)' && String(rule.end) === '(</)(\\1)\\s*(?=>)'
}

function replaceRule(rules: VueRule[], index: number, replacement: VueRule): VueRule[] {
  return [...rules.slice(0, index), replacement, ...rules.slice(index + 1)]
}

const grammar = vue.find(registration => registration.name === 'vue')
if (!grammar)
  throw new Error('Vue grammar registration is missing')

const patterns = grammar.patterns ?? []
const containerIndex = patterns.findIndex(rule => String(rule.begin) === '(<)' && String(rule.end) === '(>)'
  && rule.patterns?.some(isGenericTag))
if (containerIndex < 0)
  throw new Error('Vue generic tag fallback changed; review the syntax fix')

const container = patterns[containerIndex]
const containerPatterns = container.patterns ?? []
const genericIndex = containerPatterns.findIndex(isGenericTag)
const generic = containerPatterns[genericIndex]
const genericPatterns = generic.patterns ?? []
const contentIndex = genericPatterns.findIndex(rule => String(rule.begin) === '(?<=>)' && String(rule.end) === '(?=</)' && rule.name === 'text')
if (contentIndex < 0)
  throw new Error('Vue generic tag content rule changed; review the syntax fix')

/**
 * Shiki 4.5 的 Vue 通用标签规则把组件内容标成 `text`，不再分析其中的模板。
 * 只修改这个内容分支，让它继续使用 Vue 自带的 `#html-stuff`；标签自己的
 * 颜色，以及前面的 script/style/lang 分支都保持原样。
 */
export const vueLanguage: typeof vue = vue.map(registration => registration.name === 'vue'
  ? {
      ...registration,
      patterns: replaceRule(patterns, containerIndex, {
        ...container,
        patterns: replaceRule(containerPatterns, genericIndex, {
          ...generic,
          patterns: replaceRule(genericPatterns, contentIndex, {
            ...genericPatterns[contentIndex],
            name: 'text.html.derivative',
            patterns: [{ include: '#html-stuff' }],
          }),
        }),
      }),
    }
  : registration)
