# E4 验收报告 · 第 1 轮

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E4`，分支 `sync/e4-ci-visual`，实现者提交 `a5fcfe5`（BASE = HEAD~1）
- 结论：**通过**（22 项全部通过）
- 开始和结束的 `git status --short` 都是空的，两次一致。临时文件都在 `/tmp/verify-E4/`。
- 浏览器纪律：全程同一时刻只开 1 个浏览器（`pgrep -fl chrome-headless-shell` 演练中为 4 个同属一次会话的进程，演练前后均为 0），文档站用 5174。

## 检查表

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1a | `Button/Button.vue` → Button | 过 | 实测输出 `c:["Button"]` |
| 1b | `styles/dropdown-menu.css` → DropdownMenu | 过 | 实测 `["DropdownMenu"]` |
| 1c | `demos/text-input/overview.vue` → TextInput | 过 | 实测 `["TextInput"]` |
| 1d | `themes/neutral.css` → 代表组件 | 过 | 实测正好是 `Button,TextInput,Selector,Dialog,DropdownMenu,Table`，`broadFiles` 含该文件 |
| 1e | `README.md`、`scripts/foo.mjs` → 空 | 过 | 实测 `c:[],s:[],b:[]` |
| 1f | 10 个组件只跑 8 个，另 2 个明确列出 | 过 | 输入 Button/Badge/Avatar/Banner/Card/Dialog/Divider/Heading/Link/Kbd；输出 8 个要跑，`skipped:["Link","Kbd"]`，stderr 写「超过 8 个，这次没跑：Link, Kbd」。评论里有「这次没跑」小节（测试 `列出这次没跑的组件` 覆盖） |
| 1g | 按实际（扩大后）规则核对公共文件 | 过 | `styles/bordered-control.css`（无同名页）→ 代表组件，并标为公共文件；`ButtonSpinner.vue` / butter 主题 / `*.test.ts` 的行为也符合 impl 说明。扩大范围合理：多组件共用的样式文件改动不该一个都不跑 |
| 2 | 名字、slug 换算复用 `names.mjs` | 过 | `changed-components.mjs:27` 导入 `toSlug, toUpstreamName`，`visual-ci.mjs:24`、`visual-comment.mjs:14` 也从同一处导入；文件内没有另写换算 |
| 3 | 代表组件名单在配置里并写了理由 | 过 | `REPRESENTATIVE_COMPONENTS`（第 44 行）上方注释逐项写了理由；测试确认 6 个都有文档页 |
| 4 | 本地完整链路：Button + Badge，四种组合都出图，评论里有两个分数表 | 过 | 运行了 3 次（`out`、`out2`、`out3`）。前两次经代理访问上游时有 `page.goto Timeout 60000ms`，个别组合失败（退出码仍为 0，评论标「失败」，正是预期的降级）；`out3` 8 个组合全部成功，评论 `/tmp/verify-E4/comment3.md` 含 Button、Badge 两行分数表（Button 61.08/64.11/28.99/36.24%，Badge 43.45/48.13/29.47/31.71%）。网络超时我用 curl 复测（200，约 5 秒），判定是本机代理慢，不是工具问题 |
| 5 | 读 side-by-side 图 | 过 | Button 图：左为 UPSTREAM，右为 OURS，同一个预览区（居中的按钮行）。Badge 图同理；两边 demo 内容不同（上游一组徽章、我们一个 New），这是 demo 差异，不是截错区域 |
| 6 | 上游不存在的组件：标失败，其它照常，退出码 0，不为它开浏览器 | 过 | 输入 `Buton,Button,Badge`：日志先出现「[visual-ci] 跳过 Buton：我们的文档站没有这个页面」，之后才启动文档站；`out3/` 里只有 Button、Badge 目录，没有 Buton；运行前 headless 进程 0 个，运行中 4 个（属于 Button/Badge 的单次会话，同一时刻只有 browser-1 一把锁）；`EXIT=0`；评论里 `Buton` 行全部「没跑成」，并有「没跑成的组件 → Buton（跳过）」 |
| 7 | 跑完后锁空、5174/5172 无监听、无残留进程 | 过 | 三次演练后各查一次：`swarm-locks` 为空，`lsof -iTCP:5174 -iTCP:5172` 无输出，`pgrep chrome-headless-shell` 0 个，无 visual-ci / vitepress 进程 |
| 8 | 评论是纯函数、隐藏标记、失败/没跑有专门写法、中文 | 过 | `buildVisualComment` 不读文件不碰网络；`COMMENT_MARKER = '<!-- astryx-visual-compare -->'` 在第一行；有「没跑成的组件」「截图失败的组合」「这次没跑」「为什么跑了代表组件」小节；全是中文；测试 12 条覆盖 |
| 9 | 评论 Markdown 表格语法 | 过 | 3 份评论 `.md` 的表格行按 `\|` 切分列数全部一致（头、分隔、数据行同为 7 段），单元格里的换行用 `<br>`，不破坏表格 |
| 10 | workflow 静态检查 | 过 | `actionlint` 1.7.12（本机已装，带 shellcheck）检查 `visual-compare.yml`，输出为空、退出码 0 |
| 11 | `uses:` 锁 40 位哈希并注释版本号 | 过 | 6 个 `uses:` 都是 40 位哈希加 `# vX.Y.Z`；我用 `git ls-remote --tags` 逐个核对，哈希和注释里的 tag 一致（checkout v4.4.0、cache v5.1.0、upload-artifact v7.0.2、github-script v8.0.0、setup-node v4.4.0、pnpm/action-setup v4.4.0） |
| 12 | 权限最小 | 过 | 只有 `contents: read`、`pull-requests: write` |
| 13 | 触发路径、并发取消、手动触发 | 过 | `pull_request.paths`：`packages/core/**`、`packages/themes/**`、`apps/docs/components/demos/**`；`concurrency.group = visual-compare-${PR 号 \|\| run_id}`，`cancel-in-progress: true`；`workflow_dispatch` 有 `components` 输入，经 env 传入不拼进脚本 |
| 14 | fork PR 写不了评论不致 job 失败 | 过 | 评论步骤 `if` 含 `head.repo.full_name == github.repository`，fork 直接跳过；其余只读 token 情况脚本里 `try/catch` 降级成 `core.warning`；注释写明了理由 |
| 15 | 浏览器缓存、版本跟随 lock | 过 | 版本取自 `require('playwright/package.json').version`（本地为 1.63.0，lock 同为 1.63.0）；缓存键含该版本；安装用 `pnpm exec playwright install`，没有写死别的版本；`--only-shell`、`--with-deps` 都是 `playwright install --help` 里有的选项，工具里是 `headless: true`，只需要 headless shell，偏离 1 合理 |
| 16 | 附件有保留天数、评论里有链接 | 过 | `retention-days: 14`；评论用 `steps.upload.outputs.artifact-url` 生成「下载附件」链接（`--artifact-url` 实测出现在评论里）；没有链接时写「附件没有上传成功」 |
| 17 | 分数不会让 job 失败 | 过 | 逐个看会返回非 0 的步骤：`visual-ci.mjs` 只在「没写出 report.json」或文档站起不来时返回 1（实测组合失败、组件跳过、网络超时时都是 0）；评论分数根本不参与退出码；上传、评论步骤用 `!cancelled()`，评论写入出错降级为 warning。唯一会变红的是安装/构建失败和工具崩溃，属于真故障 |
| 18 | 没代理时能工作 | 过 | workflow 传 `--no-proxy`；`visual-ci.mjs` 的 `proxy = values['no-proxy'] ? undefined : values.proxy`，不给 `--proxy` 时不会回落到 127.0.0.1:7890，并向子进程传 `--no-proxy`；`args.mjs` 里 `--no-proxy` → `proxy: undefined`，`visual-compare.mjs:49` 只在 proxy 有值时加代理。`useProxyForFetch` 在无 proxy 时直接返回 |
| 19 | 新增 3 个测试文件在两种 NODE_ENV 下通过 | 过 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2 tests/changed-components.test.ts tests/visual-comment.test.ts tests/visual-ci.test.ts`：3 文件 67 条通过；`NODE_ENV=production` 同样 67 条通过 |
| 20 | 完整 `pnpm check`（test 换成 `vitest run --maxWorkers=2`） | 过 | 逐项跑：`check:packages`（含 line-limit）通过；`lint`（`--max-warnings 0`）通过；`typecheck` 通过；`vitest run --maxWorkers=2` 2608 条全部通过；`build` 完成；`lint:pkg` 通过 |
| 21 | 行数、不动其它文件 | 过 | 新源码：changed-components 199、visual-ci 208、visual-comment 177，都低于 500 行；`git diff HEAD~1 --stat -- docs.yml release.yml scripts/swarm/visual-compare* browser-lock.mjs` 无输出，即没有改动；`.gitignore` 只加了 `visual-out/` |
| 22 | 「只能等推到 GitHub 后验证」逐条判断 | 过 | 1 上游直连稳定性、2 ubuntu 上装浏览器和缓存、3 Linux 字体分数、4 `artifact-url` 输出、5 评论新建/更新和取消旧运行、6 fork/Dependabot 实际表现、7 手动运行摘要，都依赖 GitHub 运行环境，本地确实无法验证。第 8 条「base...head 改动列表」其实本地能验：我用 `--base HEAD~1 --head HEAD` 和 `HEAD~5` 跑通（改动只含脚本和测试，结果为「无」，符合规则），`git diff base...head` 的语法正确；`fetch-depth: 0` 的作用也合理。该条本地验证后，清单列法偏保守但不构成问题 |

## 对 4 处偏离的判断

1. `pnpm exec playwright install --only-shell`：合理，版本和 lock 一致，下载量更小，CLI 选项存在。
2. 多一层 `visual-ci.mjs`：合理，A2 文件未改；预检让不存在的组件不起浏览器（第 6 项实测），共用一次文档站省时间。
3. 公共文件范围扩大：合理，我实测 `bordered-control.css` 触发代表组件；改共用样式却一个组件都不跑才是漏洞。
4. 评论尺寸用 CSS 像素：合理且数值正确。窄屏原始尺寸上游 684×320、我们 708×640（2 倍像素），评论里写「宽 +12，高 +160」，换算正确。

## 其它观察（不影响结论）

- 本机经代理访问上游较慢，一个组件的四个组合偶尔会 60 秒超时。工具把它当「失败」报告而不是拦截，符合「只报告」的目标。GitHub 上直连是否稳定只能到那里再看。
- `visual-comment.mjs` 里「一次最多跑 N 个」用的是 `plan.components.length`，在 8 个满额时写 8，正确。
