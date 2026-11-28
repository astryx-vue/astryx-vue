/**
 * @file index.ts
 * @input useRefreshControl
 * @output useRefreshControl、它的类型和指示器读的自定义属性名
 * @position lab 下拉刷新的入口，由 packages/lab/src/index.ts 再导出
 */

export { REFRESH_REVEAL_VAR, useRefreshControl } from './useRefreshControl'
export type { UseRefreshControlOptions, UseRefreshControlResult } from './useRefreshControl'
