---
title: Neutral 主题
---

# Neutral（中性默认主题）

Neutral 是 astryx-vue 的默认主题。它的基调是中性黑白灰，适用于各类企业级后台、中台系统和工具型网页。

## 引入方式

只需在你的前端入口文件（如 `main.ts`）中加入这行引入：

```ts
import '@astryx-vue/themes/neutral.css'
```

这一行代码会完成这几件事：
1. **自动加载字体资源：** 加载西文字体 Figtree 与等宽代码字体 JetBrains Mono（包含 400 常规、500 中粗、600 半粗、700 加粗以及 400/600 斜体）。因为声明了 `font-synthesis: none`，所以系统严格使用真实设计的字重，不会让浏览器去硬拉变形生成伪粗体或伪斜体。
2. **引入所有组件主题样式：** 依次加载 `neutral/` 目录下的所有样式，包括全局基准 `base.css`。
3. **注入全局根节点：** 会自动将基础变量挂载在 `:root` 和 `[data-astryx-theme='neutral']` 上，因此无需任何额外配置，引入即全站生效。

## 字体回退栈（Font Stack）

- **正文与标题（Body & Heading）：**
  `--astryx-font-family-body` 和 `--astryx-font-family-heading` 优先使用 Figtree，随后按系统习惯回退：
  `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`。
- **等宽代码（Code）：**
  `--astryx-font-family-code` 和原版一样优先用系统等宽字体：
  `ui-monospace, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`。

想换成自己的字体，覆盖上面三个变量即可；也可以不引入内置的 `fonts.css`，改用 Google Fonts 加载 Figtree，例如在 `<head>` 里放 `<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">`。

## 和原版设计保持一致

Neutral 的每一个颜色、圆角和阴影值都和上游 v0.7.1 的 `neutralTheme.ts` 一致：

- **色板：** 灰阶、文字、图标、边框、背景、状态色和十种分类色都取自上游审定色板（`neutralPaletteRefs.generated.ts`）。
- **直角定义 `--astryx-radius-none`：** 和上游一样是 `0px`，方形头像和骨架屏保持直角。
- **辅助文本色 `--astryx-color-text-secondary`：** 浅色 `#474747`、深色 `#9e9e9e`，与上游一致。

组件级配色不再各写一份十六进制值，而是引用语义变量（例如 `--astryx-badge-info-background` 指向上游审定的状态色）。改一个语义变量，用到它的组件会一起更新。

## 手机上字号更大

在触屏设备（粗指针）且视口窄于 `lg` 断点（1024px）时，正文字号基准从 14px 提升到 16px，字阶比例从 1.2 调整为 1.1736。这样正文够大好读，而 Display 1 仍保持桌面端的 42px。桌面端字号不受影响。

## 明暗深色模式

Neutral 在定义时就声明了 `color-scheme: light dark`。因此只要你使用 `light-dark()` 变量，它会自动跟随操作系统或文档站当前的外观切换。

如果你需要在页面的某一个特定区域固定显示深色或浅色，只需在父容器元素上添加属性 `data-astryx-color-mode="light"` 或 `"dark"`。具体说明请参阅 [深色模式指南](/guide/dark-mode)。
