---
title: Neutral 主题
---

# Neutral（中性默认主题）

Neutral 是 astryx-vue 的默认基准主题。视觉基调为中性黑白灰，适用于通用管理后台、仪表盘和工具型应用。

## 引入方式

在应用入口文件（如 `main.ts`）中引入：

```ts
import '@astryx-vue/themes/neutral.css'
```

该样式文件包含以下内容：
1. **字体依赖加载**：加载西文字体 Figtree 与等宽字体 JetBrains Mono（包含 400 常规、500 中粗、600 半粗、700 加粗及 400/600 斜体）。样式中声明了 `font-synthesis: none`，禁止浏览器合成伪粗体与伪斜体。
2. **主题变量导入**：加载 `neutral/` 目录下全部样式规则，包含全局基准 `base.css`。
3. **全局作用域注入**：将设计变量挂载至 `:root` 和 `[data-astryx-theme='neutral']`，引入后即在全站生效。

## 字体回退栈（Font Stack）

- **正文与标题（Body & Heading）：**
  `--astryx-font-family-body` 和 `--astryx-font-family-heading` 优先使用 Figtree，随后按系统习惯回退：
  `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`。
- **等宽代码（Code）：**
  `--astryx-font-family-code` 和原版一样优先用系统等宽字体：
  `ui-monospace, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`。

若需替换字体，覆盖上述三个 CSS 变量即可；也可以不引入内置的 `fonts.css`，通过 Google Fonts 自行加载 Figtree，例如在 `<head>` 中添加 `<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">`。

## 与上游原版规范对齐

Neutral 的颜色值、圆角半径与投影阴影均严格对齐上游 v0.7.1 的 `neutralTheme.ts`：

- **基础色板**：灰阶、文本、图标、边框、背景、功能状态色及十类分类色均源自上游色板定义（`neutralPaletteRefs.generated.ts`）。
- **直角规范 `--astryx-radius-none`**：与上游保持一致为 `0px`，方形头像与骨架屏保持直角。
- **次要文字颜色 `--astryx-color-text-secondary`**：浅色模式为 `#474747`，深色模式为 `#9e9e9e`。

组件层级的样式值直接引用对应的语义变量（例如 `--astryx-badge-info-background` 指向上游审定的状态色），调整语义变量即可全局更新关联组件。

## 触控端字号适配

在触控设备（粗指针）且视口小于 `lg` 断点（1024px）时，正文字号基准从 14px 调整为 16px，字阶比例由 1.2 调整为 1.1736。该策略提升了移动端阅读体验，同时保持 Display 1 等大标题与桌面端尺寸一致（42px）。桌面端排版不受影响。

## 明暗深色模式

Neutral 主题全局声明了 `color-scheme: light dark`。所有颜色通过 `light-dark()` 函数提供浅色与深色取值，自动跟随操作系统或容器的明暗模式。

若需在局部容器强制指定深色或浅色，添加 `data-astryx-color-mode="light"` 或 `"dark"` 属性即可。详见 [深色模式指南](/guide/dark-mode)。
