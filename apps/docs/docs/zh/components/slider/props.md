---
layout: component-docs
title: 滑块
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="属性列表" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>number | [number, number]</code></td><td>—</td><td>必需。单值或区间值。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必需。滑块名称。</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>关联 ID 的前缀。省略时自动生成。</td></tr>
<tr><td><code>min</code></td><td><code>number</code></td><td>0</td><td>最小值。</td></tr>
<tr><td><code>max</code></td><td><code>number</code></td><td>100</td><td>最大值。</td></tr>
<tr><td><code>step</code></td><td><code>number</code></td><td>1</td><td>每步的增量。必须大于 0。</td></tr>
<tr><td><code>minStepsBetweenThumbs</code></td><td><code>number</code></td><td>0</td><td>区间两个滑块之间的最小步数。</td></tr>
<tr><td><code>orientation</code></td><td><code>&#x27;horizontal&#x27; | &#x27;vertical&#x27;</code></td><td>horizontal</td><td>滑动方向。</td></tr>
<tr><td><code>valueDisplay</code></td><td><code>&#x27;tooltip&#x27; | &#x27;text&#x27; | &#x27;none&#x27;</code></td><td>tooltip</td><td>数值的显示方式。</td></tr>
<tr><td><code>formatValue</code></td><td><code>(value: number) =&gt; string</code></td><td>—</td><td>格式化显示值和无障碍数值文本。</td></tr>
<tr><td><code>marks</code></td><td><code>SliderMark[]</code></td><td>—</td><td>刻度列表。每项包含 value 和可选的 label。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的说明。</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>隐藏视觉标签。保留无障碍名称。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>阻止修改。不提交表单值。</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因。提供原因时，禁用滑块仍可聚焦。</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示必填提示。不会执行原生必填校验。</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示可选提示。优先于 isRequired。</td></tr>
<tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>必填提示文本。</td></tr>
<tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>可选提示文本。</td></tr>
<tr><td><code>minLabel</code></td><td><code>string</code></td><td>Minimum value</td><td>区间下限的无障碍名称。</td></tr>
<tr><td><code>maxLabel</code></td><td><code>string</code></td><td>Maximum value</td><td>区间上限的无障碍名称。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>整个字段的宽度。数字按 px 处理。</td></tr>
<tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>隐藏表单字段的名称。</td></tr>
<tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>关联表单的 ID。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>字段的错误、警告或成功状态。</td></tr>
<tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>标签前的装饰图标。</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁的信息提示。</td></tr>
<tr><td><code>containerClass</code></td><td><code>string</code></td><td>—</td><td>加到字段外壳上的 class。横向标签的表单里没有外壳，这时不生效。</td></tr>
<tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到字段外壳上的行内样式。</td></tr>
<tr><td><code>controlClass</code></td><td><code>string</code></td><td>—</td><td>加到轨道容器上的 class，不会落到滑块拇指上。</td></tr>
<tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到轨道容器上的行内样式。</td></tr>
</tbody></table>
</div>

## 事件

- `update:modelValue(value)`：更新单值或区间。
- `change(value)`：数值改变时触发。
- `changeEnd(value)`：拖动结束、指针取消或键盘调整结束时触发。

键盘每次有效按键都触发 `changeEnd`。
到达边界后，值不变时不触发 `change`。
拖动过程中禁用组件会中止本次拖动。
中止时不触发 `changeEnd`。

## 区间与步长

- 单值模式使用 `number`。
- 区间模式使用 `[number, number]`。
- 步长从 `min` 开始计算。
- 最小间隔为 `minStepsBetweenThumbs × step`。
- 两个滑块不能越过彼此。
- 越界的传入值按边界显示。
- 传入区间按从小到大显示。
- 组件不会因修正显示值而主动修改绑定值。
- 非正步长按 `1` 处理。
- `max` 小于 `min` 时，区间收缩到 `min`。

## 表单

- 设置 `htmlName` 后，单值提交一个隐藏字段。
- 区间提交两个同名隐藏字段。
- 使用 `FormData.getAll(name)` 读取区间。
- 禁用滑块不提交值。
- 原生表单重置不会改变 `v-model`。
- 需要重置值时，在表单的 `reset` 事件中更新绑定值。

## 模板引用与属性

- `element`：滑动区域的 `HTMLDivElement | null`。
- `focus(index = 0, options?)`：聚焦指定滑块。
- `blur()`：移除滑块焦点。
- `class`、`style` 和其他属性应用于字段外层。
- `aria-labelledby` 和 `aria-describedby` 合并到每个滑块。
- 组件管理滑块的角色、当前值、边界和禁用状态。
- `labelIcon` 插槽替换标签图标。

## 主题

```css
.my-slider {
  --astryx-slider-accent: #047857;
  --astryx-slider-focus: #047857;
  --astryx-slider-height: 200px;
}
```

- `--astryx-slider-track`：未选轨道颜色。
- `--astryx-slider-accent`：已选轨道和滑块颜色。
- `--astryx-slider-focus`：键盘焦点颜色。
- `--astryx-slider-height`：垂直滑块的高度。

滑块直径固定为 `20px`。轨道厚度为 `4px`。
Neutral 自动适配明暗模式。
