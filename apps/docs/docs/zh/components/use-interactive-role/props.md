---
layout: component-docs
title: useInteractiveRole
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useInteractiveRole 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options.href</code></td>
        <td><code>string | undefined</code>，或它的 ref / 取值函数</td>
        <td>—</td>
        <td>要跳转的地址。优先级最高：有非空地址就是链接。</td>
      </tr>
      <tr>
        <td><code>options.hasOnClick</code></td>
        <td><code>boolean</code>，或它的 ref / 取值函数</td>
        <td><code>false</code></td>
        <td>组件有没有点击处理。地址之后轮到它：有就是按钮。上游收的是处理函数本身，这里收布尔值是为了把处理函数和取值函数分开。</td>
      </tr>
      <tr>
        <td><code>options.isDisabled</code></td>
        <td><code>boolean</code>，或它的 ref / 取值函数</td>
        <td><code>false</code></td>
        <td>为真时判断角色不看 href（停用的链接本身就不该是链接），于是角色从点击往下找，都没有就是 inert。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useInteractiveRole 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>role</code></td>
        <td><code>ComputedRef&lt;'link' | 'button' | 'inert'&gt;</code></td>
        <td>组件该渲染的元素：链接渲染 <code>a</code>，按钮渲染 <code>button</code>，剩下的是不带交互的 <code>span</code> / <code>div</code>。</td>
      </tr>
    </tbody>
  </table>
</div>
