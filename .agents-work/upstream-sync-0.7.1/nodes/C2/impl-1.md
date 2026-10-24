# C2 勾选与开关 · 第 1 轮实现回报

- 工作区：当前仓库检出，分支 `sync/c2-checkable`。云端没有本机 worktree 路径。
- 提交（基于 `swarm-tree` 的 `4a5b9a4`）：
  - `97c1462` docs(C2): 写下勾选与开关的执行计划和验收清单
  - `a4340a3` feat(C2): 勾选与开关对齐上游的样式分层和交互
  - 台账和本回报在随后一笔文档提交里

## 1. 做了什么

1. CheckboxList、RadioGroup、Slider 关掉属性继承，接上 `containerClass`、`containerStyle`、`controlClass`、`controlStyle`。外壳继续吃根上的 class 和 style，再加 `container*`。本体只吃 `control*`。`data-*`、`aria-*` 和指针事件落到主语义控件。
2. 复选列表选项包在 `role="group"` 里。标题和说明可以用插槽。富文本标题给复选框命名，`ariaLabel` 可覆盖。说明通过 `aria-describedby` 关联。点链接不切换。
3. 复选框标签同时带 `astryx-checkbox-label`，开关标签同时带 `astryx-switch-label`。开关变忙碌时用 `useAnnounce` 按当前语言播报，组件里不再挂 `role="status"`。有 `status.message` 时渲染 FieldStatus，并挂到 `aria-describedby`。
4. 滑块 Home、End 不吸附步长，再夹到拇指范围内。方向键和 Page 键仍吸附。只在键盘把焦点带到拇指时画环。拖动中的滑块有按压色。单值的 `data-testid` 在拇指上，区间在 `role="group"` 上。
5. 复选框、单选、开关、分段控件接入 `usePressFeedback`。粗指针按压上色，鼠标仍用 `:active`。单选和开关补了 24px 触屏热区。
6. 中英文 props 写了四个样式属性、富文本插槽、标签 class，以及开关加载文案跟随语言。
7. 没有跑 `pnpm sync`。没有新增公共导出。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/CheckboxList/CheckboxList.vue` | 99 | 外壳和 group 本体的样式分层 |
| `packages/core/src/CheckboxList/CheckboxListControl.vue` | 40 | 在行内插槽里读取说明 id |
| `packages/core/src/CheckboxList/CheckboxListItem.vue` | 76 | 富文本标题和说明 |
| `packages/core/src/Radio/RadioGroup.vue` | 92 | 外壳和 radiogroup 的样式分层 |
| `packages/core/src/Radio/Radio.vue` | 82 | 按压、富文本、点链接不选中 |
| `packages/core/src/Slider/Slider.vue` | 171 | 外壳、轨道本体、主语义控件 |
| `packages/core/src/Slider/useSlider.ts` | 153 | 端点、焦点环、修饰键 |
| `packages/core/src/Switch/Switch.vue` | 145 | 主题 class、加载播报、状态说明 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| FR10 | `containerClassName` 等，外加 StyleX | B6 的四个 class/style 属性 | 外壳和本体都能加样式 |
| 根 class | 丢掉并警告 | 留在今天的外壳 | 用户已定 |
| 富文本 | ReactNode | 插槽 | 可见文字就是读屏名字，链接可点 |
| 说明 id | 子树里直接拿 | 行内子组件再 inject | 提供 id 的是列表行，父组件的 setup 拿不到 |
| 加载播报 | `useAnnounce` | 已有的 `useAnnounce` | 文档级播报区，文案跟语言 |
| 滑块焦点环 | 交互模态加 `:focus-visible` | `data-keyboard-focus` | 鼠标拖动和单独按 Shift 不画环 |
| End | `snap: false` 再夹取 | 同样不吸附再夹取 | max 100、step 3 时 End 是 100，再按左是 96 |

## 3. 和计划不一样的地方

计划里的滑块测试写成「End 之后按左到 99」。上游实际是 97 再吸附到 96。测试改成和上游一样：End 100，左键 96，PageUp 回到 100。

复选列表的说明 id 不能在行组件自己的 setup 里 inject。拆出 `CheckboxListControl`，放进行内插槽后再读。

开关补上了状态说明。已知失败名单里写着由 C2 补，不补的话无障碍测试会一直失败。

## 4. 台账处理

一共 62 条。已采纳 49 条。不适用 13 条。

不适用：

- `a1a6a636f`：没有上游那层已废弃的主题兼容面。
- `ea0483449`、`6e6b9b476`：外观嵌套 token 已被撤回，v0.7.1 里不存在。
- `e891c0dc8`：后一笔把禁用指针改成 `default`。
- `4ec26d757`：只动 layer，本节点不改 `layer/`。
- `d88274b4b`、`78db903ad`：只改 Chromium 记录，组件不在这笔的行为范围里。
- `d41bbfa92`、`43f4f7d09`、`60fc2f233`、`491945a49`、`cac1b8f98`、`5cd16b69d`、`ec71b5582`、`c239413c7`：Chromium 套件不移植。
- `8bf4b5136`：上游知识库生成面，本仓库没有那套产物。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2`，路径覆盖 CheckboxInput、CheckboxList、Radio、RadioList、Switch、Slider、SegmentedControl、ToggleButton、Field | 过 | 17 个文件，186 条 |
| 2 | `NODE_ENV=production` 同一组 | 过 | 17 个文件，186 条 |
| 3 | `env -u NODE_ENV pnpm typecheck` | 过 | 退出码 0。core 的 `vue-tsc` 也单独过了 |
| 4 | 相关 eslint、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs` | 过 | 行数上限通过，没有 `!important` |
| 5 | 文档站整页 | 过 | 见下方路径。桌面能看到侧栏和顶栏，并滚到 Demo。390px 是文档站自己的窄屏，侧栏收进「菜单」 |

截图在 `/opt/cursor/artifacts/c2/`，没有入库：

- `checkbox-list-desktop-light.png`、`checkbox-list-desktop-dark.png`
- `radio-list-390-light.png`
- `switch-desktop-dark.png`
- `slider-390-dark.png`
- `segmented-control-desktop-light.png`
- `switch-side-by-side-light.png`、`slider-side-by-side-light.png`：左为 https://astryx.atmeta.com ，右为本地文档站。720px 宽，两边侧栏都收起。

文档站端口是 `4173`。

## 6. 拿不准的地方

E3 把 radio-group、toggle-button、slider 的 happy-dom 契约交给 C2。模式文件现在还不存在，本轮没有新写这三套契约。组件行为用现有 vitest 守住。

根上直接写的 class 和 style 留在外壳，和上游「丢掉并警告」不同。这是已定做法。

## 给 D7 的说明

新增属性：CheckboxList、RadioGroup、RadioList、Slider 的 `containerClass`、`containerStyle`、`controlClass`、`controlStyle`。根上直接写的 class 和 style 仍然落在外壳，不丢弃、不警告。

行为变化：Switch 的 `loadingLabel` 不再默认写成英文 `Loading`。没传时跟随当前语言（中文是「加载中」）。传了字符串仍然用传入的文案。开关内部不再为加载挂 `role="status"`。有状态消息时会渲染出来并挂到开关上。

没有删除公开属性。没有改 `layer/`。
