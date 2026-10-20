---
title: Design token
---

# Design token（设计令牌）

## 什么是 Design token？

做界面时，我们经常会遇到很多重复出现的设计决定：比如主色调选哪个蓝、按钮圆角是多大、卡片之间空开几像素、弹窗弹出来要花几毫秒。

如果把这些具体数字硬编码写死在每个组件的 CSS 里，以后只要想改个圆角或换个主题色，就得翻遍整个项目的代码挨个修改，不仅费时而且特别容易改漏。

Design token（设计令牌）就是把这些通用的设计决定统一抽出来，给它们起一个固定、清晰的名字。组件本身不写死具体数字，只引用对应的 token。以后换主题，本质上就是把这批 token 背后的具体数值整套替换掉。

## 在 astryx-vue 中是如何实现的？

astryx-vue 的 token 严格对齐原版 Astryx（原版在 `tokens.stylex.ts` 中维护）。但在前端输出层面，我们并没有把它们做成 StyleX 对象，而是全部编译成了现代标准的 **CSS 自定义属性（CSS 变量）**。

这样设计的好处很明显：**不用引入任何专门的 CSS-in-JS 编译器，只要写原生 CSS，在哪都能直接读到和修改。**

1. **统一的前缀规范：** 每一条语义化 token 都有统一的 `--astryx-` 前缀，避免和你项目已有的其他全局变量起冲突。
2. **原生双模配色：** 颜色相关的 token 采用标准 CSS 的 `light-dark()` 函数书写，一条变量就同时包含了浅色和深色两套色值，不需要分开发布两份样式表，切换模式时也不需要刷掉整套样式。
3. **层级覆盖规则：** 
   - 如果 Neutral 主题覆盖了某个变量，优先使用 Neutral 的值。
   - 如果 Neutral 没覆盖，则回退使用原版的默认规范值。
   - 如果在自定义样式中想要微调，只需通过 CSS 层级（`@layer astryx.overrides`）重新给变量赋值即可。

数值以 `packages/themes/neutral/base.css` 的声明为准。文档中的色板与尺寸参考也是直接由该文件解析生成的。

## Token 分类总览

你可以按照功能分类查看具体的变量名称与视觉效果：

| 类别文档 | 变量前缀与说明 |
| --- | --- |
| [颜色](/themes/color) | `--astryx-color-*`：包含文字、表面背景、状态提示色，以及图表用的 `--astryx-color-data-*` |
| [排版与字体](/themes/typography) | `--astryx-font-*`、`--astryx-text-*`：包含字体族、字号尺寸、字重和行高梯级 |
| [动画刻度](/themes/motion) | `--astryx-duration-*`、`--astryx-ease-*`：包含持续时间、缓动曲线与共享关键帧 |
| [间距、圆角与阴影](/themes/scale) | `--astryx-spacing-*`、`--astryx-size-*`、`--astryx-radius-*`、`--astryx-shadow-*` 等通用尺寸标尺 |

## 在组件外部使用

如果你在编写自己的业务组件或页面时，也希望外观完全符合这套设计规范，直接在你的 CSS 里引用这些变量即可：

```css
.my-custom-card {
  /* 背景直接引用主题卡片背景色 */
  background: var(--astryx-color-background-card);
  /* 文字直接引用主题主要文字色 */
  color: var(--astryx-color-text-primary);
  /* 边框圆角直接引用元素通用圆角 */
  border-radius: var(--astryx-radius-element);
  /* 内边距直接引用 4 档（16px）标尺 */
  padding: var(--astryx-spacing-4);
}
```

更多关于 CSS 分层和覆盖层级的规则，请阅读 [CSS 变量](/themes/css-variables)。
