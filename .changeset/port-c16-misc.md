---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

跟进上游的一组零散修复：

- 头像首字母、Markdown 标题锚点、数字输入里用到的 Unicode 属性正则改在运行时构造，用 Babel 转译依赖的源码构建不会再报 `Unknown property`。
- Button 的 `icon`、`end`，Tab 的 `icon`、`selectedIcon`、`endContent`，SegmentedControlItem 的 `icon`，BreadcrumbItem 的 `startIcon`，Avatar 的 `status`，DropdownMenuGroup 的 `title`：插槽只留下 `v-if` 的注释或空白时，不再画出空的包裹元素；Tab 选中时 `selectedIcon` 没内容就退回 `icon`；DropdownMenuGroup 用插槽写的标题也会命名这一组。
- ComplexSelector 的触发器在内置和自定义两条路径上都是 `role="combobox"`，必填、禁用和忙碌状态都挂在它上面；自定义触发器拿到的绑定新增 `role`、`aria-required`，`aria-label` 让位给选择器自己的 `aria-label` 或 `aria-labelledby`。Button 保留调用方传入的 `aria-busy` 和 `aria-disabled`。
- Kbd 的键帽缩写和读出来的键名、FileInput 校验提示里的大小单位、粘贴文本小块上的计数改用内置文案，跟着语言切换。`formatFileSize` 和 `pastedTextLabel` 新增可选的格式参数。
- Selector、MultiSelector、ComplexSelector 的列表按触发器宽度定的最小宽度压在视口上限之内，触发器太宽时列表不再撑出屏幕。
- 开发构建里，ChatToolCalls 缺 `calls`、ChatDictationButton 缺 `dictation` 时抛出点名的错误，说清楚该怎么传。
- 主题在 `checkbox-input`、`switch` 目标上写的 `gap` 改的是控件和标签之间的距离，不再挤到状态消息上方。
- Pagination 这一排控件的首尾带上 `data-first="first"`、`data-last="last"`，主题可以把控件连成一条并只给两头加圆角。
