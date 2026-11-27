---
'@astryx-vue/core': patch
'@astryx-vue/themes': patch
'@astryx-vue/cli': patch
---

`mode="system"` 的 `Theme` 现在取外面页面的明暗：页面根的 `color-scheme`，没有就看 `<meta name="color-scheme">`，根上两种都写（`reset.css` 就是）时才跟随读者的系统设置。宿主把页面画成深色时，里面也是深色主题，`useTheme()` 和 `useSyntaxTheme()` 报告的明暗一致；被强制了浅色或深色的 `Theme` 包着时，里面的 `system` 回到跟随读者。主题自己的 `@dark`、`@light` 组件样式也跟着页面走（根 `Theme` 把它画的明暗写在 `<html data-astryx-scheme>`）。主题样式表不再给 `Theme` 的包装元素声明 `color-scheme`，只有页面根默认 `light dark`。没引入 `reset.css` 或主题样式表、也没写 `color-scheme` 的页面按浅色算。
