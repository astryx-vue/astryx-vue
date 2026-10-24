---
layout: component-docs
title: 文件输入框
outline: false
footer: false
---

## FileInput 属性

<div class="component-api-table" role="region" aria-label="FileInput 属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>File | File[] | null</code></td><td><code>null</code></td><td>选中的文件。打开 <code>isMultiple</code> 时为数组。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必填。无障碍名称。</td></tr>
<tr><td><code>accept</code></td><td><code>string</code></td><td>—</td><td>HTML accept 列表，例如 <code>.pdf,.docx</code> 或 <code>image/*</code>。</td></tr>
<tr><td><code>isMultiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否允许多个文件。</td></tr>
<tr><td><code>maxSize</code></td><td><code>number</code></td><td>—</td><td>单个文件的最大字节数。</td></tr>
<tr><td><code>maxFiles</code></td><td><code>number</code></td><td>—</td><td>多选时的文件数量上限。</td></tr>
<tr><td><code>mode</code></td><td><code>'input' | 'dropzone'</code></td><td><code>'input'</code></td><td>紧凑输入框，或虚线拖放区。</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>选择文件</code></td><td>未选择时的文字，跟随语言。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>高度，分别是 28、32、36px。</td></tr>
<tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>错误、警告或成功。未传时，被拒绝的文件会自己产生错误。</td></tr>
<tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>状态消息的位置。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁止打开选择器，也不接受拖放。</td></tr>
<tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因。和 <code>isDisabled</code> 一起用时，悬停或键盘聚焦会显示这段提示，触发按钮仍可聚焦（带 <code>aria-disabled</code>），但打不开文件选择框。</td></tr>
<tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签末尾信息图标里的说明。</td></tr>
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标记为必填。</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示加载指示，用于上传过程。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的说明。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>整个字段的宽度。数字按像素处理。</td></tr>
<tr><td><code>changeAction</code></td><td><code>(files) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>选中和清除之后调用。失败时发出 <code>actionError</code>，等待期间显示加载指示。</td></tr>
<tr><td><code>clearLabel</code></td><td><code>string</code></td><td>—</td><td>清除按钮的读屏名称，默认带字段名。提示只说「清除」。</td></tr>
<tr><td><code>containerClass</code></td><td><code>string | object | array</code></td><td>—</td><td>加到字段外壳的 class。在 InputGroup 和横向标签的 FormLayout 里没有外壳，此时不生效，开发环境会警告。</td></tr>
<tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到字段外壳的行内样式。</td></tr>
<tr><td><code>controlClass</code></td><td><code>string | object | array</code></td><td>—</td><td>加到文件框本体的 class。直接写在组件上的 class 也落在本体，不会警告。</td></tr>
<tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到文件框本体的行内样式。直接写在组件上的 style 也落在本体。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="FileInput 事件" tabindex="0">
<table><thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead><tbody>
<tr><td><code>update:modelValue</code></td><td><code>File | File[] | null</code></td><td>选择变化时触发。</td></tr>
<tr><td><code>change</code></td><td><code>File | File[] | null</code></td><td>携带同一个值。发生在 <code>changeAction</code> 之前。</td></tr>
<tr><td><code>actionError</code></td><td><code>unknown, File | File[] | null</code></td><td><code>changeAction</code> 抛错时触发。</td></tr>
</tbody></table>
</div>
