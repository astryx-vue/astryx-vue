---
layout: component-docs
title: 基础自动补全
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="BaseTypeahead 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>modelValue</code></td><td><code>T | null</code></td><td><code>null</code></td><td>当前选中的条目。空表示还没选。</td></tr>
<tr><td><code>searchSource</code></td><td><code>SearchSource&lt;T&gt;</code></td><td>—</td><td>静态或者异步的搜索源，要有 <code>search</code>，可选 <code>bootstrap</code>。必填。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>输入框的无障碍名。外面已经有 <code>&lt;label for&gt;</code> 指过来时就不用传。</td></tr>
<tr><td><code>inputId</code></td><td><code>string</code></td><td>自动生成</td><td>输入框的 id，好让外面的标签对上。</td></tr>
<tr><td><code>describedBy</code></td><td><code>string</code></td><td>—</td><td>外面已经算好的说明和状态文案的 id。</td></tr>
<tr><td><code>ariaDescribedBy</code></td><td><code>string</code></td><td>—</td><td>专给输入框用的 <code>aria-describedby</code> 别名。写了它就以它为准。</td></tr>
<tr><td><code>ariaLabelledBy</code></td><td><code>string</code></td><td>—</td><td>专给输入框用的 <code>aria-labelledby</code> 别名。写了它就以它为准。</td></tr>
<tr><td><code>anchorRef</code></td><td><code>HTMLElement | null</code></td><td>—</td><td>下拉挂靠的元素，也用它来量宽度。不传就用输入框自己那层。</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Search…</code></td><td>占位文字，还没选东西时显示。</td></tr>
<tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用输入框。</td></tr>
<tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>为什么禁用。悬停或键盘聚焦时弹出提示，同时当说明念出来，输入框保持可聚焦。</td></tr>
<tr><td><code>isFocusableDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>强制让禁用的输入框还能聚焦（用 <code>aria-disabled</code> 加 <code>readonly</code>），这样调用方给的禁用原因读得到。文字还是打不进去。</td></tr>
<tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>输入框边框的校验色。提示文案由调用方的字段自己负责。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>输入框和下拉每一行的大小。</td></tr>
<tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示清除按钮。</td></tr>
<tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>打字停多久才开始搜，单位毫秒。本地数据可以设 0。</td></tr>
<tr><td><code>maxMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>下拉最多显示多少行。</td></tr>
<tr><td><code>menuWidth</code></td><td><code>number</code></td><td>—</td><td>下拉想要的宽度，单位像素。不会比挂靠元素窄，也不会超出视口。</td></tr>
<tr><td><code>minQueryLength</code></td><td><code>number</code></td><td><code>1</code></td><td>至少打几个字才搜，按看得见的字符数算。不够就不搜，下拉也不开。</td></tr>
<tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>一聚焦、还没打字就把结果列出来。是 <code>hasEntriesOnFocus</code> 的旧名字，两个开一个就行。</td></tr>
<tr><td><code>hasEntriesOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>一聚焦、还没打字就把结果列出来。</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>挂载后自动把光标放进输入框。</td></tr>
<tr><td><code>emptyText</code></td><td><code>string | null</code></td><td>—</td><td>数据源一条都没有时显示的文字。</td></tr>
<tr><td><code>emptySearchText</code></td><td><code>string | null</code></td><td>跟随语言的「没有找到结果」</td><td>搜不到东西时显示的文字。<code>null</code> 当作没传，用默认那句；传空字符串就什么都不画。</td></tr>
<tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>把这个输入框标成必填。</td></tr>
<tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>表单字段名。提交的是选中条目的 id。</td></tr>
<tr><td><code>inputTabIndex</code></td><td><code>number</code></td><td>—</td><td>输入框在 Tab 顺序里的位置。</td></tr>
</tbody></table>
</div>

## 事件

- `update:modelValue(value: T | null)` / `change(value: T | null)`：选中、或者清空了。
- `search(query: string)` / `changeQuery(query: string)`：搜索词变了。两个都会发，`search` 是旧名字。
- `openChange(isOpen: boolean)`：下拉开了或者关了。

上面没列的原生属性和监听器都会落到输入框上，所以 `@keydown`、`@focus`、`@blur` 和 `aria-*` 跟写在普通 `<input>` 上一样。`keydown` 监听器跑在内置键盘处理之前，想跳过内置处理就调 `event.preventDefault()`。

## 插槽

- `icon`：输入框开头的图案。这层对读屏是隐藏的。
- `item`：换掉默认那一行，会收到 `item`、`isActive` 和 `isSelected`。负责高亮、选中、指针和键盘的外壳还在。
- `empty`：换掉「没有结果」的内容。
