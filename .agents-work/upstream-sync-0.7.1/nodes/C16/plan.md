# C16 基础展示与动作 · 执行计划

## 目标

按钮、链接、头像溢出、标签、缩略图在触屏上不再一按就亮，而是等按压成立再亮、抬手再淡出；鼠标仍是按下即亮。带文字的按钮在窄行里会缩小并截断。头像首字母会跳过标点、认字母数字和表情。按钮组只留一个 Tab 停靠点，打开的菜单里方向键不再被组抢走。没有网址的引用不再被读成链接。引用块不再多出一个页面级页脚地标。

## 工作环境

- 工作区：当前云端检出 `/workspace`，分支 `sync/c16-display-actions`，从 `swarm-tree`（`1419a29`）切出。总控文档里的本机 worktree 路径在这台机器上不存在，不使用。
- 动手前已读：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md`
  - `.agents-work/upstream-sync-0.7.1/ROADMAP.md` 的 C16 行与细节表
  - `.agents-work/upstream-sync-0.7.1/ledger/C16.md`
  - `packages/core/src/composables/usePressFeedback.ts` 与 `packages/core/styles/pressable.css`（B3）
  - 上游 v0.7.1 浅克隆：`/tmp/astryx-upstream`
- 环境纪律：
  - 测试和 `pnpm check` 前面加 `env -u NODE_ENV`；另跑一遍 `NODE_ENV=production`。
  - vitest 加 `--maxWorkers=2`。
- 浏览器纪律：
  - 本轮以组件测试和样式对照为主。视觉截图留给验收者。实现者不另开文档站。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| #6383、#6380、#5516 触屏按压 | 手指按住按钮、链接、可点缩略图、可点标签、可点头像溢出约 150ms 后才出现按压色；滑走或滚动就取消；抬手后约 200ms 淡出。鼠标仍是按下立刻变色并略缩小。按压色盖过悬停色。禁用时不出现悬停和按压。 |
| #6812 按钮在窄行里缩小 | 带文字的按钮可以被挤窄，文字出现省略号，不再把整行撑破。只有图标的按钮保持正方形。 |
| #5762 图标跟着按钮尺寸 | 按钮里没写尺寸的图标，小/中按钮是 16px，大按钮是 20px。 |
| #5627、#5552 加载与投影 | 加载中（且不可打断）不能再点，悬停和按下都不变形。投影仍挂在按钮或按钮组上，组内按钮自己不再带投影。 |
| #5389、#5355 按钮组键盘 | 一组按钮只有一个能被 Tab 到。方向键在组内移动并绕回，跳过禁用项。焦点在成员自己打开的弹出层里时，方向键留给那一层。 |
| #4205、#6698、#4776、#5034 头像 | `shape` 为圆、圆角或直角。首字母取首尾词里的字母、数字或表情，跳过标点；`(automation)` 这类词仍能取出字母。可点头像没有名字时，开发模式打一条警告。 |
| #5046、#5055、#6736 头像组 | 溢出标记的尺寸和形状跟组走，负数人数显示成 `+0`。头像被提示层包住时仍然叠在一起，第一张不会被推出组的盒子。 |
| #5558 徽章 | 长文字在徽章里省略，不把容器撑破。 |
| #6026、#6027、#5559 标题和正文 | 标题可以单独指定视觉样式和字重。截断后只出现一个全文提示。 |
| #7100、#5657、#5325、#5394 键盘徽章 | 键帽用主文字色，对比度够。`esc` 等于 Escape，`return` 等于 Enter。平台未知时不当成非苹果。 |
| #5144 引用块 | 出处在 `cite` 里，不再套 `footer`，读屏不会多报一个页脚。长单词会折行。空出处不渲染。 |
| #6849、#5524 引用与链接 | 没有可用网址的引用是一个有名字的组，不是链接角色。`javascript:`、`vbscript:`、`data:text/html` 不会变成可跳转地址。 |
| #4963、#5601、#5586 缩略图与轮播 | 触屏上删除按钮的可点区域至少约 24px。轮播滚到尽头时，焦点留在另一侧按钮或滚动区，不掉到页面上。从右到左时，边缘淡出在藏住内容的那一侧。 |
| #5335 禁用指针 | 禁用控件是默认指针，不是禁止指针。 |

## 上游依据

- 台账条目：`ledger/C16.md` 全部条目。
- 上游源码：`packages/core/src` 下 Button、ButtonGroup、IconButton、Link、Avatar、AvatarGroup、Badge、Token、Thumbnail、Kbd、Citation、Carousel、Heading、Text、Blockquote、Icon，以及 `utils/safeUrl.ts`、`utils/interactionOverlay.stylex.ts`、`hooks/usePressFeedback`、`hooks/useListFocus`。
- 上游测试：各组件的 `*.test.tsx` 里和上面效果对应的用例。不移植 Chromium 无障碍夹具。

查上游文件用 `/tmp/astryx-upstream` 的 v0.7.1 检出。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `usePressFeedback()` 返回要摊到元素上的 props，样式用 StyleX | `v-bind="pressableProps"`。自己画按压的传 `{ hasOverlay: false }`，读 `--_press-paint-image`；其余用 B3 的 `astryx-pressable` | 元素上的 `data-astryx-pressable` / `data-astryx-press` 和淡出时长与 B3 控制器一致 |
| 鼠标 `:active` 放在 StyleX 的粗指针媒体查询里 | 普通 CSS：`:active` 包在 `@media not all and (pointer: coarse)`，触屏分支放在 `:hover` 后面 | 手指不走 `:active`，按压色盖过悬停 |
| `useListFocus({ hasRovingTabIndex: true })` | 直接用现有的 `useListFocus`。方向改成可读响应式值，按钮组改方向后左右键仍对 | 只有一个 tabindex 0，方向键、Home/End、弹出层边界和上游同一套规则 |
| `useLinkComponent` 包一层 SafeLink | `Link/safeUrl.ts` 判断目的地。不安全时不用自定义路由组件，锚点不带 `href` | 危险协议不会导航，自定义路由也收不到这个地址 |
| React ref 合并要保持身份稳定 | 不做 | Vue 模板 ref 没有这层抖动 |
| 图标注册表要求有 upload | 不改注册表 | B5 已经要求完整语义表包含 `upload`，并有兜底图形 |

涉及图标时继续用语义名和 `provideIconSize`，不引入上游的图标组件表。

## 任务范围

- 要改：
  - `packages/core/src/Button/Button.vue`、`packages/core/styles/button.css`、`packages/core/styles/button-group.css`
  - `packages/core/src/ButtonGroup/ButtonGroup.vue`
  - `packages/core/src/Link/Link.vue`、`packages/core/src/Link/safeUrl.ts`、`packages/core/styles/link.css`（仅当默认按压层不够时）
  - `packages/core/src/Token/Token.vue`、`packages/core/styles/token.css`
  - `packages/core/src/Thumbnail/Thumbnail.vue`、`packages/core/styles/thumbnail.css`
  - `packages/core/src/Avatar/Avatar.vue`、`packages/core/src/Avatar/utils.ts`、`packages/core/styles/avatar.css`
  - `packages/core/src/AvatarGroup/AvatarGroup.vue`、`AvatarGroupOverflow.vue`、`packages/core/styles/avatar-group.css`
  - `packages/core/src/Citation/Citation.vue`
  - `packages/core/src/Blockquote/Blockquote.vue`、`packages/core/styles/blockquote.css`
  - `packages/core/styles/kbd.css`
  - `packages/core/src/Carousel/Carousel.vue`（补滚动区的稳定类名）
  - `packages/core/src/composables/useListFocus.ts`（方向改为可读最新值）
  - 上述组件已有的测试
  - `ledger/C16.md`、本目录 `impl-1.md`
- 不碰：
  - `ROADMAP.md`、`SWARM.md` 的状态表
  - `verify.md`（本轮不写、不读）
  - 生成文件（只跑 `pnpm sync`）
  - InputGroup 的结构（C1）
  - Icon 注册表（B5 已完成）
  - 别的节点的组件

- 范围不对时：先停下，在回报里写清楚，不要自己扩大或缩小范围。

## 开发步骤

每做完一步，相关测试通过以后就提交一次。

1. 抽出 `isSafeUrl` / `isSafeDestination`，Button、Link、Token、Citation 在导航前使用。不安全的地址不交给自定义链接组件。
2. Button、Link、Token、Thumbnail 打开按钮、可点的 AvatarGroupOverflow 接上 `usePressFeedback`，并改对应 CSS：粗指针不用 `:active`，`data-astryx-press` 盖过悬停。带标签的按钮 `min-width: 0`，图标尺寸用 `provideIconSize`。Token 禁用指针改为 `default`。
3. ButtonGroup 改用 `useListFocus` 的漫游 tabindex，方向键在弹出层内不处理。
4. 头像首字母按字素跳过标点；可点但没名字时开发期警告。头像组用重叠变量，第一张和被包住的头像都重叠，并补回起始边距。溢出标记带上 `data-size` / `data-shape`。有可点头像时组内漫游焦点。
5. 引用块去掉 `footer`，空出处不渲染，长词折行。没有安全网址的引用用 `role="group"`。键盘徽章改用主文字色。轮播滚动区加上 `astryx-carousel-scroller`。
6. 补测试。跑 `pnpm sync`。台账每条改成 `- [x]` 并写结论。

## 自测要求

1. `timeout 180 env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Button packages/core/src/ButtonGroup packages/core/src/IconButton packages/core/src/Link packages/core/src/Avatar packages/core/src/AvatarGroup packages/core/src/Badge packages/core/src/Token packages/core/src/Thumbnail packages/core/src/Kbd packages/core/src/Citation packages/core/src/Carousel packages/core/src/Heading packages/core/src/Text packages/core/src/Blockquote packages/core/src/Icon packages/core/src/composables/useListFocus.test.ts`，全部通过。
2. `timeout 180 env NODE_ENV=production pnpm vitest run --maxWorkers=2` 加上同样路径，用例数与上一步相同。
3. 尽量 `timeout 300 env -u NODE_ENV pnpm check`。若全量检查超时，记下卡在哪一步，并保证 `timeout 120 env -u NODE_ENV pnpm exec eslint` 覆盖改过的文件、以及行数检查通过。
4. 视觉对照交给验收。本轮用测试锁住：按压标记、窄按钮的最小宽度规则、首字母、漫游 tabindex、危险协议、引用角色、引用块没有 footer。
5. 新写和改到的源码文件不超过 500 行。

## 提交与回报

- 在分支 `sync/c16-display-actions` 上提交，提交信息用中文。按总控要求推送并开 PR，基线是 `swarm-tree`。
- 不要改 `ROADMAP.md` 的节点状态。
- 回报写到 `.agents-work/upstream-sync-0.7.1/nodes/C16/impl-1.md`，格式见 `templates/impl-report.md`。
- 最终回复用中文，300 字以内。

## 验证操作要短小

每条命令带 `timeout`。失败时拆出单个测试文件重跑，不原样重跑整组。脚本和临时输出放在 `/tmp/c16-*`。
