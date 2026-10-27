# A4 蜂群基础设施 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A4`，分支 `sync/a4-swarm-infra`。只在本地提交，没有推送。
- 已用自己的 `worktree.mjs rebase A4` rebase 到最新 `swarm-tree`（`4fbc38c`），没有冲突。
- 提交：
  - `2c94162` feat: 新增进度看板脚本 status.mjs，检查并改写 ROADMAP 节点状态
  - `b514700` feat: 新增节点工作区脚本 worktree.mjs，负责建删、槽位、rebase 与复核合入
  - `5267db6` feat: 重新生成上游台账时保留勾选和备注
  - `1d64c31` fix: 视觉对照只排除圆角、起服务前预检页面、端口跟随槽位
  - `64d12d6` fix: 测试的模板编译也固定在开发模式，不受外部 NODE_ENV 影响
  - `6a180b9` docs: 新增计划与回报模板，规程改用 status 和 worktree 命令
- 主仓库的 `ROADMAP.md` 没有动。SWARM.md 改的是工作区里那份，随分支提交。

## 1. 工具用法和关键设计

完整用法写在 `scripts/swarm/README.md` 末尾两节。

### 1.1 `scripts/swarm/status.mjs`

```sh
node scripts/swarm/status.mjs check | ready | show
node scripts/swarm/status.mjs set <节点> <状态> [--round N] [--impl 名字] [--verify 名字] [--result 文本] [--pr 文本] [--force] [--dry-run]
# 通用选项 --file <路径>，默认是本工作区的 ROADMAP.md
```

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `status.mjs` | 175 | 命令行：解析参数、调度子命令、原子写盘。`runStatus()` 返回 `{code, stdout, stderr}`，方便测试 |
| `status/states.mjs` | 86 | 9 个状态的 emoji、中文名、英文简写和别名，以及生命周期图的合法流转 |
| `status/roadmap.mjs` | 165 | 只解析 mindmap 代码块和「当前状态总表」，每个节点记下行号；展开依赖简写 |
| `status/model.mjs` | 192 | 只读的判断：check、下游数量、ready 两张清单、show 摘要 |
| `status/edit.mjs` | 127 | set 的改写和三道自检 |

关键设计：

- **只改目标行**。mindmap 里只替换 emoji 那几个字符，缩进和名称原样保留。总表那一行按原有格式重新拼（`| a | b | | |`）。其它行不碰，CRLF 也保留。
- **写入前三道自检**，任何一道不过就抛错、不写盘：
  1. 行数不变，变化的行正好是计划要改的那些行。
  2. 重新解析新文本，目标节点（以及被解锁的下游）的状态和字段读回来都对。
  3. 新文本跑一遍 check，不能出现改之前没有的问题。
- **写盘**：先确认文件在读取后没被别人改过，再写临时文件、rename。
- **自动解锁**：节点变成「已完成」或「不做」时，依赖它、且依赖已经全部结束的「未开始」节点，自动改成「可开工」。「不做」也算依赖结束，这是我加的；计划只说了「已完成」。
- **流转合规**：按 SWARM.md 的生命周期图检查流转（比如「实现中」不能直接跳到「已完成」），依赖没完成的节点也不能开工。`--force` 可以放行。这一条是计划之外加的，用来防止手滑把看板改错。
- **依赖简写**：
  - `C全部` 展开为总表里所有 C 开头的节点。
  - `F3a–F3e` 和 `C1-C5` 支持字母区间和数字区间，`–` 和 `-` 两种连字符都认。
  - 展开出不存在的节点时，报「依赖不存在」。
- **check 的内容**：
  - 两边节点集合相同，没有重复。
  - 状态写法合法，emoji 和总表状态一致。
  - 依赖都存在，不依赖自己，没有成环。
  - 「可开工」及之后的节点，依赖都已「已完成」或「不做」。
