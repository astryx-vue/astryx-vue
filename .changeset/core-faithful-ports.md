---
'@astryx-vue/core': patch
'@astryx-vue/themes': patch
---

InfoTip 按上游完整移植：悬停和键盘聚焦预览，点击、轻点、回车或空格钉住，Escape、再按一次、点到外面、滚动外面或焦点离开时关闭；按钮带 `aria-expanded` 和 `aria-controls`，钉住时读屏播报一次帮助文字，按下事件停在按钮上。`useTooltip` 新增 `show()` / `hide()`，Tooltip 的气泡抽成 `TooltipSurface` 与 InfoTip 共用。字段的 `labelTooltip` 改用 InfoTip，名称为 “About 标签”（中文为“关于标签”），隐藏标签时的信息按钮定位照上游。`InfoTipProps`、`InfoTipSize` 从 core 导出，`@astryx-vue/lab` 的 InfoTip 改为已弃用的 core 再导出。EmptyState 的图标容器回到上游的普通块级 div：Icon 按组件或 Iconify 名字画的图标和上游的 `<svg>` 一样是块级（`data-kind='graphic'`），内置图形仍是行内 flex 的 span 且不再带 `vertical-align: -0.125em`，去掉了加载圈的特例。主题补齐上游新增的 token：`--color-info`、`--color-info-muted`、`--color-on-info`，`--color-text-/icon-/border-` 的 info、success、warning、error，`--color-on-*-muted`，`--duration-exit`，`--ease-entrance`、`--ease-move`、`--ease-exit`，七个主题都按上游主题源码的值写入；Chat 的成功、失败颜色改读 `--astryx-color-text-success`、`--astryx-color-text-error` 与 `--astryx-color-icon-*`，去掉各主题 `chat.css` 里的 `--astryx-chat-success` / `--astryx-chat-error` 补丁（变量仍可覆盖）。
