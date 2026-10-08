---
layout: component-docs
title: 分段控件
outline: false
footer: false
---

## SegmentedControl Props

<div class="component-api-table" role="region" aria-label="SegmentedControl Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>当前选中分段的取值，必填，支持 <code>v-model</code>。与它相等的那个分段就是选中项。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>单选组的无障碍名称，写入 <code>aria-label</code>，不在页面上渲染，必填。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>SegmentedControlSize</code></td>
        <td><code>'md'</code></td>
        <td>控件尺寸，决定每个分段的高度，可选 sm、md、lg。</td>
      </tr>
      <tr>
        <td><code>layout</code></td>
        <td><code>SegmentedControlLayout</code></td>
        <td><code>'hug'</code></td>
        <td>分段占用宽度的方式。hug 按内容取宽并受容器限制，标签过窄时截断；fill 让分段平均分摊容器宽度。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否禁用整个控件。所有分段都不能被选择，控件退出 Tab 顺序。</td>
      </tr>
      <tr>
        <td><code>disabledMessage</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>禁用原因，在悬停和键盘聚焦时以提示气泡显示。与 isDisabled 一起使用时，控件保持 <code>aria-disabled</code> 而不是完全不可聚焦，让原因能被键盘和辅助技术读到，选择仍然被阻止。请用它代替把禁用控件包进 Tooltip。</td>
      </tr>
    </tbody>
  </table>
</div>

## SegmentedControl 事件

<div class="component-api-table" role="region" aria-label="SegmentedControl 事件" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>update:modelValue</code></td>
        <td>选中项变化时触发，用于 <code>v-model</code> 的双向绑定。点击已经选中的分段不会触发。</td>
      </tr>
      <tr>
        <td><code>change</code></td>
        <td>选中项变化时触发，适合在切换后执行加载数据等操作。</td>
      </tr>
    </tbody>
  </table>
</div>

## SegmentedControl Slots

<div class="component-api-table" role="region" aria-label="SegmentedControl Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>放置 <code>SegmentedControlItem</code> 的默认插槽，顺序即分段的显示顺序。</td>
      </tr>
    </tbody>
  </table>
</div>

## SegmentedControlItem Props

<div class="component-api-table" role="region" aria-label="SegmentedControlItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>该分段的唯一取值，与控件的 <code>v-model</code> 比较，相等即为选中项，必填。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>分段名称，渲染为可见文字；隐藏标签时作为无障碍名称，必填。</td>
      </tr>
      <tr>
        <td><code>isLabelHidden</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否在视觉上隐藏标签，只显示图标。标签仍会写入 <code>aria-label</code>。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否禁用这单独一个分段。它仍占据原来的位置，但不能被选择，方向键和 Tab 顺序都会跳过它。</td>
      </tr>
    </tbody>
  </table>
</div>

## SegmentedControlItem Slots

<div class="component-api-table" role="region" aria-label="SegmentedControlItem Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>icon</code></td>
        <td>显示在标签前的图标，通常是一个图标类或你自己的 SVG。它对辅助技术隐藏（分段自身已经提供了名称）。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `div`，每个分段为 `button`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性（`aria-label`、`aria-disabled`、`aria-describedby` 由组件根据 `label` 和 `isDisabled` 推导，不可覆盖）。
- `data-*` 属性。
- `class`。
- `style`。

`SegmentedControlItem` 上的 `class` 会与组件自身的类名合并。`role`、`aria-checked`、`aria-disabled`、`aria-label`、`tabindex` 和 `data-value` 由组件计算（`aria-label` 只在 `isLabelHidden` 时写入 `label`），并覆盖同名的原生属性。
