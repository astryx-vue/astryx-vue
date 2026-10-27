# D11 文档润色 · 执行计划（第 1 批：中文指南与主题）

## 目标

把文档站的说明文字改得更好读。改完要做到四点：

- 说法直白，一句话只讲一件事。
- 同一个东西前后用同一个词。
- 不默认读者懂背景：第一次出现的概念，顺手用一句话讲清楚。
- 去掉宣传腔和套话，比如「做工精细」「随心挑选」「轻松放进去」「赋能」。

**只改行文，不改事实。** 代码示例、API 名、属性名、默认值、链接都不能动，页面结构也不能动。

文档一共很多，分批做。**这是第 1 批**：

- `apps/docs/docs/zh/guide/*.md`：21 个文件，约 10 万字节。
- `apps/docs/docs/zh/themes/*.md`：15 个文件，约 4.5 万字节。

组件页和英文页留到后面几批，这一批不碰。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D11`，分支 `sync/d11-docs-polish`，槽位 3，端口 5173。只在这个工作区里改。
- 动手前先读：
  - 文风规范：`/Users/shenqingchuan/.agents/skills/oil-tone/SKILL.md`，以及它引用的文件。
  - 写作对象：用 Vue 3 做界面的前端开发者，有些人第一次接触设计系统。
- 命令前都加 `env -u NODE_ENV`。

## 能改什么、不能改什么

| 能改 | 不能改 |
| --- | --- |
| 段落文字、列表项文字、表格里的说明文字 | frontmatter（`---` 之间的部分） |
| 句子顺序、合并或拆开段落 | 代码块（```` ``` ```` 之间的内容），一个字符都不能改 |
| 把长句拆短 | `<script setup>`、`<style>` 块，以及 Demo 组件标签（`<ButtonSizes />` 这类） |
| 删掉重复或空洞的话 | 行内代码（`` `labelHidden` `` 这类） |
| 小标题的措辞 | 链接地址；标题的数量和层级 |
| | `:::tip` 这类容器的种类和数量 |
| | 任何技术事实：行为、默认值、版本号、兼容性 |

觉得某处**事实**写错了：不要改，把文件名、行号和理由记进回报，总控去核对。

术语保持一致。动手前先通读整批文件，把同一个东西的不同叫法列成一张对照表，挑一个叫法统一用下去，对照表写进回报。比如「设计变量 / token / 设计令牌」「读屏 / 屏幕阅读器」「插槽 / slot」。英文技术名词照常保留原文，比如 `v-model`、Composables、SSR。

## 核对脚本

每改完一个文件就跑一次核对脚本：

```sh
node /Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/D11/guard.mjs swarm-tree
```

脚本会比较润色前后的这些内容：frontmatter、代码块、`<script>` 和 `<style>`、组件标签、行内代码、链接、标题数量、容器。

脚本报「不通过」，说明动了不该动的东西，改回去。

## 开发步骤（每步做完就提交）

1. 通读整批文件，写出术语对照表，存成 `.tmp-d11/terms.md`，这个文件不提交。
2. 润色 `zh/guide`。顺序是 `why`、`getting-started`、`installation`、`styling`、`dark-mode`、`i18n`、`icons`、`responsive`、`accessibility`、`layout`、`principles`、`patterns`、`composables`、`templates`、`working-with-ai`、`cli`、`browser-support`、`links`、`contributing`、`migration`、`changelog`。每 3 到 5 个文件提交一次。
3. 润色 `zh/themes`，同样每 3 到 5 个文件提交一次。
4. 重新生成 catalog：`env -u NODE_ENV pnpm --filter @astryx-vue/cli generate`，然后提交。
5. 构建文档站：`env -u NODE_ENV timeout 600 pnpm --filter @astryx-vue/docs docs:build`，必须通过。

`migration.md` 和 `changelog.md` 改得要格外少：只改明显不通顺的句子，每条改动的「以前、现在、怎么改」结构保持不变。

## 自测要求

1. 核对脚本对整批文件报 0 个不通过。
2. `docs:build` 通过。
3. 跑 `eslint --max-warnings 0 apps/docs/docs/zh`，必须通过。如果仓库对 Markdown 有 lint，也要通过。
4. 自己抽 5 个页面，把改动前后各挑一段，贴进回报对比。

## 纪律

- 至少每 15 分钟提交一次，提交信息用中文，不要推送。
- 一个文件卡住超过 20 分钟：先提交，把卡住的情况写进回报，再做下一个文件。
- 不改 `.md` 以外的文件。catalog 重新生成的除外。
- 不改 `ROADMAP.md`、`SWARM.md`。

## 回报

写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/D11/impl-1.md`，格式见 `templates/impl-report.md`。另外写这三样：

- 术语对照表，以及最后统一用了哪个词。
- 疑似事实错误的清单。
- 前后对比的 5 段。
