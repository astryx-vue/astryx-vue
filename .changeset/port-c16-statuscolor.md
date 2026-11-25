---
'@astryx-vue/core': patch
'@astryx-vue/themes': patch
'@astryx-vue/lab': patch
'@astryx-vue/richtext': patch
'@astryx-vue/cli': patch
---

状态色按所在的底分成几种角色，组件各取其一：

- `defineTheme` 做的主题只写了状态底色（或改了表面色、`--color-on-dark` / `--color-on-light`）时，会按主题自己的颜色算出没写的 `--color-on-<状态>`、`--color-text-<状态>`、`--color-on-<状态>-muted`，图标和边框角色跟着文字色走；Badge、StatusDot、输入框、图标等组件变量也在这个主题里跟着换。算出来的变量名记在 `theme.derivedTokens`。新增 `STATUS_COLOR_DEFAULTS`，和默认主题 CSS 里的状态色一致。
- `Icon` 新增 `color="info"`。各主题里 `Icon` 的 success / warning / error 颜色、Stepper 的状态图标改用图标角色；默认主题下成功图标从 `#00490B` 变为 `#2F7D33`。
- 输入框的状态边框改用边框角色，表单状态提示的文字改用浅底内容色；默认主题下浅色模式的警告边框从 `#FFCE2F` 变为 `#836700`。
- 默认主题的 StatusDot 用实心状态底色，图标用对应的 on 角色；头像状态点的图标也用 on 角色。
- 聊天输入框状态条的文字和图标改用浅底内容色；菜单里的危险操作、TextArea 和富文本编辑器超出字数的计数、未读分隔线标签、lab 里 Stat、CircularProgress、LogStream、SVGIcon 的状态色改用文字或图标角色。
- 强制配色模式下，Badge、StatusDot、进度条填充、步骤条数字徽标、聊天输入框状态条、列表滑动的危险操作都补一圈边，形状不会消失。

想保留某个组件原来的颜色，在主题里写上对应的角色即可，比如把 `--color-icon-success` 设成原来的值。
