---
layout: component-docs
title: 指示器
outline: false
footer: false
---

## 共用属性

勾、方框和圆点接受同一组属性。方框多一个半选状态。勾和圆点只有未选和选中。

<div class="component-api-table" role="region" aria-label="指示器属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>state</code></td><td>见下表</td><td>—</td><td>必需。要画出的状态。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>方框和圆点在小尺寸是 20px，中等尺寸是 24px。勾的图形两种尺寸都是 1rem，尺寸仍会写到元素上。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>只改变外观。禁用的语义留在外面的控件上。</td></tr>
</tbody></table>
</div>

<div class="component-api-table" role="region" aria-label="指示器状态" tabindex="0">
<table><thead><tr><th>图形</th><th>状态</th><th>未选中时</th></tr></thead><tbody>
<tr><td>勾</td><td><code>'unchecked' | 'checked'</code></td><td>没有插槽时不渲染，列表不留空位。</td></tr>
<tr><td>方框</td><td><code>'unchecked' | 'checked' | 'indeterminate'</code></td><td>空盒子。半选画短线。</td></tr>
<tr><td>圆点</td><td><code>'unchecked' | 'checked'</code></td><td>空心圆。不传尺寸、又放在单选按钮里时，圆是 18px，点是 8px。</td></tr>
</tbody></table>
</div>

## 插槽

- 默认插槽替换状态标记，内容只作装饰。
- 方框和圆点在插槽为空时仍画原来的标记，包括条件不成立的情况。
- 勾在插槽里有可渲染内容时，用 1rem 的盒子占住位置，选中与否都一样。没有可渲染内容时，未选中不渲染。
- 判断一份内容算不算可渲染，用 isRenderable。空值、布尔值、空字符串、注释和只有空白的文本都不算。元素算，哪怕它里面后来是空的。
- 不要在插槽里放可聚焦控件。

## 注册表

<div class="component-api-table" role="region" aria-label="指示器注册表" tabindex="0">
<table><thead><tr><th>名称</th><th>来自</th><th>说明</th></tr></thead><tbody>
<tr><td><code>useIndicator(name)</code></td><td><code>@astryx-vue/core/Indicator</code></td><td>最近主题里这个名字对应的组件。核心名字一定有。也从包根导出。</td></tr>
<tr><td><code>getIndicator(name, theme)</code></td><td>同上</td><td>不在组件里时按主题对象解析。没有主题时用默认图形。</td></tr>
<tr><td><code>defaultIndicators</code></td><td>同上</td><td>勾、方框、圆点三份默认组件。</td></tr>
<tr><td><code>isCoreIndicatorName(name)</code></td><td>同上</td><td>是否为上面三个核心名字。</td></tr>
<tr><td><code>isRenderable(value)</code></td><td>同上</td><td>插槽或节点是否应该替换标记。</td></tr>
<tr><td><code>defineTheme({ indicators })</code></td><td><code>@astryx-vue/core/Theme</code></td><td>按名字替换图形。和被扩展的主题浅合并，当前这份优先。</td></tr>
</tbody></table>
</div>

选择器可以用 indicatorPosition 把标记放在选项开头或末尾，默认在末尾。标记列为空时不占宽。

## 主题

方框的变量和 [复选指示器](/components/checkbox-indicator/props#主题) 相同。圆点用下面这些类和状态。

- `.astryx-radio-indicator`：圆圈。
- `.astryx-radio-indicator-dot`：选中后的内点。
- `.astryx-check-indicator`：勾的插槽占位，宽高 1rem。选中且没有插槽时，类落在图标上。
- `data-state`：unchecked 或 checked。方框还可以是 indeterminate。
- `data-size`：sm 或 md。单选按钮没传尺寸时不写这个属性。
- `data-disabled`：禁用外观。

圆点的选中色先看输入状态色，这样字段的错误和警告仍能着色，否则用强调色。悬停通过祖先上的 `.astryx-indicator-scope` 生效，只在可以悬停的指针上变色。减少动态效果时过渡关掉。强制颜色模式下，未选中用画布色，选中用高亮色。

勾选中时用强调色图标，禁用时用禁用色。两种尺寸都是小图标。
