---
layout: component-docs
title: 单选指示器
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="单选指示器属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>state</code></td><td><code>'unchecked' | 'checked'</code></td><td>—</td><td>必需。单选没有半选。未选中画空心圆。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>20px 或 24px。内点是 8px 或 10px。放在没有尺寸的单选按钮里时不要传，圆保持 18px。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>只改变外观。圆圈变淡，空心圆用柔和背景。禁用的语义留在外面的控件上。</td></tr>
</tbody></table>
</div>

## 插槽

- 默认插槽替换内点，画在圆圈里面。
- 插槽为空，包括条件不成立时，圆圈和内点都还在。
- 插槽内容只作装饰。不要放可聚焦控件。

## 无障碍

- 根元素固定为 `aria-hidden="true"`。
- 组件不设置交互角色，也不提供点击或键盘行为。
- 传入的角色、Tab 顺序、可编辑属性，以及以 aria 开头的属性会被丢掉。
- 暴露的元素是圆圈本身。

## 主题

- `.astryx-radio-indicator`：圆圈。
- `.astryx-radio-indicator-dot`：选中后的内点。
- `data-state`：unchecked 或 checked。
- `data-size`：sm 或 md。没传尺寸时不写。
- `data-disabled`：禁用外观。

选中色先看输入状态色，这样字段的错误和警告仍能着色，否则用强调色。悬停通过祖先上的 `.astryx-indicator-scope` 生效，只在可以悬停的指针上变色。减少动态效果时过渡关掉。强制颜色模式下，未选中用画布色，选中用高亮色。

焦点环由单选按钮画在 `.astryx-radio-native:focus-visible + .astryx-radio-indicator` 上。描边跟着圆圈自己的圆角走。
