# D4b CLI 选定能力实现 · 第 2 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D4b`，分支 `sync/d4b-cli-commands`。只在本地提交，没有推送。
- 提交（基于 `e4c36ff2`）：

  - `47459204` feat(cli): catalog 收进主题、初始化指引和升级指南
  - `dee0a05a` feat(cli): 新增 theme 命令，只输出接入指引
  - `00ef8d6b` feat(cli): init 输出接入指引，托管区块提到新包
  - `c5b59bb7` refactor(cli): 主题和 init 的文本输出各自一个文件，format.ts 回到 500 行内
  - `01f4f44a` feat(cli): 新增 upgrade 命令，只输出升级指引
  - `61269646` feat(cli): 新增 doctor 命令，只报告不改文件
  - `bfcbac9d` docs(cli): 中英 README 和文档站 CLI 页补上 theme、upgrade、doctor 与新 init
  - `2d3fea97` docs(cli): init 的命令说明写成现在做的事（先打印指引，再维护区块）

## 1. 做了什么

按计划第 2 步做四个命令。命令形态照 `nodes/D4a/decisions.md` 第 3、6、7 条，验收时定的四点全部照做（`docs --depth` 语义不动、`build.kit` 字段名不动、信封 `package` 不在信封上、`init` 托管区块提到新包并标 canary）。

1. **catalog 扩三块**（`packages/cli/src/generate/` 下三个新文件）：
   - `themes.ts`：主题清单来自 `packages/themes/*.css`（去掉 `data.css`、`fonts.css`），每套主题读同名的中英文档页，取标题、摘要、要引的样式表、`data-astryx-theme` 的值和整页正文。样式表或属性值取不到就报错，不会悄悄出版本。另从 `themes/index.md` 里取出两段讲「怎么加载、怎么局部用」的原文，供 `theme` 命令用。
   - `setup.ts`：`init` 要用的三段内容都从文档页代码块里读——安装包名（`guide/installation.md` 的 `pnpm add` 行）、主题引入那一行（`guide/getting-started.md`）、语言提供那段（`guide/i18n.md`）。
   - `upgrades.ts`：升级指南按 `###` 切成小节（中英各一份），旧名字从页面的标题（`X` is now `Y`、takes `Y` instead of `X`）和 `Removed | Use instead` 表格里提，共 24 条。
   - 另外 `catalog.packages` 每条加了 `version` 和 `description`（取 `package.json`），供 `upgrade`/`doctor`/`init` 用。
