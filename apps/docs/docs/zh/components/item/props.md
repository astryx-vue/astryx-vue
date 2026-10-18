---
layout: component-docs
title: 条目
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Item 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>这一行的主文字。写字符串或数字时只显示一行；要放别的内容就用 <code>label</code> 插槽。</td></tr>
<tr><td><code>description</code></td><td><code>string | number</code></td><td>—</td><td>主文字下面那行小字，同样只显示一行。要多行或者放别的内容就用 <code>description</code> 插槽。</td></tr>
<tr><td><code>as</code></td><td><code>ItemElement</code>（标签名或组件）</td><td><code>'div'</code></td><td>根元素渲染成什么。只有在这一行自带 <code>role</code>、键盘交给父级管、并且行里不会多出一个 Tab 停留点时，才传组件；另外 <code>startContent</code> 和 <code>endContent</code> 里也不能放控件。</td></tr>
<tr><td><code>align</code></td><td><code>'center' | 'start'</code></td><td><code>'center'</code></td><td>前面和后面那两块内容竖直方向怎么对齐。</td></tr>
<tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td><code>'balanced'</code></td><td>疏密。<code>compact</code> 上下各 4px，<code>balanced</code> 8px，<code>spacious</code> 上下左右各 12px。</td></tr>
<tr><td><code>layout</code></td><td><code>'stacked' | 'inline'</code></td><td><code>'stacked'</code></td><td><code>stacked</code> 让说明单独占一行。<code>inline</code> 把说明和主文字放同一行，空间不够先截断说明，这样这一行能塞进高度固定的容器。</td></tr>
<tr><td><code>labelLines</code></td><td><code>number</code></td><td>—</td><td>主文字最多显示几行，超过就用省略号。不传时，字符串主文字只显示一行。</td></tr>
<tr><td><code>descriptionLines</code></td><td><code>number</code></td><td>—</td><td>说明最多显示几行，超过就用省略号。不传时，字符串说明只显示一行。</td></tr>
<tr><td><code>onClick</code></td><td><code>(event: MouseEvent) =&gt; void</code></td><td>—</td><td>点了之后做什么。给了它就渲染一个铺满行内容区的按钮，这一行也就有了按钮语义和悬停、按下样式。模板里写 <code>@click</code>。</td></tr>
<tr><td><code>interactiveRef</code></td><td><code>MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;</code></td><td>—</td><td>指向行里那个本来就能操作的控件，比如 <code>startContent</code> 里的复选框。这时整行变成更大的点击区域，点行面就转给那个控件，行自己不再渲染按钮。它和 <code>onClick</code>、<code>href</code> 只能用一个，写了它那两个会被忽略。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>链接地址。行里会渲染一个链接元素。如果根元素本身就是链接组件（见 <code>as</code>），地址直接挂在根上，不再多画一个元素。</td></tr>
<tr><td><code>target</code></td><td><code>'_blank' | '_self'</code></td><td>—</td><td>链接在哪打开，只有写了 <code>href</code> 才有用。<code>_blank</code> 会自动补上 <code>noopener</code> 和 <code>noreferrer</code>。</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>链接的 rel 值，会和自动补的那些合在一起。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用。这一行不动了，内容变淡。</td></tr>
<tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>选中状态。行的角色支持时写成 <code>aria-selected="true"</code>，不支持时写成 <code>aria-current="true"</code>。</td></tr>
<tr><td><code>isHighlighted</code></td><td><code>boolean</code></td><td><code>false</code></td><td>画出高亮状态，就是键盘聚焦和鼠标悬停时那个样子。</td></tr>
<tr><td><code>swipeActions</code></td><td><code>ItemSwipeActions</code></td><td>—</td><td>手指横滑能露出哪些操作，左右各一组，越靠后越靠外，每项是 <code>{ label, icon?, onActivate, isDisabled?, variant?, hasRemoval? }</code>。鼠标不会触发这次拖动。只有角色允许行内有可交互元素的才行，选项、菜单项、原生单选按钮的放大目标行都不能用。</td></tr>
<tr><td><code>swipeBehavior</code></td><td><code>'reveal' | 'commit'</code></td><td><code>'reveal'</code></td><td><code>reveal</code> 松手后行停在滑开的位置，露出来的每项都是真按钮，拖得够远就触发最外面那个；<code>commit</code> 直接把行滑出去，松手就触发，什么都不留在屏幕上。</td></tr>
</tbody></table>
</div>

## 插槽

- `marker`：排在 `startContent` 前面，比如列表的圆点或者序号。
- `startContent`：前面那块，比如头像、图标、图片、复选框。
- `label`：自己画主文字，替掉 `label` 属性。
- `description`：自己画说明，替掉 `description` 属性。
- `endContent`：末尾对齐的那块，比如徽章、时间、操作按钮。

## 暴露

`element`（根元素）、`focus()` 和 `blur()`。聚焦会落到行里那个真正能接焦点的控件上。
