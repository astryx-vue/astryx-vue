# E2 验收报告 · 第 1 轮

- 验收者工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E2`，分支 `sync/e2-split-docs`，提交 `46a0e25`
- BASE：`885ae4afffc9e82d18299642cdf09c5d56f4fc67`（`git log --oneline -3` 确认实现者只有最上面 1 个提交）
- 结论：**通过**。22 项全部过。
- 说明：实现者的回报只用来了解情况。下面所有证据都是我自己重新跑的，截图也是我自己在 base 和 E2 上各截一遍。

## 方法

- 自己建 base 工作区（`/tmp/verify-E2/base`，`pnpm install --frozen-lockfile`、`build:packages`），验收结束已删。
- base 和 E2 依次起文档站（5173 端口，`NODE_ENV=development`），每次都通过 `node scripts/swarm/browser-lock.mjs run --purpose E2-verify -- ...` 拿浏览器锁，同一时刻只有 1 个浏览器和 1 个服务。跑完服务已关，5173 无监听。
- 脚本：`/tmp/verify-E2/run.mjs`（起服务并关服务）、`/tmp/verify-E2/shoot.mjs`（截图和交互）、`/tmp/verify-E2/diff.mjs`（pixelmatch，threshold 0）。
- 截图条件：视口 1440x900，整页截图，浅色和深色各一套，`reducedMotion: reduce` 让首页聊天停在播完的状态。

## 一、页面完全不变

| 项 | 结果 | 证据 |
| --- | --- | --- |
| 1 首页 `/`、`/en/` 浅色和深色 | 过 | 4 张，像素差异 0 |
| 2 演练场 5 个模板（ai-chat、settings-dialog、kanban-board、detail-page、settings-sidebar）浅色 | 过 | 5 张，差异 0。另外深色 5 张和演练场默认页浅深各 1 张，差异也是 0 |
| 3 主题编辑面板展开，浅色和深色 | 过 | `pg-theme-editor`、`pg-en-theme-editor` 各浅深 2 张，共 4 张，差异 0 |
| 4 `TokenReference` 主题页 | 过 | `grep` 得到 `themes/{color,motion,scale,typography}.md`（中英文共 8 个）。截了 `/themes/color`、`motion`、`scale`、`typography`、`/en/themes/color`、`/en/themes/typography`，浅深共 12 张，差异 0 |
| 5 亲眼看图 | 过 | 见下 |

- 总共 33 张 PNG（含交互后的 `after-theme-edit.png`），像素差异全部是 0，没有任何一张尺寸不同。
- 两边都空白也会得 0，所以我亲眼看了 4 张 E2 的图：
  - `/tmp/verify-E2/shots-e2/light-home-zh.png`：顶栏、astryx 大 logo、标题「用 Vue 重新实现 Astryx 设计语言」、两个按钮、安装命令框、三条特性、右侧聊天卡片（用户提问、助手、pnpm add 工具行、带 shiki 高亮的代码块、结尾气泡、输入框和「发送」）。样式齐全，没有报错层。
  - `/tmp/verify-E2/shots-e2/dark-pg-theme-editor.png`：深色演练场，主题面板展开。Colors 七行带色块和十六进制值，Preset 四个图标按钮，两个字体下拉，Type Scale 下拉，Type Size 的 S、M、L、XL 和数字框。右侧预览是 Welcome 卡片，状态「构建完成」。
  - `/tmp/verify-E2/shots-e2/light-pg-kanban-board.png`：看板模板。左边 Monaco 编辑器有完整的行号和高亮代码，右边 Sprint Board 三列卡片，标签、菜单点、空状态都在。
  - `/tmp/verify-E2/shots-e2/dark-themes-motion.png`：深色「动画与过渡」页，侧栏、正文表格、时长和缓动的 token 行、动画示例按钮和类名列表、上一页下一页，都完整，样式齐全。

## 二、交互不变

base 和 E2 的 `interactions.json`、`export.css`、`export.json`、`console.txt` 用 `cmp` 比较，逐字节相同。

| 项 | 结果 | 证据 |
| --- | --- | --- |
| 6 切换模板 | 过 | 依次切到 AI 对话、内容·卡片网格、主题展示，每次都弹确认框并点「继续」。编辑器源码开头和预览文字都跟着变（AI 对话预览是 `auth-service.ts` 聊天，卡片网格预览是 Web overview，最后是 Studio Shop）。两边相同 |
| 7 改颜色和导出 | 过 | accent 改 `#ff0000` 后，iframe 里 `--astryx-color-accent` 从 `light-dark(#262626, #ebebeb)` 变成 `light-dark(#262626, #ff0000)`。导出的 CSS 和 JSON 两边逐字节相同，里面都有 `#ff0000`。分享链接长度都是 8065 |
| 8 复制安装命令 | 过 | 按钮名「复制安装命令」变成「已复制安装命令」，剪贴板内容是 `pnpm add @astryx-vue/core @astryx-vue/themes`。两边相同 |
| 9 自动播放聊天（不关动效） | 过 | 状态序列 U（用户）、T（工具）、L（引导文字）、C（代码）、E（结尾）依次出现：`U----`、`UT---`、`UTL--`、`UTLC-`、`UTLCE`，30 秒内播完一轮。base 序列相同 |
| 10 控制台 | 过 | base 和 E2 的 17 条记录完全一样，全是同一条 iframe `allow-scripts` 加 `allow-same-origin` 的 sandbox 警告。E2 没有新增的错误或警告，也没有 pageerror |

