---
title: 动画与过渡
---

# 动画与过渡

界面的交互动效需要兼顾即时反馈与视觉平滑度。astryx-vue 的动效规范遵循 Astryx 设计标准，提供克制且符合物理规律的过渡体验。

## 动画时长阶梯（Duration）

动画时长基于 Neutral 主题的基准刻度计算得出，划分为三个核心参考档位：
- **快速交互（fast）**：`125ms`，适用于开关切换、复选框点击、图标变换等即时反馈。
- **常规操作（medium）**：`300ms`，适用于下拉菜单展开、卡片悬浮浮起等大多数界面过渡。
- **大型容器进出场（slow）**：`700ms`，适用于全屏抽屉、模态弹窗的推入推出。

相邻档位之间按照约 0.75 的步长递增或递减，数值四舍五入精确到 5 毫秒，保证时序参数规范统一。

## 缓动曲线（Easing）

整套设计系统保留了一条核心标准缓动曲线：
- **`--astryx-ease-standard`**：取值为 `cubic-bezier(0.24, 1, 0.4, 1)`。

该曲线具备自然减速特征：起步响应敏捷，接近终点时平缓减速并平稳归位。

## 共享进出场关键帧

在 `@astryx-vue/core` 的 `styles/motion.css` 中预置了一组通用的进入与退出 CSS 类名。当项目引入了 `@astryx-vue/core/styles.css` 或使用了内置样式的组件后，即可在业务 HTML 元素或 Vue `<Transition>` 中直接复用：

| 进场类名 / 出场类名 | 动画视觉效果 |
| --- | --- |
| `astryx-motion-fade-in` / `astryx-motion-fade-out` | 纯淡入 / 纯淡出 |
| `astryx-motion-scale-in` / `astryx-motion-scale-out` | 缩放轻微放大进场 / 缩小退场 |
| `astryx-motion-slide-in-above` / `out` | 从上方轻微滑入 / 向上滑出 |
| `astryx-motion-slide-in-below` / `out` | 从下方轻微滑入 / 向下滑出 |
| `astryx-motion-slide-in-start` / `out` | 从行起始侧（默认左侧）滑入 / 滑出 |
| `astryx-motion-slide-in-end` / `out` | 从行结束侧（默认右侧）滑入 / 滑出 |

位移距离和缩放比例分别由 `--astryx-motion-offset` 与 `--astryx-motion-scale-from` 变量控制。

## 无障碍减少动效支持（prefers-reduced-motion）

当用户在操作系统辅助功能中启用「减少动态效果（prefers-reduced-motion: reduce）」时，astryx-vue 会自动做出安全响应：
- 大幅度位移距离和缩放比例重置为 0。
- 透明度直接过渡为最终可见状态。
- 通用共享类的过渡时间自动压缩为 `0.01ms`，避免位移与晃动引起晕动反应。

**注意**：为保障交互状态流转正常，组件内部特定的时长令牌保留原始数值，无障碍规则主要通过移除位移与缩放来保障体验。

## 动态效果预览

点击下方的重播按钮，可以实时观察不同动画档位的过渡节奏（若系统开启减少动效，方块将直接呈现在最终位置）：

<TokenReference locale="zh" motion :sections="['duration', 'ease']" />
