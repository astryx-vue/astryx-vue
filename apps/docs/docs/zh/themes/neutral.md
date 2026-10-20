---
title: Neutral 主题
---

# Neutral（中性默认主题）

Neutral 是 astryx-vue 最核心、也是默认开箱即用的主题。它的基调是经典耐看的中性黑白灰，克制内敛，适用于各类企业级后台、中台系统和工具型网页。

## 引入方式

只需在你的前端入口文件（如 `main.ts`）中加入这行引入：

```ts
import '@astryx-vue/themes/neutral.css'
```

这一行代码在背后默默为你做好了这几件事：
1. **自动加载字体资源：** 加载西文字体 Figtree 与等宽代码字体 JetBrains Mono（包含 400 常规、500 中粗、600 半粗、700 加粗以及 400/600 斜体）。因为声明了 `font-synthesis: none`，所以系统严格使用真实设计的字重，绝不会让浏览器去硬拉变形生成伪粗体或伪斜体。
2. **引入所有组件主题样式：** 依次加载 `neutral/` 目录下的所有样式，包括全局基准 `base.css`。
3. **注入全局根节点：** 会自动将基础变量挂载在 `:root` 和 `[data-astryx-theme='neutral']` 上，因此无需任何额外配置，引入即全站生效。

## 字体回退栈（Font Stack）

- **正文与标题（Body & Heading）：**
  `--astryx-font-family-body` 和 `--astryx-font-family-heading` 优先使用 Figtree，随后按系统习惯回退：
  `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`。
- **等宽代码（Code）：**
  `--astryx-font-family-code` 优先使用 JetBrains Mono，随后回退至：
  `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`。

## 与原版设计的两处微调说明

为了让现有组件在实际业务中表现更稳定、更符合直觉，我们在复刻原版 Neutral 时，审慎地保留了两处实用微调：

1. **直角定义 `--astryx-radius-none`：** 保持为严格的 `0`。原版 Neutral 将该变量设成了 `0.25rem`（4px），但系统中的方形头像（Avatar）和完全不带圆角的骨架屏（Skeleton）在语义上必须呈现纯粹的直角，因此我们坚持将 `none` 锚定为 `0`。
2. **辅助文本色 `--astryx-color-text-secondary`（浅色模式）：** 浅色模式下的色值保持为 `#525252`。原版 Neutral 使用的是稍淡一些的 `#737373`。考虑到输入框占位符、选择器提示语以及辅助说明需要更好的对比度可读性，这里采用了对比度更扎实、文字更易认的数值。

## 明暗深色模式

Neutral 在定义时就声明了 `color-scheme: light dark`。因此只要你使用 `light-dark()` 变量，它会自动跟随操作系统或文档站当前的外观切换。

如果你需要在页面的某一个特定区域固定显示深色或浅色，只需在父容器元素上添加属性 `data-astryx-color-mode="light"` 或 `"dark"`。具体说明请参阅 [深色模式指南](/guide/dark-mode)。