- **ready 的两张清单**：
  - 依赖全部结束、还标着「未开始」的节点（该解锁）。
  - 已经「可开工」、等着派发的节点。
  - 两张都按全部下游数从多到少排（含间接下游）。数量相同时按总表顺序。只有第一张的话，现在的输出永远是空的，没有派活价值，所以加了第二张。
- **状态名**：中文名、英文 key、别名、emoji、`🔷 验收中` 写法都接受，`--help` 会全部列出。

### 1.2 `scripts/swarm/worktree.mjs`

```sh
node scripts/swarm/worktree.mjs new <节点ID> <简短名> [--slot N] [--no-install]
node scripts/swarm/worktree.mjs ls
node scripts/swarm/worktree.mjs rm <节点ID> [--force]
node scripts/swarm/worktree.mjs adopt <节点ID> <槽位>
node scripts/swarm/worktree.mjs rebase <节点ID>
node scripts/swarm/worktree.mjs merge <节点ID> [--keep]
```

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `worktree.mjs` | 146 | 命令行和输出文字 |
| `worktree/git.mjs` | 124 | 子进程和 git 封装（子进程去掉 NODE_ENV）、仓库布局、worktree 列表 |
| `worktree/slots.mjs` | 112 | 槽位登记的读、占（`wx` 原子创建）、放；`slotPortFor()` 给视觉对照查端口 |
| `worktree/workspaces.mjs` | 199 | new / adopt / rm / ls |
| `worktree/integrate.mjs` | 234 | rebase（生成文件冲突自动处理）、merge（合并锁、检查、fast-forward） |

关键设计：

- **槽位要算上已有的工作区**。`../astryx-vue-wt/` 下目录名是节点 ID、但没登记槽位的 worktree，也算占位。
  - 这时脚本不知道哪个号是空的，会拒绝自动分配，提示用 `adopt` 补登记，或者用 `--slot` 指定。
  - 「空位数 − 未登记数 ≤ 0」时直接报「4 个槽位都被占了」。
  - `adopt` 是计划之外加的，用来接入手工建的旧工作区（A4、E4、F0）。
- **new 失败回滚**：装依赖等任何一步失败，都会删掉工作区、分支，释放槽位。
- **rm**：
  - 工作区有未提交的改动、或分支没合入时拒绝，`--force` 才删。
  - 槽位登记了、工作区已经不在的旧条目也能清掉。
  - 顺手删掉这个工作区里已经退出的进程留下的浏览器锁。
- **rebase**：
  - 工作区必须干净，不能有没做完的 rebase。
  - 冲突全部在生成文件上时：取节点这一边（rebase 里的 theirs），`git add`，跑 `pnpm sync`，再把 sync 的改动加进暂存区，然后 `rebase --continue`。
    - 如果 sync 改到了生成范围以外的文件，就停下。范围是生成清单加上 `packages/core/package.json`。
    - 重新生成后变成空提交的，自动 skip。
  - 有任何非生成文件冲突，就 `rebase --abort`，分支回到原样，报出冲突文件。
  - 生成文件清单通过 `scripts/sync-exports.mjs` 新导出的 `generatedFiles(rootDir)` 取得，没有另写一份。我把原来的 `generatedFiles` 拆成两部分：
    - `generatedFiles`：整份都是生成的文件。
    - `syncOutputs`：在前者基础上加上 package.json 的 exports。`pnpm sync` 的行为不变。
- **merge**：
  1. 拿合并锁 `swarm-locks/merge`。同一时刻只有一个 merge，持锁进程不在了就回收。
  2. rebase。
  3. 在节点工作区里依次跑 6 步检查，每步都去掉 NODE_ENV。
  4. 检查后工作区必须仍然干净。
  5. 核对节点分支和基线在检查期间都没有变化。
  6. fast-forward。基线在某个工作区里检出（就是主工作区）时，在那里 `merge --ff-only`，文件跟着更新；否则用 `update-ref` 加旧值做比较交换。
  7. 删工作区，释放槽位。
  - 任何一步失败都停下，不合入。
  - 检查命令和 sync 命令都可以替换，方便测试。
  - `rm` 和不带 `--keep` 的 `merge` 不能在要删的那个工作区里执行。

