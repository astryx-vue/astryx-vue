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
- **文章标题（Headings）：** `Heading` 的 `level` 取 1 到 6，决定渲染成 `h1` 到 `h6`，同时给出这一级的默认字号、字重和行高。想要标题语义是 `h2`、字号却用别的档位，用 `type` 覆盖。
- **常用正文与说明（Content）：** 包含 `body`（标准正文）、`large`（引导段落）、`label`（表单标签）、`code`（内联代码）与 `supporting`（辅助小字），行高均经过细致微调，长时间阅读也不易串行。

## 排版阶梯与字体预览

<TokenReference locale="zh" :sections="['font', 'type']" />

## 该做与不该做

字号档位不是越大越好。一条经验：正文用 `body`，一页只有一个 `display-1` 到 `display-3`，剩下的都靠级别拉开层次。

**该做：**

- 一页只用一个 `display-*`。落地页的主标语、看板上的关键数字，这两处才用得上。Display 的字重是 400，靠尺寸本身有冲击力，不靠加粗。
- 标题按大纲选 `level`。页面结构是 `h1` 下面 `h2`、`h2` 下面 `h3`，就照这个写。字号不合适当下就用 `type` 或 `weight` 调，不要为了字号去跳级。
- 辅助文字用 `supporting`。表格注释、时间戳、帮助文本都归它：字号从正文的 14px 降到 12px，颜色也换成次要色。
- 内联代码用 `Text` 的 `type="code"`，或者 `Code` 组件。它会自动换成等宽字体栈。
- 标题换行用 `text-wrap="balance"`，正文用 `text-wrap="pretty"`。前者让两行标题长度接近，后者避免最后一行只剩一个字。
- 长文本配 `max-lines` 加截断提示。`Heading` 和 `Text` 截断后，鼠标悬停会显示全文。

**不该做：**

- 不要用 `h4` 当小标题。`level` 4 是 14px 加粗的眉题尺寸，比 `level` 5 还小。要一个小一号的小标题，用 `level="5"`，或者给 `h4` 加 `type`。
- 不要用字号表达重要程度。重要的东西加粗、给颜色、给位置，尺寸留给层级。
- 不要手写 `font-size` 和 `line-height`。写 `font-size: 18px` 会跟 `--astryx-text-*` 的行高和字重脱节，换主题就错位。
- 不要给标题加 `letter-spacing` 做「设计感」。中文字加了字距只是散。
- 不要用全大写英文字母做正文。眉题和标签可以用，长句看着费劲。
- 不要在一段里混用三种以上字号。要分层次，改用列表或小标题。
