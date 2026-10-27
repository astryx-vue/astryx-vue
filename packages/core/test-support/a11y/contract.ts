/**
 * 交互契约的词汇表：规范出处、期望、模式契约，以及构造契约时的把关函数 `definePattern`。
 *
 * 思路来自上游 `internal/a11y-spec/src/contract.ts` 和 `docs/specs/AST-020/spec.md`：
 * - 每条期望有稳定 id、一句用户能感受到的结果、确切的规范出处、适用条件、证据层和执行级别；
 * - `required` 只能来自 WCAG 2.2 A/AA 条款或 Astryx 自己的记录，APG 单独作为出处时只能是 `advisory`；
 * - 清单里的每个维度要么被某条期望编码，要么写明豁免和负责方。
 * 少了任何一项，`definePattern` 直接抛错，而不是悄悄放过。
 */
import type { ChecklistDimensionId, ChecklistExemption } from './checklist'
import type { EvidenceLayer, Harness, Subject } from './harness'
import { CHECKLIST_DIMENSIONS } from './checklist'
import { EVIDENCE_LAYERS } from './harness'

/** 失败时怎么处理：required 会让测试失败，advisory 只报告。 */
export type Enforcement = 'required' | 'advisory'

export interface WcagCriterion {
  readonly standard: 'wcag'
  readonly id: string
  readonly name: string
  readonly level: 'A' | 'AA' | 'AAA'
  readonly url: string
}

export interface ApgRequirement {
  readonly standard: 'apg'
  readonly pattern: string
  /** 原文引用，能在页面上找到。 */
  readonly requirement: string
  readonly url: string
}

/** Astryx 自己的规范记录。链接必须钉在某个提交上，引用的话不会跟着 main 变。 */
export interface AstryxRecord {
  readonly standard: 'astryx'
  readonly id: string
  readonly clause: string
  readonly requirement: string
  readonly url: string
}

export type NormativeSource = WcagCriterion | ApgRequirement | AstryxRecord

export function citeSource(source: NormativeSource): string {
  switch (source.standard) {
    case 'wcag':
      return `WCAG 2.2 ${source.id} ${source.name} (${source.level})`
    case 'apg':
      return `APG ${source.pattern}: ${source.requirement}`
    case 'astryx':
      return `Astryx ${source.id} ${source.clause}: ${source.requirement}`
  }
}

/** 期望在哪些状态下适用。文字给人看，函数给运行器用。 */
export interface Applicability<Facts> {
  readonly condition: string
  readonly test: (facts: Facts) => boolean
}

/** 期望跑起来才发现这个状态没东西可查时抛出。运行器把它记成 not-applicable，不记成通过。 */
export class NotApplicableHere extends Error {
  constructor(reason: string) {
    super(reason)
    this.name = 'NotApplicableHere'
  }
}

export interface ExpectationContext<Facts> {
  readonly harness: Harness
  readonly subject: Subject
  /** 绑定声明这个状态「应该是」什么样。 */
  readonly facts: Facts
  readonly notApplicable: (reason: string) => never
  /**
   * 挂载以来控件的动作执行了几次。按钮按下去，按钮本身不留痕迹，只有绑定知道处理函数
   * 被调了几次，所以由绑定提供。绑定没提供却被读到时会大声报错，而不是悄悄通过。
   */
  readonly activations: () => Promise<number>
}

export interface Expectation<Facts> {
  /** 稳定 id，形如 `<模式>.<方面>.<结果>`。已知失败名单按它记录，所以不要随手改。 */
  readonly id: string
  /** 用户能感受到的结果，一句话。 */
  readonly outcome: string
  /** 规范出处，第一条是主出处，会出现在测试名和失败信息里。 */
  readonly sources: readonly [NormativeSource, ...NormativeSource[]]
  /** 主出处是 APG 时，必须说明它支撑的是哪条 WCAG 结果。 */
  readonly wcagOutcome?: string
  readonly covers: readonly ChecklistDimensionId[]
  readonly appliesWhen: Applicability<Facts>
  /** 这条期望的主张属于哪一层。 */
  readonly evidenceLayer: EvidenceLayer
  /** 期望内部还要读的其他层。例如「点击后变成开」是真浏览器的主张，但结果要从可访问性树里读。 */
  readonly alsoNeeds?: readonly EvidenceLayer[]
  readonly enforcement: Enforcement
  /** advisory 必须写明为什么不作为门槛。 */
  readonly advisoryBecause?: string
  /** 结果不存在时抛出一句人能看懂的话。 */
  readonly run: (context: ExpectationContext<Facts>) => Promise<void>
}

export interface PatternContract<Facts> {
  readonly pattern: string
  readonly url: string
  readonly scope: string
  readonly expectations: readonly Expectation<Facts>[]
  readonly exemptions: Readonly<Partial<Record<ChecklistDimensionId, ChecklistExemption>>>
}

export function requiredLayers<Facts>(expectation: Expectation<Facts>): readonly EvidenceLayer[] {
  return [expectation.evidenceLayer, ...(expectation.alsoNeeds ?? [])]
}

/** 测试名和失败信息的前缀，带上 id 和主出处。 */
export function describeExpectation<Facts>(expectation: Expectation<Facts>): string {
  return `${expectation.id} [${citeSource(expectation.sources[0])}] ${expectation.outcome}`
}

