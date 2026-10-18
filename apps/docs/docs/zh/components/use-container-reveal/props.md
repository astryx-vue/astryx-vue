---
layout: component-docs
title: useContainerReveal
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useContainerReveal 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseContainerRevealOptions</code></td>
        <td><code>{}</code></td>
        <td>露出的配置对象，可以不传。</td>
      </tr>
      <tr>
        <td><code>options.isEnabled</code></td>
        <td><code>MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>true</code></td>
        <td>为 false 时这个 hook 完全失效：容器拿不到类，内容也拿不到类，内容一直可见。每次调用都会重新读，所以组件挂载后也能改（例如按 <code>revealOn === "hover"</code> 决定）。</td>
      </tr>
      <tr>
        <td><code>containerProps(options?).hoverDelay</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>指针要停多少毫秒才开始露出，和 Tooltip、HoverCard 的延时一样，是个「确认要悬停」的闸门：光标扫过列表时不会把沿途的行都点亮。键盘和粗指针不等待。</td>
      </tr>
      <tr>
        <td><code>containerProps(options?).forceState</code></td>
        <td><code>'active' | 'inactive'</code></td>
        <td>—</td>
        <td>把触发状态钉住，交给调用方掌管的时候用：动效门控、滚动中、行的菜单已打开。<code>'inactive'</code> 仍然让键盘焦点和粗指针看见内容。</td>
      </tr>
      <tr>
        <td><code>contentProps(options?).isRevealInverted</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>反过来：平时可见，悬停时藏起。只影响指针，键盘焦点和触摸照样能看到。</td>
      </tr>
      <tr>
        <td><code>contentProps(options?).isLayoutPreserved</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>藏起时仍占住原来的位置（只改不透明度），避免布局跳动。</td>
      </tr>
      <tr>
        <td><code>contentProps(options?).forceVisibility</code></td>
        <td><code>'shown' | 'hidden'</code></td>
        <td>—</td>
        <td>单独钉住这一个元素的可见性，不跟容器走。<code>'hidden'</code> 在焦点进来时仍会露出。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useContainerReveal 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>containerProps</code></td>
        <td><code>(options?: ContainerRevealOptions) =&gt; { class?: string | Record&lt;string, boolean&gt;, style?: CSSProperties }</code></td>
        <td>绑在容器上，容器的悬停和 focus-within 决定露出。可以传 <code>hoverDelay</code> 和 <code>forceState</code>。hook 关掉时返回空对象。</td>
      </tr>
      <tr>
        <td><code>contentProps</code></td>
        <td><code>(options?: ContentRevealOptions) =&gt; { class?: string | Record&lt;string, boolean&gt; }</code></td>
        <td>绑在每一个要露出或要藏起的子元素上。可以传 <code>isRevealInverted</code>、<code>isLayoutPreserved</code> 和 <code>forceVisibility</code>。hook 关掉时返回空对象。</td>
      </tr>
    </tbody>
  </table>
</div>
