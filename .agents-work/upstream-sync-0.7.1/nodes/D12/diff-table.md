# table 走查

对照图：`/tmp/D12-shots/table-light.png`、`/tmp/D12-shots/table-dark.png`（左原版，右我们，1440×900）。

| 区块 | 原版 | 我们 | 结论 |
| --- | --- | --- | --- |
| 页头 | 左 Items（large semibold），右 Add Item 主按钮，下有分隔线 | 相同 | 一致 |
| 表头 | Name / Status / Updated / Actions，四列 | 相同 | 一致 |
| Name 列 | body semibold | 相同 | 一致 |
| Status 列 | active=success 徽标，inactive=neutral 徽标 | 相同；浅、深色都对 | 一致 |
| Updated 列 | secondary 色日期 | 相同 | 一致 |
| Actions 列 | Edit 次按钮 sm | 相同 | 一致 |
| 数据条数 | 3 行 | 3 行 | 一致 |
| 行悬停 | hasHover | has-hover | 一致 |
| 深色模式 | 同上 | 同上 | 一致 |

工具修正：`scripts/swarm/playground-pair.mjs` 给我们这边预置 `vitepress-theme-appearance`，否则站点默认 dark，"浅色"图会是深色。

## 补充：外壳修复后复核

演练场预览卡片（外壳）和原版有差异，修在 `apps/docs/styles/playground.css`，对 57 个模板都生效，细节见 `diff-table-page.md` 的「外壳」部分。修完后本模板重新对照，仍一致。
