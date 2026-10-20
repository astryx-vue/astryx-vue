/**
 * 契约自测的公共驱动。每个模式的 `<name>.test.ts` 调一次 `describeContract`，证明：
 * - 清单的每个维度都有回答；
 * - 每条期望都有至少一个让它失败的夹具，而且对照表里没有孤儿；
 * - 在 happy-dom 里看得见的期望：对所有合格夹具通过（或不适用），对它的违规夹具失败；
 * - 看不见的期望报 unrun，绝不报通过。
 */
import type { ExpectationResult } from './check'
import type { PatternContract } from './contract'
import type { Fixture, FixtureSet } from './fixtures'
import { afterEach, describe, expect, it } from 'vitest'
import { checkAccessibilitySpec, reachOf } from './check'
import { citeSource, describeExpectation, unansweredDimensions } from './contract'
import { conformingIds, findFixture, SUBJECT_SELECTOR } from './fixtures'
import { createHappyDomHarness, HAPPY_DOM_APPROXIMATES, HAPPY_DOM_OBSERVES } from './harness/happy-dom'

const HAPPY_DOM_REACH = { observes: HAPPY_DOM_OBSERVES, approximates: HAPPY_DOM_APPROXIMATES }

async function resultsFor<Facts>(spec: PatternContract<Facts>, target: Fixture<Facts>): Promise<readonly ExpectationResult[]> {
  const container = document.createElement('div')
  document.body.append(container)
  try {
    const result = await checkAccessibilitySpec({
      spec,
      binding: 'fixture',
      state: target.id,
      facts: target.facts,
      activations: () => 0,
      mount: async () => {
        container.innerHTML = target.html
        const subject = container.querySelector(SUBJECT_SELECTOR)
        if (subject == null)
          throw new Error(`夹具 "${target.id}" 没有标出主角元素`)
        return createHappyDomHarness(subject)
      },
      unmount: () => {
        container.innerHTML = ''
      },
    })
    return result.results
  }
  finally {
    container.remove()
  }
}

function resultFor(results: readonly ExpectationResult[], id: string): ExpectationResult {
  const found = results.find(result => result.expectation === id)
  if (found == null)
    throw new Error(`没有 ${id} 的结果`)
  return found
}

export function describeContract<Facts>(spec: PatternContract<Facts>, set: FixtureSet<Facts>): void {
  afterEach(() => {
    document.body.replaceChildren()
  })

  describe(`${spec.pattern} 契约：完整性`, () => {
    it('回答了清单的每个维度', () => {
      expect(unansweredDimensions(spec)).toEqual([])
    })

    it('每条期望都有让它失败的夹具', () => {
      const missing = spec.expectations.filter(e => (set.mutations[e.id] ?? []).length === 0).map(e => e.id)
      expect(missing).toEqual([])
    })

    it('对照表里没有不存在的期望或夹具', () => {
      const ids = new Set(spec.expectations.map(e => e.id))
      expect(Object.keys(set.mutations).filter(id => !ids.has(id))).toEqual([])
      for (const fixtureIds of Object.values(set.mutations)) {
        for (const id of fixtureIds)
          expect(() => findFixture(set, id)).not.toThrow()
      }
    })

    it('happy-dom 看不见的期望报 unrun，不报通过', async () => {
      const results = await resultsFor(spec, findFixture(set, conformingIds(set)[0]!))
      const hidden = spec.expectations.filter(e => reachOf(e, HAPPY_DOM_REACH).kind === 'unrun').map(e => e.id)
      expect(hidden.length).toBeGreaterThan(0)
      for (const id of hidden)
        expect(['unrun', 'not-applicable'], id).toContain(resultFor(results, id).status)
    })
  })

  const observable = spec.expectations.filter(e => reachOf(e, HAPPY_DOM_REACH).kind === 'run')
  describe.each(observable.map(e => [e.id] as const))('%s', (id) => {
    const expectation = spec.expectations.find(e => e.id === id)!

    it.each(conformingIds(set).map(name => [name] as const))('对合格夹具 %s 通过或不适用', async (name) => {
      const result = resultFor(await resultsFor(spec, findFixture(set, name)), id)
      expect(['pass', 'not-applicable'], `${id} @ ${name}：${result.detail ?? ''}`).toContain(result.status)
    })

    it.each((set.mutations[id] ?? []).map(name => [name] as const))('对拿掉结果的 %s 失败', async (name) => {
      const result = resultFor(await resultsFor(spec, findFixture(set, name)), id)
      expect(result.status, `${id} @ ${name}`).toBe('fail')
      expect(result.detail ?? '').not.toBe('')
    })

    it('失败信息里带着期望 id 和主出处', async () => {
      const [violating] = set.mutations[id] ?? []
      const result = resultFor(await resultsFor(spec, findFixture(set, violating ?? conformingIds(set)[0]!)), id)
      expect(result.description).toContain(id)
      expect(result.description).toContain(citeSource(expectation.sources[0]))
      expect(describeExpectation(expectation)).toBe(result.description)
    })
  })
}
