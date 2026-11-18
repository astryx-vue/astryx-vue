---
'@astryx-vue/core': patch
---

对齐原版的几处细节：`SideNav` 内置的折叠按钮改放在底部行、与 `footerIcons` 同一行（折叠后列方向反排），底部图标行和 `SideNavItem` 的 `actions` 槽都通过 `SizeContext` 统一成 `sm`；带 tooltip 的幽灵按钮不再参与 `Toolbar` 末端的边缘补偿，和原版里按钮后面紧跟 popover 层的行为一致；`PowerSearch` 的结果数、`endContent` 与清除按钮合成一组，距字段内缘 8px、间距 8px，结果数排在 `endContent` 之前。
