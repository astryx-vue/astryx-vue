---
title: 动画与过渡
---

# 动画与过渡

界面的动效就像演员走位时的节奏感：太快了显得生硬突兀，太慢了又让人觉得卡顿拖沓。astryx-vue 的动效体系沿袭了 Astryx 的标准规范，旨在提供干脆、克制且符合物理规律的交互体验。

## 动画时长梯级（Duration）

动画时长基于 Neutral 预设的运动刻度计算而成。系统划定了三个基础参考档位：
- **快速交互（fast）：** `125ms`，适合开关、复选框点击、图标翻转等微小的即时反馈。
- **常规操作（medium）：** `300ms`，适合下拉菜单展开、卡片悬浮浮起等大多数界面过渡。
- **大型进出场（slow）：** `700ms`，适合大型全屏抽屉、模态弹窗的推入推出。

相邻档位之间按照约 0.75 的步长递增或递减，最终结果四舍五入精确到 5 毫秒，避免出现不规则的零碎时间。

## 缓动曲线（Easing）

核心是一条标准缓动曲线，另外三条各管一种场景：
- **`--astryx-ease-standard`**：`cubic-bezier(0.24, 1, 0.4, 1)`，起步快、快到终点时慢慢落定，用于状态切换。
- **`--astryx-ease-entrance`** 和 **`--astryx-ease-move`**：进场和屏幕内移动用的曲线，默认就等于标准曲线。
- **`--astryx-ease-exit`**：`cubic-bezier(0.3, 0, 0.6, 0.6)`，越走越快，用于东西离开。

收起、关闭这类退场用 `--astryx-duration-exit`，它默认指向 `--astryx-duration-fast`。

## 节奏和性格：tempo 与 character

主题的 `motion` 里有两个旋钮，不用一个个改时长就能换整体手感：

- **`tempo`**：整体快慢，范围 0.75 到 1.5，默认 1。数字越大越慢：`1.2` 表示每个时长都乘以 1.2，再取整到毫秒。超出范围的值会被夹到边界。组件里的弹簧动画（比如 `useAnimator`）也跟着这个节奏走。
- **`character`**：进场和移动的「性格」。`'crisp'` 干脆利落，`'expressive'` 带一点回弹，`'standard'`（默认）就用标准曲线。退场曲线不受影响。

```ts
const calm = defineTheme({
  name: 'calm',
  motion: { tempo: 1.2, character: 'expressive' },
})
```

几条规则：
- 写了 `fast`、`medium`、`ratio` 这组时长刻度时，刻度算出的时长优先，`tempo` 只缩放刻度没管到的那些。刻度要写就三个都写全，缺一个会直接报错，而不是悄悄丢掉。
- `tokens` 里明确写的值永远最优先。
- 子主题（`extends`）没写的旋钮沿用父主题的。自适应规则（`adaptations`）里也能写这两个旋钮，比如触屏上放慢一点。
- 不写 `motion` 的主题不会输出任何动效 token，渲染结果和以前完全一样。

## 共享进出场关键帧

在 `@astryx-vue/core` 的 `styles/motion.css` 中，我们预制了一组通用的进入与退出 CSS 类名。只要你的项目引入了 `@astryx-vue/core/styles.css` 或者使用了带样式的组件，就可以在任何你自己的 HTML 元素或 Vue 过渡（`<Transition>`）中直接复用它们：

| 进场类名 / 出场类名 | 动画视觉效果 |
| --- | --- |
| `astryx-motion-fade-in` / `astryx-motion-fade-out` | 纯淡入 / 纯淡出 |
| `astryx-motion-scale-in` / `astryx-motion-scale-out` | 缩放轻微放大进场 / 缩小退场 |
| `astryx-motion-slide-in-above` / `out` | 从上方轻微滑入 / 向上滑出 |
| `astryx-motion-slide-in-below` / `out` | 从下方轻微滑入 / 向下滑出 |
| `astryx-motion-slide-in-start` / `out` | 从行起始侧（默认左侧）滑入 / 滑出 |
| `astryx-motion-slide-in-end` / `out` | 从行结束侧（默认右侧）滑入 / 滑出 |

位移距离和缩放比例分别由 `--astryx-motion-offset` 与 `--astryx-motion-scale-from` 变量控制。

## 关爱易眩晕用户：无障碍减少动效支持

如果用户在操作系统的辅助功能中开启了「减少动态效果（prefers-reduced-motion: reduce）」，astryx-vue 会自动做出安全响应：
- 所有位移距离和缩放比例自动归零。
- 透明度直接瞬间跳到最终可见状态。
- 通用共享类的过渡时间自动缩短为极微小的 `0.01ms`，彻底避免画面大幅晃动对晕动症或光敏感用户造成身体不适。

**注意：** 为了保证关键交互状态不发生破坏性错位，组件自身特定的内部时长 token 保持原值，无障碍规则主要通过限制大幅位移与缩放来保障体验。

## 动态效果预览

点击下方的重播按钮，可以实时观察不同动画档位的过渡节奏（如果你在系统设置里开启了减少动态效果，方块会直接停留在最终位置）：

<TokenReference locale="zh" motion :sections="['duration', 'ease']" />
