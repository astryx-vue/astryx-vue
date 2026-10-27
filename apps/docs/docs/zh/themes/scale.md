---
title: 间距、圆角与阴影
---

# 间距、圆角与阴影

间距、圆角和阴影是保证界面视觉节奏与层次结构的基础度量标准。astryx-vue 将这些基础尺寸抽象为规整的令牌阶梯，确保多组件混排时的视觉一致性。

## 间距阶梯（Spacing）

间距变量从 `--astryx-spacing-0` 至 `--astryx-spacing-12`：
- **以 rem 为基准单位**：例如 `--astryx-spacing-2` 为 `0.5rem`，`--astryx-spacing-4` 为 `1rem`。1rem 对应当前根元素的计算字号。
- **默认视效保持一致**：浏览器默认根字号是 16px，这时每一档都是 4px 乘档位，比如 spacing-1 是 4px，spacing-2 是 8px，spacing-4 是 16px。
- **随根字号自适应缩放**：用户调整系统字号或页面声明 `html { font-size }` 时，组件外边距与内边距将等比例缩放。例如根字号为 20px 时，`--astryx-spacing-4` 自动缩放为 20px，避免文字变大后产生容器溢出或挤压。
- **细粒度微调档位**：为处理紧凑排版中的细微间隙，提供 `0.5`（默认 2px）与 `1.5`（默认 6px）两个中间微调档位。

历史版本中该变量使用固定 px 单位。自定义主题若使用固定 px，则保持绝对像素；若需跟随根字号缩放，建议改为 rem 单位。

## 控件高度尺寸（Size）

常用的表单输入框、按钮等交互控件，划分为三个标准高度（固定为 px 声明）：
- **小尺寸（sm）**：`--astryx-size-element-sm` 为 `28px`，适用于工具栏或紧凑数据表格。
- **中尺寸（md）**：`--astryx-size-element-md` 为 `32px`，大部分页面的默认基准尺寸。
- **大尺寸（lg）**：`--astryx-size-element-lg` 为 `36px`，适用于重要表单或主要操作场景。

## 圆角系统（Radius）

圆角范围覆盖直角 `--astryx-radius-none` 至完全胶囊圆角 `--astryx-radius-full`：
- **直角（none）**：本库中严格保持为 `0px`（不采用上游 Neutral 将其设为 4px 的写法），用于方形头像或纯矩形元素。
- **容器与卡片圆角**：包含适用于常规组件与外层容器的梯度。
- **对话气泡圆角**：`--astryx-radius-chat` 为 `28px`（默认根字号下相当于 `1.75rem`），专门用于渲染饱满的对话消息气泡。

## 投影阴影（Shadow）

阴影用于在二维平面构建视觉纵深与层叠关系：
- **外阴影（Drop Shadow）**：包含 `low`（低投影，微弱隆起）、`med`（中投影，常用卡片与下拉菜单）与 `high`（高投影，模态弹窗与大浮层）。在深色模式下自动适配弥散度与透明度，避免产生发灰的视觉瑕疵。
- **内阴影（Inner Shadow）**：包含悬浮（hover）、激活（active/selected）、成功（success）、警告（warning）和危险（danger）等状态投影。

## 焦点环指示（Focus Outline）

为保障无障碍键盘导航的辨识度，系统通过四个变量统一定义焦点环（Focus Ring）：
- `--astryx-focus-outline-width`：轮廓线宽度。
- `--astryx-focus-outline-style`：轮廓线样式（通常为 solid 实线）。
- `--astryx-focus-outline-color`：颜色跟随强调色 `--astryx-color-accent`。
- `--astryx-focus-outline-offset`：焦点环相对元素边框的外扩偏移量，避免紧贴文本边缘。

## 标尺尺寸与视觉参考

<TokenReference :headings="true" locale="zh" :sections="['spacing', 'size', 'border', 'focus', 'radius', 'shadow']" />
