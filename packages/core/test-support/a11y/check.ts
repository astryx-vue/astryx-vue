/**
 * 运行器：把一份模式契约套在一个组件绑定的一个状态上跑一遍，返回每条期望的结果。
 *
 * 规则来自上游 `internal/a11y-spec/src/check.ts` 和 `docs/specs/AST-021/spec.md`：
 * - 已知失败只覆盖它自己那条：同一条期望、同一个组件、同一个状态、同一个环境，失败信息一字不差。
 *   换一句失败信息、换一个状态，都还是失败。
 * - 已知失败开始通过时报 `unexpected-pass`，提醒把那条记录删掉，名单只会越来越短。
 * - 环境观察不到期望要读的层时报 `unrun`，不报通过，也不拿低一层冒充。
 *
 * 在上游基础上多了「近似」：环境用别的层近似某一层时，期望照常跑，结果带上 `approximatedBy`。
 */
import type { Enforcement, Expectation, PatternContract } from './contract'
import type { EvidenceLayer, Harness } from './harness'
import { describeExpectation, NotApplicableHere, requiredLayers } from './contract'

export type ResultStatus = 'pass' | 'fail' | 'known-failure' | 'unexpected-pass' | 'not-applicable' | 'unrun'

/** 一条已知失败。钉得足够死，不会顺手盖住别的失败。 */
export interface KnownFailure {
  readonly expectation: string
  readonly binding: string
  readonly state: string
  /** 跑出这个失败的环境，例如 `happy-dom`。 */
  readonly harness: string
  /** 失败信息原文。文字一变就算另一个失败。 */
  readonly failureEquals: string
  /** 用户实际会碰到什么。 */
  readonly userImpact: string
  /** 为什么现在记账而不修，以及由哪个节点来修。 */
  readonly reason: string
}

export interface ExpectationResult {
  readonly expectation: string
  readonly description: string
  readonly evidenceLayer: EvidenceLayer
  readonly enforcement: Enforcement
  readonly status: ResultStatus
  readonly detail?: string
  /** unrun 时：这次环境看不见的层。 */
  readonly missingLayers?: readonly EvidenceLayer[]
  /** 用近似层跑出来的结果：键是期望要读的层，值是实际观察的层。 */
  readonly approximatedBy?: Readonly<Partial<Record<EvidenceLayer, EvidenceLayer>>>
  readonly knownFailure?: KnownFailure
}

export interface BindingResult {
  readonly pattern: string
  readonly binding: string
  readonly state: string
  readonly harness: string
  readonly results: readonly ExpectationResult[]
}

export interface CheckOptions<Facts> {
  readonly spec: PatternContract<Facts>
  readonly binding: string
  readonly state: string
  readonly facts: Facts
  /** 重新挂载这个状态并返回指向它的环境。每条期望调用一次，互不影响。 */
  readonly mount: () => Promise<Harness>
  readonly unmount?: () => Promise<void> | void
  /** 挂载以来动作执行了几次。需要它的模式（button）读不到时会大声报错。 */
  readonly activations?: () => Promise<number> | number
  /** 只跑这些期望。契约自测用它逐条证明「去掉结果就会失败」。 */
  readonly only?: readonly string[]
  readonly knownFailures?: readonly KnownFailure[]
}

/** 绑定缺了契约要用的能力。这是绑定写错了，不是契约结果，所以直接抛出。 */
export class MissingBindingCapability extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MissingBindingCapability'
  }
}

type Reach = { kind: 'run', approximatedBy?: Partial<Record<EvidenceLayer, EvidenceLayer>> } | { kind: 'unrun', missing: EvidenceLayer[] }

