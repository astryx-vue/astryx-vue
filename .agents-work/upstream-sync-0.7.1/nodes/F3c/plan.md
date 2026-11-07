# F3c：Tour 实施计划

## 范围

#195 的 Drawer 已由 PR #433 完成。本节点只剩 Tour / TourStep / useTour，完成引导流程后关闭 #195。

## 组件边界

- `Tour.vue`：步骤注册、活动索引、前进/后退/完成/关闭；受控 isActive，关闭时由调用方更新。
- `TourStep.vue`：仅在活动步骤渲染；复用 core Popover/Button/Heading/Text/Stack；测量目标并保留调用方 DOM 与样式。
- `TourHighlight.vue`：独立顶层高亮与可选 spotlight 遮罩；不接管业务点击。
- `context.ts` / `useTour.ts`：内部共享状态和公开只读 hook。

## 行为验收

- 初始只显示第一步；Next/Back/Done 和 1 of N 正确。
- 最后一步 Done 上报 complete；关闭、遮罩、Escape 走约定原因。
- isActive=false 不显示步骤；重新激活回到第一步。
- 步骤注销后数量与索引保持有效；孤立 TourStep 不渲染。
- 高亮跟随目标滚动/resize，目标不被改写；遮罩只保留目标亮区。
- SSR 无窗口访问；真实 Chromium 覆盖 LTR/RTL、深浅主题、滚动、键盘和 axe。

## 工程验收

- Lab typecheck、ESLint、包检查、500 行、无新增 !important。
- 新行为均有测试；核心路径做浏览器截图。
- 独立功能 PR，合并后只发版一次。
