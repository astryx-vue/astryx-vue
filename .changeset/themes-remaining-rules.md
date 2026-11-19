---
'@astryx-vue/core': patch
'@astryx-vue/themes': patch
---

主题补齐上游剩下的规则。Butter、Gothic、Y2K 新增 `own-fill.css`，对应上游的 `OWN_FILL_RULES`：卡片、浮层、菜单、输入框、分段控件选中项、条纹表格行等自带填充的部件，把主题自己的主文字、次要文字和强调色重新设一遍，放进分类色卡片时不再继承卡片的深色文字；Butter、Y2K 的 `selected-text.css` 补上分类色卡片里（含嵌套一层）选中行、树节点、数字角标的次要文字色。Button 的 destructive 变体在没有主题时回到上游的实心填充（`--astryx-color-error` 配 `--astryx-color-on-error`），焦点环也改用 `--astryx-color-error`；各主题自己的 destructive 取值不变。字体大小接入上游的动态字号：新增 `dynamicType`、`textSizeSync` 和 UIKit 字号表，七个主题的 `--astryx-font-size-*` 与 `mobile-type.css` 写成 `calc(自身大小 * var(--_dynamic-type-*, 1))` 并以下一档为上限，Butter、Stone、Y2K 的 `--astryx-text-supporting-size` 为 `0.75rem` 乘 Footnote 的比例；根 `Theme` 挂载时读取 iOS 的文字大小（或 `env(preferred-text-scale)`）给整页设置比例，运行时 `defineTheme` 生成的样式表同样按此写字号。默认字号下计算值不变。