### 1.3 模板 `.agents-work/upstream-sync-0.7.1/templates/`

- `plan.md`：照 SWARM.md 的必填项写。
  - 包含「上游这条改动让用户看到或感受到了什么」「有没有更适合 Vue 的做法」两节，排在实现步骤之前。
  - 内置环境纪律、浏览器纪律、端口、`worktree.mjs new` 的用法。
- `verify.md`：
  - 环境一节写了 NODE_ENV 两遍、浏览器锁、端口查法（`worktree.mjs ls`）和只读铁律。
  - 检查项分四块：效果一致、反向挑刺、C 节点 6 条通用检查（逐条对应 ROADMAP）、整体。
- `impl-report.md`、`verify-report.md`：参考 A1、A2、A3、E1 的回报结构，固定了各节的标题。

## 2. 遗留问题逐条处理

| # | 问题 | 怎么修的 |
| --- | --- | --- |
| 1 | 窄屏内容框漏掉贴边内容 | `image.mjs` 新增 `isOutsideCorner()`，只排除四个角上圆弧外的像素（半径 32，再往圆内让 2 像素躲抗锯齿），四条边的中段照常计算。用 A2 验收留下的截图复算：上游 mobile Button 的内容框从 `x:32,w:620` 变成 `x:0,w:684`，桌面 12 张图的结果完全不变。新增 2 条测试 |
| 2 | README 选择器和代码不一致 | README 改成代码里实际用的 `[data-astryx-theme="neutral"]:first-child > .astryx-card:only-child`，并写明「第一个子元素带内联 aspect-ratio 或 min-height」这个附加条件 |
| 3 | 组件名拼错报错太晚 | 新增 `visual-compare/preflight.mjs`，在起服务、拿锁之前检查：<br/>- 我们这边看 `apps/docs/docs/en/components/<slug>/index.md` 在不在，不用起服务。<br/>- 上游发一次 HTTP GET；走代理时用 CONNECT 隧道，本机地址不走代理，跟随最多 3 次跳转。<br/>只有「确定不存在」（文档页不在，或上游返回 404/410）才拦下。网络不通、5xx 只打印提示，交给浏览器那一步去报。新增 5 条测试，包括一个本机 HTTP 服务的真实请求 |
| 4 | README 提醒 `--out /tmp/...` | 「一句话用法」改成带 `--out /tmp/<节点>-visual`，下面加了醒目提示，参数表也写了 |
| 5 | 测试受外部 NODE_ENV 影响 | 见下面 2.1 |

额外改动：`pnpm visual` 新增 `--port`。默认用本工作区在 `worktree.mjs` 里登记的槽位端口，没登记时才用 5172。原来端口写死成 5172，不同槽位的工作区会抢同一个端口，和 SWARM 的「端口 = 5170 + 槽位号」冲突。

### 2.1 第 5 条：测试的模板编译也固定在开发模式

查到的根因比 A3 回报里写的更准确一些：

- `vitest.config.ts` 里确实有 `process.env.NODE_ENV = 'test'`。
- 但配置文件会先被打包，静态 `import viteConfig from './vite.config.ts'` 里的 `import vue from '@vitejs/plugin-vue'` 会被提到这一行之前执行。
- plugin-vue 一加载就会 `import { computed } from 'vue'`，vue 的入口按当时的 NODE_ENV 选择 `compiler-core.cjs.prod.js` 或 `cjs.js`。
- 所以模板编译跟着外部环境走。我做过探针确认：在配置顶部先设 NODE_ENV，再用动态 `import('@vitejs/plugin-vue')` 加载，最终加载的就是 `compiler-core.cjs.js`。

