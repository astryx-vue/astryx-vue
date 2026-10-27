/**
 * 可访问性交互契约的测试工具。只给本仓库的测试用，不在 `src/` 里，也不会被打包发布。
 *
 * 用法和分层见同目录 README.md。
 */
export type { BindingResult, ExpectationResult, KnownFailure, ResultStatus } from './check'
export { checkAccessibilitySpec, MissingBindingCapability, reachOf, unmatchedKnownFailures } from './check'
export type { ChecklistDimensionId, ChecklistExemption } from './checklist'
export { CHECKLIST_DIMENSIONS } from './checklist'
export type { Expectation, PatternContract } from './contract'
export { citeSource, definePattern, describeExpectation, requiredLayers, unansweredDimensions } from './contract'
export type { ComponentStateOptions } from './expect'
export { checkComponentState, expectAccessibilitySpec } from './expect'
export type { ComputedNode, EvidenceLayer, Harness, Subject } from './harness'
export { EVIDENCE_LAYERS, UnobservableError } from './harness'
export { createHappyDomHarness, HAPPY_DOM_HARNESS } from './harness/happy-dom'
export type { ButtonStateFacts } from './patterns/button'
export { BUTTON_PATTERN } from './patterns/button'
export type { CheckboxStateFacts } from './patterns/checkbox'
export { CHECKBOX_PATTERN } from './patterns/checkbox'
export type { SwitchStateFacts } from './patterns/switch'
export { SWITCH_PATTERN } from './patterns/switch'
export type { Report } from './report'
export { blockingResults, formatFailures, neverExercised, summarize } from './report'
export type { BindingOptions, BindingState } from './vue'
export { controlled, describeBinding, findByRole, updatedAfterMount } from './vue'
