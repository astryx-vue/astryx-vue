---
title: 排版与字体
---

# 排版与字体

文字是界面传递信息的核心载体。规范的排版体系有助于理清信息层级，提升阅读舒适度。astryx-vue 的排版系统在字体、字重和字号层级上均制定了统一标准。

## 预置字体与字体栈（Font Family）

主题包引入时会自动加载两款开源西文字体：
1. **正文与标题字体（Figtree）**：几何无衬线字体，包含 400（常规）、500（中粗）、600（半粗）、700（加粗）以及 400/600 斜体。
2. **等宽代码字体（JetBrains Mono）**：专为代码排版设计的等宽字体，符号辨识度高，包含 400、500、600、700 及斜体。

当客户端未能成功加载 Web 字体时，系统平滑回退至操作系统内置字体栈：
- `--astryx-font-family-body` 与 `--astryx-font-family-heading` 回退至 PingFang SC、Segoe UI、Roboto 等无衬线字体。
- `--astryx-font-family-code` 回退至 SFMono、Menlo、Consolas 等等宽字体。

## 字重阶梯（Font Weight）

系统定义了 4 个常用字重：
- `--astryx-font-weight-normal`：`400`（常规正文）
- `--astryx-font-weight-medium`：`500`（中度强调）
- `--astryx-font-weight-semibold`：`600`（模块标题、加粗按钮）
- `--astryx-font-weight-bold`：`700`（主要标题）

同时保留了 `--astryx-font-weight-regular` 别名（等同于 400），兼容已有代码。

## 文本与标题尺寸阶梯（Type Scale）

通过 `Text`（正文）与 `Heading`（标题）组件的 `type` 属性，可以直接调用 `--astryx-text-*` 预设的字号、行高与字重组合：
- **醒目展示大字（Display）**：`display-1` 至 `display-3`，用于落地页主标语或核心指标看板。字重固定为 400，依靠尺寸本身呈现视觉层次。
- **结构标题（Headings）**：`Heading` 的 `level` 属性取值 1 至 6，分别对应渲染为 `h1` 至 `h6`，并应用该级别的默认字号、字重与行高。若需在保持 `h2` 语义的同时使用其它字号，可通过 `type` 属性覆盖。
- **通用正文与说明（Content）**：包含 `body`（标准正文）、`large`（引导段落）、`label`（表单标签）、`code`（行内代码）与 `supporting`（辅助小字），行高均经微调以防止串行。

## 排版阶梯与字体预览

<TokenReference locale="zh" :sections="['font', 'type']" />

## 推荐实践与注意事项

字号档位并非越大越好。通用建议：正文统一使用 `body`，单页通常最多保留一个 `display-1` 至 `display-3`，其余层级通过标题层级体现。

**推荐做法：**

- 单页仅保留一个 `display-*`。主要用于落地页主标语或仪表盘核心数据指标。Display 字重固定为 400，依靠字号本身区分层级。
- 标题依据文档大纲语义选择 `level`。遵循 `h1` 下接 `h2`、`h2` 下接 `h3` 的语义规范；若视觉字号与语义层级不一致，使用 `type` 或 `weight` 进行视觉调整，不要为了字号去跳级。
- 辅助说明文字使用 `supporting`。表格脚注、时间戳及辅助提示建议使用该档位：字号从 14px 调整为 12px，并应用次要文本色。
- 行内代码使用 `Text` 的 `type="code"` 或直接使用 `Code` 组件，自动匹配等宽字体栈。
- 标题排版建议使用 `text-wrap="balance"`，正文段落建议使用 `text-wrap="pretty"`。前者平衡各行文字宽度，后者避免尾行孤字。
- 超长文本配合 `max-lines` 与截断提示。`Heading` 和 `Text` 截断后，鼠标悬停时会展示完整内容。

**避免做法：**

- 不要用 `h4` 当小标题。`level` 4 是 14px 加粗的眉题尺寸，比 `level` 5 还小。要一个小一号的小标题，用 `level="5"`，或者给 `h4` 加 `type`。
- 避免仅使用字号表达重要程度。重点内容可通过加粗、前景色或布局位置体现，字号用于划分内容结构。
- 避免手动声明 `font-size` 和 `line-height`。硬编码 `font-size: 18px` 会脱离 `--astryx-text-*` 令牌规范，切换主题时可能产生排版错位。
- 避免为中文标题添加额外的 `letter-spacing`，字距过大会影响中文字符的自然认读。
- 避免在正文中使用全大写英文字母。全大写仅适用于短标签或眉题，长篇文本全大写会降低阅读效率。
- 避免在单一段落内混用超过三种字号。层级复杂时建议使用列表或独立小标题拆分内容。
