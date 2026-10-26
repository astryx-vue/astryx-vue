# D4a 取舍记录（和用户边讨论边定）

## 已定

1. 2026-10-24：CLI 规模选 B「中等」。
   - 已有命令补细节：`search` 排序与来源包、`docs --depth`、`build` 选起始模板、`component`/`composable`/`template`/`manifest` 对齐。
   - 新增：`init`（完整初始化）、`upgrade`（和 D6 的 FR10 迁移合并）、`theme`（只做加、切，不做生成）、`doctor`（简单版）。
   - 不做：`gap-report`、`discover`、`integration`、`blog`。
   - 待定：`swizzle`。
2. 文档仍然只有一份来源：文档站的 Markdown。CLI 的 catalog 从文档站生成，不在 CLI 里另写一套指南。

## 待讨论

- `swizzle`（把组件源码拷进项目里改）：做不做。
- `init` 具体做到哪一步：装依赖、引样式、写 AI 说明文件，三件都做，还是只做后两件。
- `upgrade` 和 D6 合并后的形态：真的去改用户的 `.vue` 文件，还是先输出一份核对清单。
- `theme` 的「加」和「切」在 Vue 项目里分别指什么：改 `main.ts` 里引的 CSS，还是改 `data-astryx-theme`。
- 原版 142 篇指南里，我们文档站还缺哪些主题，要补进文档站。
