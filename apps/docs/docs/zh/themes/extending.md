---
title: 扩展与自定义主题
---

# 扩展与自定义主题

`@astryx-vue/themes` 开箱自带了 7 套主题：Neutral（中性默认）、Butter（黄油暖金）、Chocolate（巧克力暖棕）、Gothic（哥特深邃）、Matcha（抹茶淡绿）、Stone（石石板岩）与 Y2K（复古千禧）。

每一套主题本质上都是一个已经写好的 CSS 文件（例如 `butter.css`）。包内不包含复杂的运行时主题注册或状态管理逻辑，因此运行性能极高、对打包工具完全透明。

## 场景一：只修改个别变量（最常用的做法）

如果你只想微调某个颜色或把所有圆角稍微改大一点，只需要在你的项目样式里覆盖对应的 CSS 变量即可。

**推荐做法：** 将覆盖代码写在 `@layer astryx.overrides` 里面，这样既能稳定覆盖默认主题，又绝对不会破坏组件原有的布局骨架：

```css
/* 确保这段样式在引入 @astryx-vue/themes/neutral.css 之后加载 */
@layer astryx.overrides {
  :root {
    /* 把主文本色调深一点 */
    --astryx-color-text-primary: light-dark(#1a1a1a, #f5f5f5);
    /* 把全站组件的基础圆角改成 8px */
    --astryx-radius-element: 0.5rem;
  }
}
```

## 场景二：在页面局部区域套用计算主题

如果不是全站修改，而是希望某个特定的弹窗、侧边栏或卡片拥有一套独立生成的品牌色，可以使用 Vue 组件 [`Theme`](/components/theme)，搭配核心包导出的 `defineTheme()` 工具函数：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Theme } from '@astryx-vue/core/Theme'
import { defineTheme } from '@astryx-vue/core/theme'

// 基于新的主题色与圆角配置生成主题对象
const customBrandTheme = defineTheme({
  color: {
    accent: '#2563eb', // 将强调色改成品牌蓝
  },
  radius: {
    element: '0.75rem',
  },
})
</script>

<template>
  <!-- 外部维持默认主题 -->
  <Button label="默认风格按钮" />

  <!-- 局部子树应用新主题 -->
  <Theme :theme="customBrandTheme">
    <div class="brand-panel">
      <Button variant="primary" label="品牌风格按钮" />
    </div>
  </Theme>
</template>
```

`Theme` 组件会自动把这一组 CSS 变量注入到当前子树的根节点上，并且会智能重新计算文字、按钮等别名映射，防止样式意外继承到外层已经算好的全局色彩。

## 场景三：只让某个组件与众不同

如果你希望“所有的输入框保持默认，只有主要按钮单独改用定制背景”，可以针对性覆盖该组件的专属变量。

例如在 `packages/themes/neutral/button.css` 里，按钮背景对应的是 `--astryx-button-primary-background`：

```css
@layer astryx.overrides {
  .special-container {
    --astryx-button-primary-background: light-dark(#4338ca, #6366f1);
  }
}
```

## 注意事项

1. **不需要另外准备深浅两套样式表：** 因为变量本身采用 `light-dark()` 机制，覆盖时也推荐同时写下浅色和深色两个取值。
2. **多主题隔离：** 预设主题除了 Neutral 会同时挂在 `:root` 上，其他 6 套都是通过属性选择器 `[data-astryx-theme='...']` 局部隔离的，多主题并存时互不干扰。关于明暗切换的完整细节，请参阅 [深色模式配置](/guide/dark-mode)。
