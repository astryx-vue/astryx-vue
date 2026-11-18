---
'@astryx-vue/core': patch
'@astryx-vue/themes': patch
---

主题 token 按上游重新逐项对齐：把上游七套主题源码连同调色板引用打包，用上游的 `deriveStatusRoleTokens` 生成，再逐个核对 211 个 token 的亮、暗两档，修掉 `--color-success` / `--color-error` / `--color-warning` 的旧值（如 neutral 的 `#198100`、`#64af4c`）、`--color-accent-muted`、`--color-skeleton`、各主题的状态 muted 与文字色、色板上的 `--color-*-green/red/yellow` 等。Neutral 不再保留上游已经去掉的主题本地状态 token（只留已弃用的 `--astryx-theme-neutral-color-status-fill-accent`），Badge、StatusDot、Avatar、ProgressBar 的状态色直接读 `--astryx-color-info/success/warning/error`，破坏性按钮用 `--astryx-color-error-muted` 和 `--astryx-color-on-error-muted`；Chocolate、Matcha 的破坏性按钮和 info 徽章、Butter 的状态徽章与破坏性按钮、中性徽章也照上游改了。

Banner 照上游按状态取 `--astryx-color-<status>-muted` 和 `--astryx-color-on-<status>-muted`：标题、说明和状态图标继承这个前景色，终端内容回到普通文字色，只有内置的展开、关闭按钮跟随状态前景。Gothic、Butter、Stone、Y2K 主题改为在 `.astryx-banner[data-status]` 上重指这两个 token（与上游 `status:*` 覆盖一致），Neutral、Chocolate、Matcha 不再覆盖。`--astryx-banner-*-background/foreground` 仍可作为覆盖。

动效 token 接入组件：`--astryx-duration-exit`、`--astryx-ease-exit` 用于触屏按压释放（淡出时长也由控制器抬手时读取，默认 175ms）、Switch、ClickableCard、SelectableCard、Thumbnail、列表行和树列表行的释放过渡，以及 BottomSheet 的指针退出曲线；`--astryx-ease-entrance` 用于 Dialog 与 Popover 的进入（Popover 时长改为 `--astryx-duration-medium-min`）；`--astryx-ease-move` 用于树列表和表格的展开箭头。

PowerSearch、Selector、Tokenizer 抽出纯函数和组合式函数（`menuStyle`、`selectorStatus`、`useSelectedOverlay`、`inputAttrs`），行为不变，回到单文件 500 行以内。

同一批里还对齐了：代码块的语法色（comment、operator、punctuation、diff 标记等）和代码块背景、高亮底色（高亮改读 `--astryx-color-accent-muted`），Neutral 选中行底色与聚焦环改读 `--astryx-color-accent-muted`、`--astryx-color-accent`，步骤条未开始的数字底改读 `--astryx-color-background-muted`；Neutral、Butter、Y2K 选中行、树节点、单选项、文件拖放区、角标的次要文字按上游退一档（新增各主题的 `selected-text.css`）；演练场主题编辑器生成的深色文字改为 `#111111`；`@astryx-vue/lab` 的样式入口去掉已不存在的 `info-tip.css`。
