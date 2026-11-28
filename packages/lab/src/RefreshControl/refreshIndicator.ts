/**
 * @file refreshIndicator.ts
 * @input 无
 * @output REFRESH_REVEAL_VAR：触摸层写、app 的指示器样式读的自定义属性名
 * @position useRefreshControl 内部用，也从 lab 入口导出给 app 的指示器样式
 */

/** CSS custom property the indicator reads: how much of it is revealed (0–1). */
export const REFRESH_REVEAL_VAR = '--astryx-refresh-reveal'