/** 环境能不能跑这条期望；能跑时记下哪些层是近似的。 */
export function reachOf<Facts>(expectation: Expectation<Facts>, harness: Pick<Harness, 'observes' | 'approximates'>): Reach {
  const missing: EvidenceLayer[] = []
  const approximatedBy: Partial<Record<EvidenceLayer, EvidenceLayer>> = {}
  for (const layer of requiredLayers(expectation)) {
    if (harness.observes.includes(layer))
      continue
    const proxy = harness.approximates?.[layer]
    if (proxy != null && harness.observes.includes(proxy))
      approximatedBy[layer] = proxy
    else
      missing.push(layer)
  }
  if (missing.length > 0)
    return { kind: 'unrun', missing }
  return Object.keys(approximatedBy).length > 0 ? { kind: 'run', approximatedBy } : { kind: 'run' }
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function findKnownFailure(known: readonly KnownFailure[], expectation: string, binding: string, state: string, harness: string): KnownFailure | undefined {
  return known.find(record => record.expectation === expectation && record.binding === binding && record.state === state && record.harness === harness)
}

/** 每条已知失败必须恰好对上一条实际跑出的结果，否则就是改名或删状态后留下的孤儿记录。 */
export function unmatchedKnownFailures(knownFailures: readonly KnownFailure[], bindings: readonly BindingResult[]): readonly string[] {
  return knownFailures.flatMap((record) => {
    const matches = bindings.flatMap(binding => binding.results.filter(result => result.knownFailure === record)).length
    return matches === 1 ? [] : [`${record.binding} [${record.state}] ${record.expectation} @${record.harness} 对上了 ${matches} 条结果；每条已知失败必须恰好对上 1 条`]
  })
}

type Outcome = { kind: 'pass' } | { kind: 'fail', message: string } | { kind: 'not-applicable', reason: string }

async function runOne<Facts>(options: CheckOptions<Facts>, expectation: Expectation<Facts>, harness: Harness): Promise<Outcome> {
  const subject = await harness.subject()
  try {
    await expectation.run({
      harness,
      subject,
      facts: options.facts,
      notApplicable: (reason) => {
        throw new NotApplicableHere(reason)
      },
      activations: async () => {
        if (options.activations == null)
          throw new MissingBindingCapability(`${expectation.id} 要数动作执行了几次，但绑定 ${options.binding} 没有提供 activations`)
        return options.activations()
      },
    })
    return { kind: 'pass' }
  }
  catch (error) {
    if (error instanceof MissingBindingCapability)
      throw error
    if (error instanceof NotApplicableHere)
      return { kind: 'not-applicable', reason: error.message }
    return { kind: 'fail', message: messageOf(error) }
  }
}

function settle(base: Omit<ExpectationResult, 'status'>, outcome: Exclude<Outcome, { kind: 'not-applicable' }>, record: KnownFailure | undefined): ExpectationResult {
  if (outcome.kind === 'pass') {
    return record == null
      ? { ...base, status: 'pass' }
      : { ...base, status: 'unexpected-pass', knownFailure: record, detail: '记录的失败已经不再发生，请把这条已知失败删掉。' }
  }
  if (record != null && outcome.message === record.failureEquals)
    return { ...base, status: 'known-failure', knownFailure: record, detail: outcome.message }
  return {
    ...base,
    status: 'fail',
    knownFailure: record,
    detail: record == null
      ? outcome.message
      : `${outcome.message}\n\n这条期望在这个状态下有一条已知失败，但它记录的是另一句话（${JSON.stringify(record.failureEquals)}）。已知失败不会扩大去覆盖新的失败。`,
  }
}

export async function checkAccessibilitySpec<Facts>(options: CheckOptions<Facts>): Promise<BindingResult> {
  const { spec, binding, state, facts, mount, unmount } = options
  const knownFailures = options.knownFailures ?? []
  const results: ExpectationResult[] = []
  let harnessName = 'unmounted'

  for (const expectation of spec.expectations) {
    if (options.only != null && !options.only.includes(expectation.id))
      continue
    const base = {
      expectation: expectation.id,
      description: describeExpectation(expectation),
      evidenceLayer: expectation.evidenceLayer,
      enforcement: expectation.enforcement,
    } as const
    if (!expectation.appliesWhen.test(facts)) {
      results.push({ ...base, status: 'not-applicable', detail: `只在「${expectation.appliesWhen.condition}」时适用` })
      continue
    }

    // 挂载失败是环境或绑定的问题，不是契约结果，直接抛出，不让已知失败吸收掉。
    const harness = await mount()
    harnessName = harness.name
    let outcome: Outcome
    let reach: Reach
    try {
      reach = reachOf(expectation, harness)
      outcome = reach.kind === 'run' ? await runOne(options, expectation, harness) : { kind: 'pass' }
    }
    finally {
      await unmount?.()
    }
    if (reach.kind === 'unrun') {
      results.push({ ...base, status: 'unrun', missingLayers: reach.missing, detail: `${harness.name} 环境看不见 ${reach.missing.join('、')} 层` })
      continue
    }
    const withReach = reach.approximatedBy == null ? base : { ...base, approximatedBy: reach.approximatedBy }
    if (outcome.kind === 'not-applicable') {
      results.push({ ...withReach, status: 'not-applicable', detail: outcome.reason })
      continue
    }
    results.push(settle(withReach, outcome, findKnownFailure(knownFailures, expectation.id, binding, state, harness.name)))
  }

  return { pattern: spec.pattern, binding, state, harness: harnessName, results }
}