## 三、模板页和生成文件的处理

| 项 | 结果 | 证据 |
| --- | --- | --- |
| 11 模板页处理 | 过 | 选择了「排除」。`line-limit.config.mjs` 新增 `^apps/docs/components/playground/pages/[^/]+\.vue$`，只管这个目录里的 `.vue`，理由写得通：模板页是被原样复制的单文件示例。另一条是 `templateManifest.ts`。我检查了整份 diff，没有顺带排除别的文件 |
| 12 模板页内容 | 过 | `git diff $BASE -- apps/docs/components/playground/pages/` 为空（0 行） |
| 13 manifest 可重新生成 | 过 | 用 `git archive v0.7.1 packages/cli/assets/templates/pages` 导出到 `/tmp/verify-E2/up`（标签 commit 44f7244，57 个条目）。设 `ASTRYX_UPSTREAM` 后跑 `generate-template-manifest.mjs`，写出 53 个模板，509 行。原始输出和仓库版本只差引号风格。再跑 `eslint --fix` 以后，和仓库版本逐字节一致（`diff` 无输出）。已用 `git checkout --` 还原。所以它确实是生成物，排除合理。（脚本默认路径无效、必须设环境变量，这是原有行为，不影响这一项） |
| 14 check:templates 和 generate:check | 过 | `check:templates`：48 个模板落地后 vue-tsc 通过，跳过 5 个 isReady=false 的。`generate:check`：catalog is up to date（245 components、31 topics、53 templates） |

## 四、拆得合理

| 项 | 结果 | 证据 |
| --- | --- | --- |
| 15 行数 | 过 | 新增和被拆的文件最长是 `TokenReference.vue` 333 行，其次 `PlaygroundApp.vue` 311 行，都不超过 500 |
| 16 职责单一 | 过 | 每个文件一句话说得清。`theme.ts` 39 行，是统一入口（再导出），有 7 处引用方和 `tests/playground-theme.test.ts`，有用。最小的两个文件 `PlaygroundThemeScale.vue` 55 行、`usePaneResize.ts` 57 行，都超过 30 行。前者在编辑面板里被用了两次，后者是独立的一块交互。没有杂物文件 |
| 17 对外导出 | 过 | 对比 base 的 `theme.ts` 的 36 个导出和新 `theme.ts`：我的粗脚本报告缺 `themesEqual`、`themeVariables`、`TYPE_SCALES`，是因为它们在 base 里挤在一行。我手工 grep 确认三个名字都在新 `theme.ts` 的再导出里，没有缺失。引用方（`usePlayground.ts`、`share.ts`、`usePreviewSync.ts`、`PlaygroundApp.vue`、`PlaygroundThemeEditor.vue`、`themeEditorModel.ts`、`tests/playground-theme.test.ts`）一处都没改，`.vue` 组件的 props 和 emits 与 base 一致 |
| 18 注释无变更历史 | 过 | 按要求的 grep 命中 2 行，都不是变更历史：一条是 `Upstream getTokenLabel, with this package's --astryx- prefix removed.`（说明函数行为，`removed` 子串被 `moved` 匹配），一条是「取色器只给出不透明颜色，原来带透明度的话把透明度接回去」（「原来」是指颜色原有的透明度，描述现状） |
| 19 白名单 | 过 | 删掉的正好是 11 条 `apps/docs/...`（5 个模板页、`templateManifest.ts`、`HomeStage`、`PlaygroundApp`、`PlaygroundThemeEditor`、`theme.ts`、`TokenReference`），剩下的 `packages/` 条目没有变化。`node scripts/check-line-limit.mjs` 通过 |

## 五、整体

| 项 | 结果 | 证据 |
| --- | --- | --- |
| 20 指定测试 | 过 | `tests/playground-*.test.ts`、`docs-b11`、`llms-txt`、`sidebar-families`，共 6 个文件。不设 `NODE_ENV` 和 `NODE_ENV=production` 各跑一遍，都是 113 通过，base 也是 113 |
| 21 完整 check | 过 | `check:packages`、`lint`、`typecheck`、`vitest run --maxWorkers=2`、`build`、`lint:pkg` 依次全部通过，退出码 0。vitest：220 文件、2541 测试通过。base 同样是 220 文件、2541 测试 |
| 22 没动 packages | 过 | `git diff $BASE --stat`：23 个文件，没有 `packages/` 下的路径 |

## 环境与收尾

- `git status`：开始和结束时都是 `nothing to commit, working tree clean`，`diff` 一致。
- base worktree 已用 `git worktree remove --force` 删除，`git worktree list` 里没有了。
- 5173 端口已无监听，我的浏览器锁已释放（`browser-1` 目前是 E4 的）。
- 临时文件都在 `/tmp/verify-E2/`。

## 备注（不影响结论）

实现者回报里列的几个「发现了但没修的问题」（`reset-theme` 事件没有触发源、对话框的 `share` 分支没人打开、Components 和 Advanced 标签页为空）是 base 里就有的行为，本轮两边表现一致，不算回归。
