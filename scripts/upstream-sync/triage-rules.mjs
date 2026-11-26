// 初筛规则：上游文件路径命中这些规则，说明它只服务上游自己（React 实现之外的工程设施、
// 内部规范、我们不移植的包），对 Vue 版没有要移植的行为。
// 一个提交在某个组件族里涉及的文件全部命中时，这个族下的条目自动判为「不适用」。

export const TRIAGE_RULES = [
  { pattern: /^docs\/(?:specs|architecture|families|decisions|adr|plans|rfcs)\//, reason: '上游内部规范和架构文档' },
  { pattern: /^internal\//, reason: '上游内部工具包' },
  { pattern: /^apps\/(?:storybook|sandbox)\//, reason: '上游 Storybook 和沙盒' },
  { pattern: /^\.github\//, reason: '上游 CI' },
  { pattern: /^\.changeset\//, reason: '上游 changeset' },
  { pattern: /^scripts\//, reason: '上游仓库脚本' },
  { pattern: /(?:^|\/)api-report\.md$/, reason: '上游 API 报告' },
  { pattern: /(?:^|\/)(?:package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$/, reason: '上游锁文件' },
  { pattern: /(?:^|\/)CHANGELOG\.md$/, reason: '上游更新日志' },
  { pattern: /\.(?:test|spec)\.(?:tsx?|mjs|js)$|\/__tests__\/|\/__fixtures__\/|\/test-utils\/|^packages\/[^/]+\/test\//, reason: '只改上游测试' },
  { pattern: /\.stories\.tsx?$/, reason: '上游 Storybook 故事' },
  { pattern: /\.spec\.md$/, reason: '上游组件规范文档' },
  { pattern: /^packages\/build\//, reason: 'build 包只服务 StyleX，不移植（ADR 0001）' },
  { pattern: /^packages\/vega\//, reason: 'vega 包暂不移植（ADR 0001）' },
  { pattern: /(?:^|\/)(?:\.?eslint[^/]*|\.?prettier[^/]*|tsconfig[^/]*\.json|AGENTS\.md|CLAUDE\.md)$/, reason: '上游工程配置' },
]

/** 文件命中的初筛理由；不命中返回 null。 */
export function triageReason(file) {
  return TRIAGE_RULES.find(rule => rule.pattern.test(file))?.reason ?? null
}

/** 一组文件全部命中时返回去重后的理由列表，否则返回 null。空列表也返回 null。 */
export function triageFiles(files) {
  if (files.length === 0)
    return null
  const reasons = files.map(triageReason)
  return reasons.every(Boolean) ? [...new Set(reasons)] : null
}
