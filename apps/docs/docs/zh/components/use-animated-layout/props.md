---
layout: component-docs
title: useAnimatedLayout
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useAnimatedLayout 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>containerRef</code></td>
        <td><code>MaybeRefOrGetter&lt;Element | ComponentPublicInstance | null | undefined&gt;</code></td>
        <td>—</td>
        <td>内容在里面滑动的容器：模板 ref、getter 或元素本身；给组件实例时取它的根元素。变化发生时才读取。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useAnimatedLayout 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>AnimatedLayout</code></td>
        <td><code>AnimatedLayout</code></td>
        <td>不透明的句柄，没有公开成员。传给 <code>Collapsible</code>、<code>TreeList</code> 的 <code>animatedLayout</code> 属性。</td>
      </tr>
    </tbody>
  </table>
</div>