我没有采用计划建议的 `template.compilerOptions.comments: true`。只开 comments 能保留注释，但生产版编译器的其它差异还在：比如不打 `DEV_ROOT_FRAGMENT` 标记、不做开发期检查。用错误版本的编译器，这个根因并没有消除。

实际做法：

- `vite.config.ts` 改成函数式配置，在函数里 `await import('@vitejs/plugin-vue')`。
- `vitest.config.ts` 改成 `defineConfig(async env => mergeConfig(await viteConfig(env), ...))`，NODE_ENV 那一行保留，注释写清两件事的原理。
- 结果：运行时和模板编译都由 `vitest.config.ts` 里的那一行决定，和外部 NODE_ENV 无关。
- 新增 `tests/test-env.test.ts`，夹具组件是 `tests/fixtures/LeadingComment.vue`。它检查三件事：
  - 运行时是 test 模式。
  - 根节点前的注释保留下来，subTree 带有 `DEV_ROOT_FRAGMENT` 标记。
  - 透传属性仍然落在真实元素上。
  - 有效性已确认：把两个配置文件还原后，用 `NODE_ENV=production` 跑这个测试，Fragment 那一条失败；改完以后两种模式都通过。

连带修复的测试：**无**。改完以后，两种模式的全量测试一次就全部通过（见 4.5）。说明现在仓库里没有和 ResizeHandle 同类、只在开发模式下才失败的测试：A3 已经修了 ResizeHandle，这次两种模式下都是开发版编译器，结果一致。

release.yml 的 `test-under-production-env` job：保留，只更新了注释。现在它守的是两条线：NODE_ENV 那一行，以及「插件必须动态加载」。只有外部真的带着 `NODE_ENV=production` 时，`test-env.test.ts` 才能抓到回退，所以不能简化掉。

## 3. 用真实 ROADMAP 跑 `status.mjs check`

```
ROADMAP 一致：60 个节点，树状图与总表状态相同，依赖都满足。（exit 0）
```

rebase 前后各跑了一次，都通过。rebase 后的 `ready` 输出：

```
没有需要改成「可开工」的节点。
已是「可开工」、等待派发（按下游数量排序，这就是派活顺序）：
  D4a  CLI 能力对照与取舍（下游 5 个）
  E3   可访问性自动检查（下游 0 个）
```

## 4. 自测清单

