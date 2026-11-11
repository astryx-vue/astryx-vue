/**
 * 输入法正在组字时，方向键和 Enter 应留在候选框里。
 * 不从 core 入口引入 `isImeKeyEvent`：那个帮助函数不是公开 API。
 */
export function isImeKeyEvent(event: KeyboardEvent): boolean {
  return event.isComposing || event.keyCode === 229
}
