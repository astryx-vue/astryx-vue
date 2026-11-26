/**
 * 输入法正在组字时，方向键和 Enter 应留在候选框里。
 * 判断条件和 core 的 `utils/ime.ts` 一致：`isComposing`、`keyCode === 229`、`key === 'Process'`
 * 任一成立就算组字中。不从 core 入口引入 `isImeKeyEvent`：那个帮助函数不是公开 API。
 */
export function isImeKeyEvent(event: KeyboardEvent): boolean {
  return event.isComposing || event.keyCode === 229 || event.key === 'Process'
}
