---
title: 动画
---

# 动画

时长按 Neutral 的运动刻度生成。基准是 fast 125、medium 300、slow 700，相邻档的比例 0.75，结果四舍五入到 5 毫秒。缓动只有一条，`--astryx-ease-standard`，值是 `cubic-bezier(0.24, 1, 0.4, 1)`。

共享的进入和退出关键帧在 `@astryx-vue/core` 的 `styles/motion.css` 里，引入 `@astryx-vue/core/styles.css` 或任意会带上它的组件样式时可用。现有组件仍使用自己的动画名。这组共享名字留给以后的组件，也给主题文档演示：

| 类名 | 关键帧 |
| --- | --- |
| `astryx-motion-fade-in` / `fade-out` | `astryx-fade-in` / `astryx-fade-out` |
| `astryx-motion-scale-in` / `scale-out` | `astryx-scale-in` / `astryx-scale-out` |
| `astryx-motion-slide-in-above` / `out` | 从上 |
| `astryx-motion-slide-in-below` / `out` | 从下 |
| `astryx-motion-slide-in-start` / `out` | 从起始侧 |
| `astryx-motion-slide-in-end` / `out` | 从结束侧 |

位移和缩放读 `--astryx-motion-offset`、`--astryx-motion-scale-from` 和透明度变量。系统开启「减少动态效果」时，这些距离和缩放收成 0，透明度直接落到结束状态，共享类的时长变成 `0.01ms`。组件自己的时长 token 不会被改写。

下面可以再播一次。开启减少动态效果时，样块会直接停在结束状态。

<TokenReference locale="zh" motion :sections="['duration', 'ease']" />
