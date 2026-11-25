---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

跟进上游几个展示类小组件的修复：

- Avatar：首字母改由私有的行内自定义属性画出，不再暴露公开的 `data-initials` 属性；强制配色（Windows 高对比度）下，单独头像的首字母和默认图标跟随周围控件的颜色，组内头像保持不变。
- AvatarGroupOverflow：调用方传入的非空 `aria-label` 会作为指示器的名字，空字符串时仍回退到「还有 N 个」。
- Badge：有文字的徽章随字号变大而长高；宽度和文字一样，不会在 Grid 单元格或 VStack 里被拉满。
- Kbd：非 Apple 平台和水合之前，`ctrl`、`alt`、`shift`、`meta` 显示为 `Ctrl`、`Alt`、`Shift`、`Win` 文字；Apple 平台上 `meta` 显示 ⌘；键帽随字号变大而长高；开发环境下 `keys` 不是字符串时抛出点名该属性的错误。
- Thumbnail：禁用或加载中时，打开和移除按钮仍保持挂载、可聚焦并标记为已禁用，焦点不再掉到页面上；聚焦打开按钮只画一个焦点环；上传时的加载指示对读屏隐藏，改为每次开始加载时播报一次「加载中」。
- Citation：开发环境下缺少 `source` 时抛出点名该属性的错误；带图标的标签引用在行内垂直居中。

CLI 内置的组件文档跟着更新了上述说明。
