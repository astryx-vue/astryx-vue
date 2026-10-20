---
title: 排版与字体
---

# 排版与字体

文字是界面传递信息最核心的媒介。好的排版能让内容层次分明，读起来眼睛轻松不累。astryx-vue 的排版系统在字体、字重和字号层级上都设定了清晰易用的规范。

## 预置字体与字体栈（Font Family）

主题包在引入时会自动加载两款高品质开源西文字体：
1. **正文与标题字体（Figtree）：** 现代、开阔且具有优秀易读性的几何无衬线字体。内置 400（常规）、500（中粗）、600（半粗）、700（加粗）以及 400/600 斜体。
2. **代码等宽字体（JetBrains Mono）：** 专门为代码阅读设计的等宽字体，符号辨识度高。内置 400、500、600、700 及斜体。

当设备由于网络或其他原因未能加载上述 Web 字体时，系统会平滑回退到操作系统内置的高品质系统字体栈：
- `--astryx-font-family-body` 与 `--astryx-font-family-heading` 回退至苹果 PingFang、Windows Segoe UI、Roboto 等。
- `--astryx-font-family-code` 回退至 SFMono、Menlo、Consolas 等等宽字体。

## 字重标准（Font Weight）

系统规范了 4 个清晰的字重阶梯：
- `--astryx-font-weight-normal`：`400`（常规文字）
- `--astryx-font-weight-medium`：`500`（中等强调）
- `--astryx-font-weight-semibold`：`600`（模块小标、加粗按钮）
- `--astryx-font-weight-bold`：`700`（主标题）

同时提供了 `--astryx-font-weight-regular` 别名（等同于 400），无缝兼容已有组件。

## 文本与标题尺寸阶梯（Type Scale）

通过 `Text`（正文）与 `Heading`（标题）组件的 `type` 属性，可以直接调用 `--astryx-text-*` 预设的一整套尺寸、行高与字重组合：
- **醒目展示大字（Display）：** `display-1` 到 `display-3`，用于落地页 Hero 标语或重点数字看板。这类大字重在尺寸冲击力，字重保持在克制的 400，依靠尺寸本身拉开层次，不会显得臃肿笨重。
- **文章标题（Headings）：** `headline-1` 到 `headline-6`，分别对应文章从大到小的各级标题结构。
- **常用正文与说明（Content）：** 包含 `body`（标准正文）、`large`（引导段落）、`label`（表单标签）、`code`（内联代码）与 `supporting`（辅助小字），行高均经过细致微调，长时间阅读也不易串行。

## 排版阶梯与字体预览

<TokenReference locale="zh" :sections="['font', 'type']" />