2. **`theme`**（`commands/theme.ts`）：不带参数列 7 套主题，一行一个，带一句说明和下一步命令；带名字输出接入四步——引样式、加 `data-astryx-theme`、换主题或局部并用（这两步的原文来自主题索引页）、改完用 `doctor` 验证。slug 和显示名都能用；找不到时报 `ERR_UNKNOWN_THEME` 并给相近名字。
3. **`init`**（重写 `commands/init.ts` + `src/project.ts`）：先打印接入说明（覆盖哪些包、每包的安装命令、主题样式引哪一行、语言怎么提供、改完怎么验证、写代码前查什么），再维护 agent 文件里的受管理区块。安装命令按探测到的包管理器写：`packageManager` 字段 → 锁文件（`pnpm-lock.yaml`、`yarn.lock`、`bun.lock(b)`、`package-lock.json`）→ 都没有就列 pnpm/npm/yarn/bun 四种。canary 包（charts、lab）标「API 可能会变」且写 `@canary`；richtext 按正式包介绍。`--features` 变成可选。
4. **`upgrade`**（`commands/upgrade.ts`）：读项目 `@astryx-vue/core` 的版本，和 catalog 生成时的版本比（不联网）。旧了就打升级指南的每一节（变了什么、以前怎么写、现在怎么写、怎么改），再在项目源码里搜指南里的 24 个旧名字，列出文件与行号；一样就打「不用升级」+ 更新日志链接；没装就给安装命令；版本写法读不出来就说读不出来。只读。
5. **`doctor`**（`commands/doctor.ts`）：五项检查——core 装没装/版本新旧、themes 装没装、vue 是否 3.5 以上、有没有引主题样式表、有没有设 `data-astryx-theme`。每条检查附对应文档页链接，有失败时退出码 1（文本照样打印）。
6. **共用的项目读取**（`src/project.ts`）：`package.json` 解析、包管理器探测、版本解析与比较、按扩展名递归读源码（跳过 `node_modules`、构建产物、隐藏目录，单个文件 256 KB 上限）。三个新命令和 `init` 都走这一份，探测规则只写一次。
7. **只读保证**：`no-write.test.ts` 在一个临时项目里跑完 18 条只读命令，逐条比对文件路径、内容字节和 mtime；再单独验证 `init` 只改 `AGENTS.md` 里标记之间那一段，标记外的文字和 mtime 不变。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/cli/src/commands/theme.ts` | 108 | `theme`：列表和接入四步 |
| `packages/cli/src/commands/init.ts` | 200 | `init`：接入说明 + 受管理区块 |
| `packages/cli/src/commands/upgrade.ts` | 144 | `upgrade`：版本比较、指南小节、旧名字命中 |
| `packages/cli/src/commands/doctor.ts` | 194 | `doctor`：五项检查 |
| `packages/cli/src/project.ts` | 194 | 读项目：package.json、包管理器、版本、源码文件 |
| `packages/cli/src/format-theme.ts` | 39 | `theme` 的文本输出 |
| `packages/cli/src/format-init.ts` | 65 | `init` 的文本输出 |
| `packages/cli/src/format-upgrade.ts` | 73 | `upgrade` 的文本输出 |
| `packages/cli/src/format-doctor.ts` | 36 | `doctor` 的文本输出 |
| `packages/cli/src/generate/themes.ts` | 95 | 生成主题记录与主题说明段落 |
| `packages/cli/src/generate/setup.ts` | 68 | 从文档页提取 `init` 用的片段 |
| `packages/cli/src/generate/upgrades.ts` | 131 | 从升级指南提取小节和旧名字 |
| `packages/cli/src/agents.ts` | 175 | 托管区块加一节 Packages（canary 标注 + `@canary`） |
| `packages/cli/src/spec.ts` | 331 | 四个命令的命令说明、示例、响应类型、错误码 |
| `packages/cli/src/generated/catalog.json` | 生成物 | 加 `themes`、`themeScope`、`setup`、`upgrade`、包的 `version`/`description` |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| `astryx init` / `init run` | 改用户项目：写配置文件、装依赖、改入口 | 只打印指引（装哪些包、引哪行样式、怎么提供语言、怎么验），只维护 `AGENTS.md` 里那一段 | 用户要的效果「AI 知道怎么接进来」一样，但不会因为猜错项目结构而改坏文件（D4a 第 3 条） |
| 上游 `init` 探测包管理器 | 看 `packageManager` 字段与锁文件 | 同口径，顺序：字段 → `pnpm-lock.yaml` → `yarn.lock` → `bun.lock(b)` → `package-lock.json`，都没有列四种写法 | 用户拿到的安装命令和自己的项目一致 |
| `astryx theme add` / `theme use` | 拆子命令，`add` 会往项目里写主题文件 | 一个 `theme` 命令，不带参数列主题，带名字输出四步 | 用户都是「先看有哪些主题，再看怎么用这套」（D4a 第 6 条） |
| `astryx theme list` | 列可选主题，带显示名与说明 | 列表来自 `packages/themes/*.css` + 同名文档页，说明用文档页第一段 | 名称、说明都是包和文档站的真实内容 |
| `astryx upgrade` | 跑 codemod 改代码，读 registry 查新版本 | 只比对「CLI 生成时的 core 版本」，打印升级指南每节 + grep 命中位置 | 用户知道要改什么、在哪改；不改文件，不联网（D4a 第 7 条、D6 暂缓） |
| `astryx upgrade` 用 jscodeshift registry 当迁移清单 | 迁移规则写在 codemod registry | 迁移清单来自 `guide/migration.md` 的小节与 `Removed | Use instead` 表格 | 文档站仍是唯一来源，CLI 不另写一套迁移说明 |
| `astryx doctor` | 检查 astryx.config 可加载、集成包、主题挂点等，会写缓存 | 五项与用户直接相关的检查（版本/样式表/主题属性），只报告，有失败退出码 1 | 用户能得到「哪里没接上」，且命令不留下任何痕迹 |
| 上游 `theme list` 说明主题来源包 | 每个主题带 `package` | 主题都属于 `@astryx-vue/themes`，未加字段 | 现在只有一个主题包，加了就是恒定的值 |
| `19da79e39` doctor 在 CLI 加载失败时失败 | 配置加载失败即报错 | 我们不做配置加载；`package.json` 读不到按「没装」报，不会崩 | 用户同样得到一个明确的失败结论 |

## 3. 和计划不一样的地方

1. **`theme` 的「验证」一步是我们自己的指向**：四步里的前三步（样式表、属性、切换与并用）都是文档站原文，「改完运行 `astryx-vue doctor`」是 CLI 的指引，文档站没有这句。其余三步没有 CLI 自写的说明文字。
2. **`upgrade` 的「最新版」= catalog 生成时的版本**，不是 npm 上的版本：不在命令里联网（本项目的 CLI 一直离线）。文档站写的已发布版本是 0.3.0，仓库里的 `packages/core` 是 0.4.0，所以 `upgrade` 会认为 0.3.0 的项目「旧了」。若验收希望以某个已发布版本为准，改生成时读的字段即可。
3. **旧名字的匹配分了两种口径**：主题挂点名（`progressbar`、`textarea` 这类小写词）只认「对象键」写法（`progressbar: {`），否则会命中每一个 `<textarea>` 标签；属性和选项名（`labelHidden`、`enableEscape`、`variant="default"`）按单词认，camelCase 和 kebab-case 都看。命中上限 200 条，超出时报告里标 `truncated`。
4. **`doctor` 多了一项 `vue-version`**：计划只写了「依赖版本、样式表、主题」三件事，我把 vue peer（3.5.0）也算进「依赖版本」，因为它是最常见的装错。
5. **`init` 的 `--features` 变成可选**：不带参数现在就是「打印指引 + 维护区块」。带 `--features agents` 行为不变，带别的仍然报 `ERR_UNKNOWN_FEATURE`，旧用法和旧文档都不失效。
6. **为了守住 500 行**：`format.ts` 到了 501 行，把主题和 init 的文本输出拆成 `format-theme.ts`、`format-init.ts`；`theme`/`init` 的说明文字改成这两个文件。
7. **托管区块新增一节 Packages**，内容取自 `catalog.packages`（名字、版本、`package.json` 的 description、canary 标记）。区块里还留着原来手写的三步工作流等文字——这部分是 CLI 写给 AI 的指令，不是文档站内容，第 1 步就在，本轮没动。
8. **文档站 `guide/cli.md` 也改了**（中英各一份）：原文写着「这一版不含 theme/upgrade/doctor」，现在不成立了；同时补了三个新命令和 `init` 的新行为。改完重新生成了 catalog。

## 4. 台账处理

本轮 D4 台账中与四个命令相关的条目，处理如下：

- `458ff35b1` 删掉 `astryx layout` 命令组 —— 不适用（我们没有这个命令组，第 1 步已确认）。
- `19da79e39` doctor 在 CLI 无法加载配置时失败 —— 不适用（我们不读 `astryx.config`），用「package.json 读不到按没装报」达到同样的「不静默通过」。
- `d859ae984` 不再读 Astryx 自己的环境变量 —— 不适用（我们本来不读）。
- `a1a6a636f` 删掉主题兼容层（0.7.0）—— 部分适用：我们的主题清单只认 `packages/themes` 当前存在的样式表，旧主题名不会出现在 `theme list` 里。
- 其余 `init`/`theme`/`upgrade`/`doctor` 的条目（codemod registry、主题 build/eject/palette/targets、integration 相关等）属于我们明确不做的功能（`swizzle`、`theme build/eject`、`integration`），建议整条标「不适用：本项目只输出指引，不改用户文件（D4a 第 3 条）」。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/cli` | 过 | 13 个文件、133 条用例 |
| 2 | `env NODE_ENV=production pnpm exec vitest run --maxWorkers=2 packages/cli` | 过 | 13 个文件、133 条用例，和上一条相同 |
| 3 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 tests` | 过 | 25 个文件、444 条用例 |
| 4 | `pnpm exec eslint . --max-warnings 0` | 过 | 退出码 0，无输出 |
| 5 | `env -u NODE_ENV pnpm check:packages` | 过 | 包边界、路径大小写、生成物一致、`catalog is up to date (245 components, 36 topics, 57 templates)`、行数检查、`!important`、模板变量、i18n 全过 |
| 6 | 只读铁律 | 过 | `no-write.test.ts`：18 条只读命令跑完后，所有文件的路径、内容字节、mtime 全部不变；`init` 只改 `AGENTS.md` 标记之间那一段，标记外文字与其它文件的 mtime 不变 |
| 7 | 四命令 × 文本/JSON × 中英 | 过 | `theme.test.ts`、`init.test.ts`、`upgrade.test.ts`、`doctor.test.ts` 共 22 条用例，两种输出、两种语言都有断言 |
| 8 | 真实二进制冒烟 | 过 | `pnpm --filter @astryx-vue/cli build` 后，在临时项目里跑 `bin/astryx-vue.mjs theme butter --json`、`doctor`，输出与预期一致；`doctor` 有 warn 时退出码 0、有 fail 时 1 |
| 9 | 行数 | 过 | 源码最大 `format.ts` 405 行、`build.ts` 406 行；四个新命令文件 108–200 行 |

新增的测试文件：`theme.test.ts`（5 条）、`init.test.ts`（6 条）、`upgrade.test.ts`（6 条）、`doctor.test.ts`（5 条）、`no-write.test.ts`（2 条）。

## 6. 拿不准的地方

1. **`upgrade` 的「最新版」取仓库版本（0.4.0）还是 npm 上的已发布版本（0.3.0）**。现在取 catalog 生成时 `packages/core/package.json` 的版本，好处是完全离线；如果希望以发布版为准，需要在生成 catalog 时把「已发布版本」写进去（`packages/core/CHANGELOG.md` 或 changeset 状态），请总控定。
2. **`init` 打印的安装命令要不要带上 `-D`/peer 说明**。文档站只说 `pnpm add @astryx-vue/core @astryx-vue/themes`，我照抄没加 `-D`；vue 的 peer 版本（`^3.5.0`）也没在指引里写，只由 `doctor` 检查。要不要在指引里加一行 `vue ^3.5.0`，请定。
3. **`doctor` 的退出码**：我定成「有 fail 才 1，warn 仍 0」。如果希望 CI 里 warn 也算失败，改一个比较即可。
4. **文档站 `guide/cli.md` 的改动**是否属于 D4b 的范围。我改的理由是页面里写着「这一版不含 theme/upgrade/doctor」，不改就是错的；如果这一页归别的节点维护，可以把我这段挪过去。
