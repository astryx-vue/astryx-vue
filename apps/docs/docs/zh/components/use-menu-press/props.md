---
layout: component-docs
title: useMenuPress
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useMenuPress 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MenuPressOptions</code></td>
        <td>—</td>
        <td>配置对象。必填。</td>
      </tr>
      <tr>
        <td><code>options.menuRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>带 <code>role="menu"</code> 的菜单根，也就是按压要从哪些行里挑的表面。必填。</td>
      </tr>
      <tr>
        <td><code>options.isEnabled</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>—</td>
        <td>这套按压模型当前是否生效，每次按下时读。传菜单的打开状态即可。必填。</td>
      </tr>
      <tr>
        <td><code>options.onDismiss</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>鼠标在菜单外松开、且什么都没执行时调用：关闭菜单。手指在菜单外松开则让菜单继续开着，那种情况不会调用它。必填。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useMenuPress 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>onPointerDown</code></td>
        <td><code>(event: PointerEvent) =&gt; void</code></td>
        <td>绑在菜单根的 <code>pointerdown</code> 上。接下从根内某一行开始的按压，并把那个指针一路跟到松开。</td>
      </tr>
    </tbody>
  </table>
</div>

模块还导出 `resetMenuPress()`，用来清掉已经布好的「吞掉多余 click」。表面在 hook 自己的拆卸之外被移除时调用它，测试里也用得上。
