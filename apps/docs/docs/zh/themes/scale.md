---
title: 间距、圆角与阴影
---

# 间距、圆角与阴影

做界面就像搭积木，间距、圆角和阴影是保证整个网页视觉呼吸感和层次感的“度量衡”。astryx-vue 将这些基础尺度做成了规整的标尺，让不同组件拼在一起时浑然一体。

## 间距标尺（Spacing）

间距变量从 `--astryx-spacing-0` 到 `--astryx-spacing-12`：
- **单位是 rem：** 例如 `--astryx-spacing-2` 是 `0.5rem`，`--astryx-spacing-4` 是 `1rem`。rem 的意思是「根字号的几倍」。
- **默认看起来和以前一样：** 浏览器默认根字号是 16px，这时每一档都是 4px 乘档位，比如 spacing-1 是 4px，spacing-2 是 8px，spacing-4 是 16px。
- **会跟着字号一起变大：** 读者在浏览器里把默认字号调大，或者页面写了 `html { font-size }`，组件之间的间距和内边距会按同样的比例放大。比如根字号改成 20px，`--astryx-spacing-4` 就从 16px 变成 20px，文字变大以后不会挤在一起。
- **细腻微调档：** 为了照顾紧凑布局中的微小缝隙，特别补充了 `0.5`（默认 2px）和 `1.5`（默认 6px）两个中间档位。

以前这组变量写死成 px。默认根字号下外观没有变化。自定义主题如果自己用 px 写间距，那几档仍然固定不变；想让它们跟随根字号，就改写成 rem。

## 交互控件高度（Size）

常用的表单输入框、按钮等可点击交互控件，统一划分为三个标准高度尺寸（这几档仍是 px）：
- **小尺寸（sm）：** `--astryx-size-element-sm` 为 `28px`，适合紧凑工具栏或密集数据表格。
- **中尺寸（md）：** `--astryx-size-element-md` 为 `32px`，绝大多数页面的默认尺寸。
- **大尺寸（lg）：** `--astryx-size-element-lg` 为 `36px`，适合宽敞表单或重要操作界面。

## 圆角系统（Radius）

圆角范围从纯直角 `--astryx-radius-none` 一路延伸到胶囊全圆角 `--astryx-radius-full`：
- **纯直角（none）：** 在本库中保持严格的 `0px`（不采用原版 Neutral 将其设为 4px 的做法），用于方形头像或纯矩形结构。
- **容器与卡片圆角：** 包含针对元素与容器的一组平滑梯度。
- **聊天对话泡专属圆角：** `--astryx-radius-chat` 为 `28px`（在默认 16px 根字号下相当于 `1.75rem`），专门用来呈现饱满圆润的现代 AI 对话气泡。

## 阴影与景深（Shadow）

阴影用来在平面屏幕上建立上下层级的纵深感：
- **外阴影（Drop Shadow）：** 包含 `low`（低投影，微弱浮起）、`med`（中投影，常用卡片与下拉菜单）、`high`（高投影，模态弹窗与大浮层）三档。针对深色和浅色模式，外阴影的透明度与弥散范围做了精细适配，深色模式下不会显得突兀发灰。
- **内阴影（Inner Shadow）：** 包含悬停（hover）、选中（active/selected）、成功（success）、警告（warning）和错误（danger）五种内凹或状态投影。

## 键盘焦点环（Focus Outline）

为了保证良好的无障碍键盘导航体验，系统通过四个变量规范了组件被 Tab 键聚焦时的视觉光环：
- `--astryx-focus-outline-width`：描边宽度。
- `--astryx-focus-outline-style`：描边线型（通常为实线 solid）。
- `--astryx-focus-outline-color`：颜色跟随强调色 `--astryx-color-accent`，明亮显眼。
- `--astryx-focus-outline-offset`：焦点环距离控件边缘的外扩间隙，保证描边不紧贴文字或边框。

## 标尺尺寸与视觉参考

<TokenReference :headings="true" locale="zh" :sections="['spacing', 'size', 'border', 'focus', 'radius', 'shadow']" />