| # | 项目 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 真实 ROADMAP `check` | 过 | 见第 3 节 |
| 2 | `ready` 和人工判断一致 | 过 | 我自己读的总表：非「未开始」的节点是 A1–A3 ✅、A4 🟡、D4a 🔵、E1 E2 ✅、E3 🔵、E4 🔷、F0 🟡。「未开始」节点的依赖都包含没做完的 A4、F0、B*、C* 等，所以没有该解锁的节点。「可开工」只有 D4a 和 E3。D4a 的下游是 D4b、D5、D6、D8、G2，共 5 个；E3 没有下游。和输出一致 |
| 3 | 在 `/tmp` 副本上跑 set 和自动解锁，用 diff 核对 | 过 | 依次执行：`set E4 done --force`、`set A4 awaiting-verify`、`set A4 verifying`、`set A4 done`。`diff` 只有 15 行变化：A4、B1、B2、B3、B5、B7、E4 各自的 mindmap 行和总表行（B4 没动，它依赖 B3）。改完 `check` 通过。另外 `set A4 verifying` 直接从「实现中」跳过去会被拒绝，退出码 1 |
| 4 | 真实仓库 `new ZZ test-a4` → `ls` → `rm` | 过 | 当时实际有 A4、E4、F0 三个未登记的工作区（F0 是总控后来建的，E2 已经合入删除）。<br/>- 不带 `--slot` 时被拒绝：「有 3 个节点工作区还没登记槽位…」。<br/>- `--slot 2` 建好：分支 `sync/zz-test-a4`，槽位 2，端口 5172，pnpm install 4.6 秒，`ls` 正确显示。<br/>- 再建 `ZY --slot 1` 时报「4 个槽位都被占了（已登记 1 个，另有 3 个工作区还没登记槽位）」，没有留下目录和分支。<br/>- `rm ZZ` 删掉了工作区、分支和槽位 2。<br/>- 之后 `git worktree list` 里没有 ZZ，`git branch --list 'sync/z*'` 为空，`swarm-slots/` 已空（空目录也手动删了），`git worktree prune --dry-run` 没有输出 |
| 5 | 两种 NODE_ENV 全量测试 | 过 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`：223 个文件、2603 条用例，全部通过。`NODE_ENV=production` 下：223 个文件、2603 条，全部通过。用例数相同 |
| 6 | 完整 `env -u NODE_ENV pnpm check` | 过 | check:packages、lint、typecheck、vitest（`--maxWorkers=2`）、build、lint:pkg 六步退出码都是 0，build 后 `git status` 干净 |
| 7 | 新源码文件不超过 500 行 | 过 | 最大的是 `integrate.mjs` 234 行，其它都在 200 行以内；改动过的 `image.mjs` 280 行。`check-line-limit` 通过 |
| 浏览器 | `pnpm visual` 验证第 1、3 条 | 过 | 拿 browser-1 锁，端口 5171：<br/>- `pnpm visual Buton --out /tmp/a4-visual --port 5171`：3.4 秒内两边都报「没有这个组件页」，退出码 1，`/tmp/a4-visual` 没有创建，没有起服务、没有拿锁。<br/>- `pnpm visual Button --out /tmp/a4-visual --port 5171`：desktop-dark 和 mobile-dark 成功；desktop-light 和 mobile-light 是上游经代理加载 60 秒超时（网络问题）。<br/>- 单独重跑这两个组合（`/tmp/a4-visual-retry`）后成功。<br/>- 4 种组合的上游 mobile 内容框都是 `x:0, width:684`，贴边的 Primary 按钮被算进来了。我看了 `mobile-light/side-by-side.png`：左边按钮行从最左边开始，右边居中，标签和颜色都对。<br/>- 结束后 5171 没有监听，headless 进程 0 个，两个锁都空闲 |

## 5. 拿不准的地方

1. **状态流转校验比计划严格**。计划只要求「改状态」。我按 SWARM.md 的生命周期图做了校验，比如「实现中」直接改「已完成」会被拒绝，需要 `--force`。总控如果觉得太死，可以放宽 `states.mjs` 里的 `TRANSITIONS`。
2. **现有工作区还没登记槽位**。A4、E4、F0 都是手工建的，现在 `new` 会要求先 `adopt`。总控需要按实际分配补登记一次：建议 `adopt A4 1`、`adopt E4 4`（E4 用过 5174）；F0 的计划里没写端口，可以登记到 2 或 3。登记完就能正常自动分配了。
3. **merge 在主工作区里 fast-forward**。前提是主工作区检出的是 `swarm-tree`，并且对将要更新的文件没有未提交的改动。否则 `git merge --ff-only` 会失败，这时不会合入，脚本会报错。主工作区里平时未提交的 `nodes/*.md` 回报文件，只要不在节点分支的改动范围内，就不受影响。
4. **`ready` 的下游数是全部下游**（含间接下游），不只是直接下游。我认为这才是「卡住的人多」的意思。
5. **E4 节点也写了自己的组件名预检**。E4 计划里说「在你写的那一层先判断组件页存不存在」。合并时如果两层都有预检，会重复一次 HTTP 请求，结果不会冲突，可以以后再收敛。
6. **上游网络偶尔超时**。这次 Button 有两个组合在 60 秒内没加载完，重跑就好了。这和工具改动无关，但验收时可能遇到。
