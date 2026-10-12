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
<tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标记为必填。</td></tr>
<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示加载指示，用于上传过程。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的说明。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>整个字段的宽度。数字按像素处理。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="FileInput 事件" tabindex="0">
<table><thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead><tbody>
<tr><td><code>update:modelValue</code></td><td><code>File | File[] | null</code></td><td>选择变化时触发。</td></tr>
<tr><td><code>change</code></td><td><code>File | File[] | null</code></td><td>携带同一个值。</td></tr>
</tbody></table>
</div>
