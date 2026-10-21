# E4 实现回报 · 第 1 轮

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E4`，分支 `sync/e4-ci-visual`
- 提交：`5a5543a ci: PR 改到组件时自动跑视觉对照并在 PR 里报告分数`（没有推送）
- 没有改 `scripts/swarm/visual-compare*`、`docs.yml`、`release.yml`、ROADMAP.md、SWARM.md。

## 1. 新增文件和职责

| 文件 | 职责 |
| --- | --- |
| `scripts/swarm/changed-components.mjs`（199 行） | 改动文件 → 要跑的组件。输入可以是文件列表、`--base/--head` git 范围，或 `--components` 手动名单。输出 JSON：`components`、`skipped`（超过 8 个的部分）、`reasons`（每个组件是哪些文件触发的）、`broadFiles`（触发代表组件的公共文件）。`--github-output` 往 `$GITHUB_OUTPUT` 写 `count`。名字换算全部用 A2 的 `names.mjs`。 |
| `scripts/swarm/visual-ci.mjs`（208 行） | CI 运行层。先**预检**：我们的 `apps/docs/docs/en/components/<slug>/index.md` 在不在，上游页面是不是 404（网络错误和 5xx 重试 2 次）。不通过的组件直接记成「跳过」，不起服务、不开浏览器。通过的组件共用**一次**文档站（复用 A2 的 `acquireDocsServer`），逐个用子进程跑 `visual-compare.mjs --ours <origin>`（浏览器锁由它自己拿）。最后写 `<out>/summary.json`。只有工具崩溃（没写出 report.json）或文档站起不来才返回 1。 |
| `scripts/swarm/visual-comment.mjs`（177 行） | 纯函数 `buildVisualComment()`：summary → 评论 Markdown。第一行是隐藏标记 `<!-- astryx-visual-compare -->`。包含分数表、附件链接、没跑成的组件、截图失败的组合、这次没跑的组件、为什么跑了代表组件。失败原因去掉终端颜色控制符、压成一行、超过 300 字截断。命令行可传 `--summary` 或 `--plan`（没有组件时）。 |
| `.github/workflows/visual-compare.yml` | workflow，见下文。 |
| `tests/changed-components.test.ts` | 映射规则、公共文件、截断、无关文件、手动名单、真实仓库里代表组件都有页面。 |
| `tests/visual-comment.test.ts` | 隐藏标记、分数表、附件链接、没跑成、失败组合、没跑、代表组件说明、整页模式、空计划、控制符清理、截断。 |
| `tests/visual-ci.test.ts` | 上游预检（200 / 404 不重试 / 重试 / 重试耗尽）、我们没页面时不访问上游。 |
| `.gitignore` | 加了 `visual-out/`（CI 输出目录，本地演练时不会落进工作区）。 |

三个测试文件共 67 条，不设 `NODE_ENV` 和 `NODE_ENV=production` 各跑一遍都通过。`eslint scripts/swarm tests .github` 通过，`check-line-limit` 通过。

### workflow 要点

- 触发：`pull_request`（路径限 `packages/core/**`、`packages/themes/**`、`apps/docs/components/demos/**`），以及 `workflow_dispatch`（输入 `components`）。
- 并发：`visual-compare-${PR 号 || run_id}`，`cancel-in-progress: true`。手动运行用 run_id 单独成组，互不取消。
- 权限：workflow 级只有 `contents: read`、`pull-requests: write`。
- 步骤：checkout（`fetch-depth: 0`）→ pnpm → Node 22.18.0 → `pnpm install --frozen-lockfile` → **先算组件** → 读 playwright 版本 → `actions/cache` 缓存 `~/.cache/ms-playwright`（键里带版本号）→ 没命中时 `pnpm exec playwright install --with-deps --only-shell chromium`，命中时只 `playwright install-deps chromium` → `pnpm build:packages` → `visual-ci.mjs --no-proxy` → 上传附件（14 天）→ 生成评论并写进运行摘要 → 写 PR 评论。
- `count` 为 0 时，装浏览器、构建、截图、上传都跳过。评论这一步只更新已有的旧评论，不新发。
- 上传、生成评论、写评论都用 `!cancelled()`，所以工具崩溃时已经跑完的组件照样上传、照样报告，job 最后才变红。
- fork PR：写评论那一步用 `head.repo.full_name == github.repository` 跳过。Dependabot 这类只读 token 的情况，在脚本里 `try/catch` 降级成 `core.warning`。两种情况评论内容都在运行摘要里能看到。
- 手动输入的组件名经 `env` 传进 shell，不直接用 `${{ }}` 拼进脚本，避免脚本注入（actionlint 也会检查这一点）。

### 和计划不一样的地方

1. **装浏览器用 `pnpm exec playwright install --with-deps --only-shell chromium`，没有用 `npx`。** `pnpm exec` 调用的是 lock 文件里的那个 playwright（1.63.0），一定和运行时一致。`npx` 在 pnpm 项目里也能找到本地包，但 `pnpm exec` 更直接。`--only-shell` 是因为工具用 `headless: true`，Playwright 1.49 起无头模式用的是 `chromium-headless-shell`，不需要完整 Chromium，下载量小很多。
2. **多加了一个 `visual-ci.mjs`。** 计划里第 7 步写的是「逐个组件跑 `pnpm visual`」。直接这样做，每个组件都会自己起一次、关一次文档站（每次冷启动要几十秒到一分多钟），而且组件名拼错要等起完服务、开完浏览器才报错。我把「预检」和「共用一次文档站」都放在这一层，A2 的工具一行没改。
3. **公共文件的范围比计划表格多了几项。** 除了 `neutral.css`、`composables/**`、`Theme/**`、`reset.css`，还加了：`packages/themes/fonts.css`、`packages/core/styles.css`、`packages/core/src/layer/**`、`packages/core/src/locale/**`，以及**找不到同名组件的样式文件**（`bordered-control.css`、`pressable.css`、`motion.css`、`scrollbars.css`、`neutral/input.css`、`neutral/checkbox.css`、`neutral/base.css` 等）。这些都是多个组件共用的。按计划「其它文件不触发」的话，改了 `neutral/input.css` 这种影响所有输入框的文件反而一个都不跑，不合理。
4. **评论里的尺寸差用 CSS 像素。** A2 的 report.json 里窄屏尺寸是 2 倍像素。评论表格把桌面和窄屏放在同一行，除回 CSS 像素才能直接比较。

## 2. 组件映射规则

| 改了什么 | 跑哪些组件 |
| --- | --- |
| `packages/core/src/<Dir>/**` | 目录同名的主组件（有文档页才算）。改的是 `<Name>.vue` 且 `<Name>` 有文档页时再加上 `<Name>`：比如 `DropdownMenu/DropdownMenuItem.vue` → `DropdownMenu`、`DropdownMenuItem`；`Button/ButtonSpinner.vue`（没有自己的页面）→ 只有 `Button`。目录本身没有同名页面时（`Indicator/`、`Resizable/`、`Scrollbars/`），取目录里所有有页面的 `.vue`。 |
| `packages/core/styles/<kebab>.css`、`packages/themes/neutral/<kebab>.css` | `toUpstreamName(kebab)` 有文档页就跑它；没有就算公共文件。 |
| `apps/docs/components/demos/<slug>/**` | slug 对应的组件（有文档页才算）。 |
| 公共文件（上表第 3 条） | 代表组件。 |
| 测试文件（`*.test.ts`、`*.fixtures.ts`、快照）和其它路径 | 不触发。其它主题（butter、stone 等）也不触发，因为对照只看 neutral。 |

「有文档页」= `apps/docs/docs/en/components/<slug>/index.md` 存在，也正是对照工具打开的那一页。

排序：直接改到的组件在前，代表组件在后，去重后取前 8 个，其余进 `skipped`，评论里列出来，并提示可以手动运行补上。

**代表组件**（写在 `REPRESENTATIVE_COMPONENTS`，代码里有每一项的理由）：

- `Button`：最基础的按压控件，颜色、圆角、字号、焦点环都在上面。
- `TextInput`：输入框描边、占位文字、输入类 token。
- `Selector`：触发器加弹出列表，同时覆盖输入控件和浮层。
- `Dialog`：遮罩、阴影、层级、标题排版。
- `DropdownMenu`：菜单项、分隔线、选中标记，代表浮层定位和菜单 token。
- `Table`：边框、间距、密集排版，最容易暴露间距和字体度量的变化。

测试里核对了这 6 个在真实仓库里都有文档页；本地也用 curl 确认了上游 6 个页面都返回 200。

## 3. 本地演练

### 3.1 完整链路：Button + Badge

```sh
node scripts/swarm/changed-components.mjs packages/core/src/Button/Button.vue packages/core/src/Badge/Badge.vue --out /tmp/e4-visual/plan.json
# → components: [Button, Badge]
env -u NODE_ENV node scripts/swarm/visual-ci.mjs --plan /tmp/e4-visual/plan.json --out /tmp/e4-visual --port 5174 --proxy http://127.0.0.1:7890
# → 两个组件 8 个组合全部成功，退出码 0，用时约 11 分钟（本机经代理访问上游较慢）
node scripts/swarm/visual-comment.mjs --summary /tmp/e4-visual/summary.json \
  --artifact-url https://github.com/astryx-vue/astryx-vue/actions/runs/123/artifacts/456 \
  --run-url https://github.com/astryx-vue/astryx-vue/actions/runs/123
```

文档站用的是 5174 端口，跑完自动关掉了（`lsof -tiTCP:5174` 为空）。全程只开了 1 个浏览器，通过 A2 的锁排队。附件和运行记录的链接是演练时填的假地址。

生成的评论原文：

```markdown
<!-- astryx-visual-compare -->
## 视觉对照：上游 vs 我们

这条评论只报告差异，**不会让 CI 变红**。

- 分数是「内容区里不同像素的百分比」：低于 2% 基本一致，2% 到 10% 要看图，高于 10% 明显不同。最终以看图为准，两边 demo 文案不同也会拉高分数。
- 分数下面是预览区的尺寸差：我们减上游，单位是 CSS 像素。

| 组件 | desktop-light | desktop-dark | mobile-light | mobile-dark |
| --- | --- | --- | --- | --- |
| Button | 61.08% 不同<br>尺寸相同 | 64.11% 不同<br>尺寸相同 | 28.99% 不同<br>宽 +12，高 +160 | 36.24% 不同<br>宽 +12，高 +160 |
| Badge | 43.45% 不同<br>尺寸相同 | 48.13% 不同<br>尺寸相同 | 29.47% 不同<br>宽 +12，高 +160 | 31.71% 不同<br>宽 +12，高 +160 |

对照图：[下载附件](https://github.com/astryx-vue/astryx-vue/actions/runs/123/artifacts/456)（保留 14 天，要登录 GitHub 才能下载）。每个组件一个目录，`side-by-side.png` 左边是上游，右边是我们。

运行记录：https://github.com/astryx-vue/astryx-vue/actions/runs/123
```

### 3.2 失败路径：拼错的名字 + 截图失败

手动名单 `Buton,AspectRatio`：

- `Buton` 在预检阶段就被跳过（我们没有 `buton/index.md`），没有访问上游，没有开浏览器。
- `AspectRatio` 的 desktop-light 成功；其余 3 个组合在本机因为代理访问上游超时（`page.goto: Timeout 60000ms`）。这是本机网络的问题，不是工具的问题，但正好验证了「组合失败写进报告、其它照跑、退出码 0」。

评论里对应的部分：

```markdown
| Buton | 没跑成 | 没跑成 | 没跑成 | 没跑成 |
| AspectRatio | 71.78% 不同<br>尺寸相同 | 失败 | 失败 | 失败 |

对照图附件没有上传成功，请到运行记录里看日志。

### 没跑成的组件

- `Buton`（跳过）：我们的文档站没有这个页面：apps/docs/docs/en/components/buton/index.md

### 截图失败的组合

- `AspectRatio` desktop-dark：page.goto: Timeout 60000ms exceeded. Call log: - navigating to "https://astryx.atmeta.com/components/AspectRatio", waiting until "load"
（mobile-light、mobile-dark 同上）
```

这次演练发现了 Playwright 报错里带终端颜色控制符的问题，已经在评论生成里去掉，并加了测试。

### 3.3 其它

- 只改 `README.md` → `count=0`，评论只有一句「这次的改动没有涉及有文档页的组件，没有跑视觉对照」。
- 只改 `packages/themes/neutral.css` → `count=6`，6 个代表组件。
- 本地演练中途修了一个问题：预检开启全局代理后，等待本地文档站就绪的 `fetch` 也被送进了代理，导致 180 秒超时。已在全局代理里排除 `localhost,127.0.0.1,::1`。CI 上用 `--no-proxy`，不会走这段代码。

## 4. actionlint

- 版本：actionlint 1.7.12（官方 release 二进制，放在 `/tmp/actionlint/`），已装 shellcheck 0.11.0，所以 `run:` 里的 shell 也一起检查了。
- `actionlint .github/workflows/visual-compare.yml`：**0 个问题**。
- 顺带看了一遍全部 workflow：现有 `docs.yml`（`github.head_ref` 直接拼进脚本）和 `release.yml`（SC2016 info）各报 1 条，都是已有文件的问题，按计划不改。

### 按 GitHub 文档核对

- **action 都锁定了提交哈希**，并且在 2026-10-20 用 `git ls-remote` 核对过 tag 和哈希一致：
  - `actions/checkout@11d5960a…` v4.4.0、`pnpm/action-setup@fc06bc12…` v4.4.0、`actions/setup-node@49933ea5…` v4.4.0：和 release.yml 相同。
  - `actions/cache@caa29612…` v5.1.0（node24）
  - `actions/upload-artifact@cf430e03…` v7.0.2（node24，有 `artifact-url` 输出）
  - `actions/github-script@ed597411…` v8.0.0（node24）
  - 选 node24 的版本，是因为 GitHub 正在淘汰 node20 运行时。
- **权限最小**：只有 `contents: read`（checkout）和 `pull-requests: write`（评论）。上传附件、读写缓存不需要额外权限。PR 评论走的是 issues 接口，GitHub 文档写明 PR 评论用 `pull-requests: write` 即可。
- **fork PR 不报错**：`pull_request` 事件里 fork 拿到的是只读 token。评论那一步在 `if` 里按 `head.repo.full_name` 跳过；其它只读情况被 `try/catch` 降级成警告。

## 5. 只能推到 GitHub 后才能验证的

1. **GitHub 的机器直连上游**是否稳定（会不会被上游的防护拦住），以及 8 个组件在 45 分钟内是否跑得完。本机走代理时 2 个组件用了约 11 分钟，主要慢在访问上游。
2. `ubuntu-latest` 上 `playwright install --with-deps --only-shell chromium` 和缓存命中后的 `install-deps` 是否都正常；缓存路径 `~/.cache/ms-playwright` 是否对。
3. Linux 上的字体渲染和本机 macOS 不同，分数会和本地不一样。这对「只报告」没有影响，但不能拿本地分数去对照 CI 分数。
4. `upload-artifact` 的 `artifact-url` 输出能不能正确填进评论。
5. 评论第一次新建、之后原地更新（靠隐藏标记）；同一个 PR 连续推送时旧运行被取消。
6. fork PR 跳过评论、Dependabot PR 降级成警告的实际表现。
7. `workflow_dispatch` 手动输入组件名的表现，以及运行摘要里的评论内容。
8. `pull_request` 的 `base.sha...head.sha` 在 `fetch-depth: 0` 下能算出正确的改动列表。
