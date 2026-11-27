---
'@astryx-vue/core': minor
'@astryx-vue/themes': patch
'@astryx-vue/cli': patch
---

主题系统对齐上游：组件样式的每个样式键可写 `@light` 和 `@dark` 块，只在元素处于对应颜色模式时生效（主题强制的模式、system 主题下读者的偏好、最近一层 MediaTheme 表面）；主题里写的 `:active` 跟随触屏按压模型，手指下只在按压成立时才亮；值为 `undefined` 的组件样式、局部令牌和字体权重视为没写，根部 `localTokens: undefined` 会点名报错；用函数写的内边距（如 `clamp(...)`）按顶层空白拆开；抽屉可经 `drawer` 挂点设置内边距；`--radius-chat` 默认跟随容器圆角（各主题包不再钉死 28px，需要饱满圆角的主题自己写）；只写 `fallbacks` 没有 `family` 的字体角色不再生成字体列表；`Theme` 的 `theme` 传了不是 `defineTheme()` 产物的值时给出开发期提示并沿用外层主题；Chat 输入区的圆角和内边距改挂 `chat-composer` 目标；SyntaxTheme 缺 `theme` 时开发期点名报错；样式过的 accent 链接悬停时保留容器或主题给的 `--link-hover-color`；提示卡片在量到底色前按主题给的底色选内容深浅；导出 `compactDefinition` 与 `DEFAULT_COMPACT_DEFINITION`（上游 #6071 #8301 #9254 #9761 #10420 #11347 #11679 #11759 #11760 #11786 #11802 #11973 #12270 #12794 #11752）
