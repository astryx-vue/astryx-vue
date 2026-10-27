/**
 * 报告和门槛。各种状态分开计数，不合成一个百分比：一条必选期望失败的模式，不是「大部分合格」。
 */
import type { BindingResult, ExpectationResult } from './check'

export interface ReportCounts {
  readonly pass: number
  readonly fail: number
  readonly knownFailure: number
  readonly unexpectedPass: number
  readonly notApplicable: number
  readonly unrun: number
  /** 其中用近似层跑出来的结果（pass、fail、known-failure、unexpected-pass 都可能）。 */
  readonly approximated: number
}

export interface Report {
  readonly pattern: string
  readonly counts: ReportCounts
  /** 这次没跑到的层，免得把一次全绿当成全覆盖。 */
  readonly unrunLayers: readonly string[]
  /** 这次用近似代替的层。 */
  readonly approximatedLayers: readonly string[]
}

function count(results: readonly ExpectationResult[], status: ExpectationResult['status']): number {
  return results.filter(result => result.status === status).length
}

export function summarize(pattern: string, bindings: readonly BindingResult[]): Report {
  const results = bindings.flatMap(binding => binding.results)
  const unrunLayers = [...new Set(results.filter(r => r.status === 'unrun').flatMap(r => r.missingLayers ?? [r.evidenceLayer]))].sort()
  const approximatedLayers = [...new Set(results.flatMap(r => Object.keys(r.approximatedBy ?? {})))].sort()
  return {
    pattern,
    counts: {
      pass: count(results, 'pass'),
      fail: count(results, 'fail'),
      knownFailure: count(results, 'known-failure'),
      unexpectedPass: count(results, 'unexpected-pass'),
      notApplicable: count(results, 'not-applicable'),
      unrun: count(results, 'unrun'),
      approximated: results.filter(r => r.approximatedBy != null).length,
    },
    unrunLayers,
    approximatedLayers,
  }
}

/** 整个绑定的所有状态里一次都没真正跑过的期望。门槛没人碰过就不算门槛。 */
export function neverExercised(bindings: readonly BindingResult[]): readonly string[] {
  const ran = new Map<string, boolean>()
  for (const binding of bindings) {
    for (const result of binding.results)
      ran.set(result.expectation, (ran.get(result.expectation) ?? false) || (result.status !== 'not-applicable' && result.status !== 'unrun'))
  }
  return [...ran.entries()].filter(([, didRun]) => !didRun).map(([id]) => id).sort()
}

/** 会让测试失败的结果：必选期望失败，或者已知失败意外通过。advisory 失败只报告。 */
export function blockingResults(bindings: readonly BindingResult[]): readonly { binding: BindingResult, result: ExpectationResult }[] {
  return bindings.flatMap(binding => binding.results
    .filter(result => result.status === 'unexpected-pass' || (result.status === 'fail' && result.enforcement === 'required'))
    .map(result => ({ binding, result })))
}

function approximationNote(result: ExpectationResult): string {
  const entries = Object.entries(result.approximatedBy ?? {})
  return entries.length === 0 ? '' : ` · 近似：${entries.map(([layer, proxy]) => `${layer}←${proxy}`).join('、')}`
}

/** 人能看懂的失败说明：哪个组件、哪个状态、哪个环境、为什么。 */
export function formatFailures(blocking: readonly { binding: BindingResult, result: ExpectationResult }[]): string {
  return blocking.map(({ binding, result }) =>
    `${binding.binding} [${binding.state}] @${binding.harness}\n`
    + `  ${result.description}\n`
    + `  证据层：${result.evidenceLayer} · 级别：${result.enforcement} · 状态：${result.status}${approximationNote(result)}\n`
    + `  ${(result.detail ?? '').split('\n').join('\n  ')}`,
  ).join('\n\n')
}