/** 既没被编码也没被豁免的维度。写完的契约应该返回空数组。 */
export function unansweredDimensions<Facts>(contract: PatternContract<Facts>): readonly ChecklistDimensionId[] {
  const covered = new Set(contract.expectations.flatMap(expectation => expectation.covers))
  return CHECKLIST_DIMENSIONS.map(dimension => dimension.id)
    .filter(id => !covered.has(id) && contract.exemptions[id] == null)
}

const ID_SHAPE = /^[a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+$/
const EMPTY_REASON = /^(?:n\/?a|not applicable|none|unknown|tbd|不适用|无)\.?$/i
const PINNED_PUBLIC_SOURCE = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/blob\/[0-9a-f]{40}\/\S+$/
const DIMENSION_IDS: readonly string[] = CHECKLIST_DIMENSIONS.map(dimension => dimension.id)

function expectationProblems<Facts>(contract: PatternContract<Facts>, expectation: Expectation<Facts>): string[] {
  const { id } = expectation
  const problems: string[] = []
  if (!ID_SHAPE.test(id))
    problems.push(`期望 id ${JSON.stringify(id)} 要写成「模式.方面.结果」`)
  if (!id.startsWith(`${contract.pattern}.`))
    problems.push(`${id} 不属于模式 ${contract.pattern}`)
  if (expectation.outcome.trim() === '')
    problems.push(`${id} 没写用户能感受到的结果`)
  if (expectation.appliesWhen.condition.trim() === '')
    problems.push(`${id} 没写适用条件`)
  for (const source of expectation.sources) {
    if (source.standard === 'astryx' && !PINNED_PUBLIC_SOURCE.test(source.url))
      problems.push(`${id} 引用的 Astryx 记录 ${source.id} 没有钉在公开仓库的某个提交上：${source.url}`)
  }
  const primary = expectation.sources[0]
  if (primary.standard === 'apg' && (expectation.wcagOutcome ?? '').trim() === '')
    problems.push(`${id} 的主出处是 APG，必须写明它支撑的 WCAG 2.2 结果`)
  if (expectation.covers.length === 0)
    problems.push(`${id} 没有点名任何清单维度`)
  for (const dimension of expectation.covers) {
    if (!DIMENSION_IDS.includes(dimension))
      problems.push(`${id} 点名了不存在的维度 ${dimension}`)
    const exemption = contract.exemptions[dimension]
    if (exemption != null && exemption.coversRemainderOnly !== true)
      problems.push(`维度 ${dimension} 同时被 ${id} 编码又被豁免；只编码一部分时豁免要写 coversRemainderOnly`)
  }
  for (const layer of requiredLayers(expectation)) {
    if (!EVIDENCE_LAYERS.includes(layer))
      problems.push(`${id} 用了不存在的证据层 ${layer}`)
  }
  if ((expectation.alsoNeeds ?? []).includes(expectation.evidenceLayer))
    problems.push(`${id} 在 alsoNeeds 里重复了自己的证据层`)
  const adopted = (primary.standard === 'wcag' && (primary.level === 'A' || primary.level === 'AA')) || primary.standard === 'astryx'
  if (expectation.enforcement === 'required' && !adopted)
    problems.push(`${id} 是 required，但主出处既不是 WCAG 2.2 A/AA 条款，也不是 Astryx 记录`)
  if (expectation.enforcement === 'advisory' && (expectation.advisoryBecause ?? '').trim() === '')
    problems.push(`${id} 是 advisory，但没写为什么不作为门槛`)
  return problems
}

function exemptionProblems<Facts>(contract: PatternContract<Facts>): string[] {
  const problems: string[] = []
  for (const [dimension, exemption] of Object.entries(contract.exemptions) as [ChecklistDimensionId, ChecklistExemption | undefined][]) {
    if (!DIMENSION_IDS.includes(dimension)) {
      problems.push(`豁免的 ${dimension} 不是清单维度`)
      continue
    }
    if (exemption == null)
      continue
    if (exemption.owner.trim() === '')
      problems.push(`维度 ${dimension} 被豁免，但没写负责方`)
    if (exemption.verifiedBy.trim() === '')
      problems.push(`维度 ${dimension} 被豁免，但没写验证方法`)
    if (EMPTY_REASON.test(exemption.reason.trim()))
      problems.push(`维度 ${dimension} 的豁免理由「${exemption.reason}」等于没写`)
    if (exemption.coversRemainderOnly === true && !contract.expectations.some(expectation => expectation.covers.includes(dimension)))
      problems.push(`维度 ${dimension} 声称只豁免剩余部分，但没有任何期望编码它`)
  }
  return problems
}

/** 构造一个模式契约。契约没法审计（缺出处、缺负责方、级别给错）时直接抛错。 */
export function definePattern<Facts>(contract: PatternContract<Facts>): PatternContract<Facts> {
  const problems: string[] = []
  const seen = new Set<string>()
  for (const expectation of contract.expectations) {
    if (seen.has(expectation.id))
      problems.push(`期望 id 重复：${expectation.id}`)
    seen.add(expectation.id)
    problems.push(...expectationProblems(contract, expectation))
  }
  problems.push(...exemptionProblems(contract))
  if (problems.length > 0)
    throw new Error(`模式 "${contract.pattern}" 没法审计：\n  - ${problems.join('\n  - ')}`)
  return contract
}
