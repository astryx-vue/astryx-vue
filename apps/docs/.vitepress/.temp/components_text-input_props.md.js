import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/text-input/props.md
var __pageData = JSON.parse("{\"title\":\"文本输入框\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"文本输入框\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/text-input/props.md\",\"filePath\":\"zh/components/text-input/props.md\"}");
var _sfc_main = { name: "components/text-input/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="textinput-props" tabindex="-1">TextInput Props <a class="header-anchor" href="#textinput-props" aria-label="Permalink to “TextInput Props”">​</a></h2><div class="component-api-table" role="region" aria-label="TextInput Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>modelValue</code></td><td><code>string</code></td><td>必需</td><td>输入框的当前值，一般通过 v-model 绑定。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>字段的可见标签。即使被隐藏，也会作为控件的名称提供给辅助技术。</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>在视觉上隐藏标签与说明，同时保留它们与控件的无障碍关联。</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>显示在标签下方、控件上方的补充说明文字。</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>禁用输入框。被禁用的字段不参与表单提交。</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示“可选”提示。与 isRequired 同时设置时，isOptional 优先。</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示“必填”提示，组件同时会设置 aria-required。</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>显示在标签前的图标组件。与 labelIcon 插槽同时使用时，插槽优先。</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>在标签旁显示信息按钮，悬停、键盘聚焦或点击都可以查看提示。</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>“可选”提示的显示文字，用于本地化。</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>“必填”提示的显示文字，用于本地化。</td></tr><tr><td><code>id</code></td><td><code>string</code></td><td>自动生成</td><td>原生 input 的 ID。设置后会同步更新标签与说明的关联。</td></tr><tr><td><code>type</code></td><td><code>&#39;text&#39; | &#39;password&#39; | &#39;email&#39;</code></td><td>text</td><td>输入框类型。多行内容请改用 TextArea。</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39; | &#39;lg&#39;</code></td><td>md</td><td>输入框高度。Neutral 主题下三档分别为 28、32、36px。</td></tr><tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>内容不可编辑，但输入框保留焦点、正常显示，值仍会参与表单提交。</td></tr><tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>说明禁用原因。设置后改用 aria-disabled 与 readonly 保留焦点，方便用户查看原因；字段仍不可修改，也不会随表单提交。</td></tr><tr><td><code>startIcon</code></td><td><code>Component</code></td><td>—</td><td>显示在输入框前端的装饰图标。与 icon 插槽同时使用时，插槽优先。</td></tr><tr><td><code>status</code></td><td><code>TextInputStatus</code></td><td>—</td><td>设置 error、warning 或 success 校验状态，可附带 message 和 messageId。错误状态会设置 aria-invalid。</td></tr><tr><td><code>statusVariant</code></td><td><code>&#39;attached&#39; | &#39;detached&#39; | &#39;tooltip&#39;</code></td><td>attached</td><td>状态消息的展示方式：紧贴控件、分离显示，或收进图标提示。三种方式均与输入框保持关联。</td></tr><tr><td><code>changeAction</code></td><td><code>(value: string, event: TextInputChangeEvent) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>在值变化后执行的动作。返回 Promise 时，组件会显示加载状态。</td></tr><tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>手动控制加载状态。存在未完成的异步操作时也会显示加载，期间输入框仍可编辑。</td></tr><tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>输入为空时显示的提示文字，不能替代 label。</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>auto</td><td>整个字段的宽度。数字按像素处理，CSS 字符串按原样使用。</td></tr><tr><td><code>hasClear</code></td><td><code>boolean</code></td><td>false</td><td>在有内容且可编辑时显示清除按钮，点击清除后焦点会回到输入框。</td></tr><tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>组件挂载后自动聚焦原生 input。</td></tr><tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>原生 input 的 name 属性，优先于通过原生属性传入的 name。字段禁用时会被移除。</td></tr><tr><td><code>autoComplete</code></td><td><code>string</code></td><td>—</td><td>原样透传给原生 input 的 autocomplete 属性。</td></tr><tr><td><code>clearLabel</code></td><td><code>string</code></td><td>Clear {label}</td><td>清除按钮的无障碍名称，用于本地化。</td></tr><tr><td><code>loadingLabel</code></td><td><code>string</code></td><td>Loading</td><td>加载指示器的无障碍名称，用于本地化。</td></tr></tbody></table></div><h2 id="状态类型" tabindex="-1">状态类型 <a class="header-anchor" href="#状态类型" aria-label="Permalink to “状态类型”">​</a></h2><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">interface</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> TextInputStatus</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  type</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &#39;error&#39;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &#39;warning&#39;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &#39;success&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  message</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">?:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> string</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  messageId</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">?:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> string</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><h2 id="textinput-插槽" tabindex="-1">TextInput 插槽 <a class="header-anchor" href="#textinput-插槽" aria-label="Permalink to “TextInput 插槽”">​</a></h2><div class="component-api-table" role="region" aria-label="TextInput 插槽" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>icon</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>前端装饰图标，覆盖 startIcon。避免放入可交互控件。</td></tr><tr><td><code>end</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>尾部内容，可以放按钮。使用方负责其无障碍名称。</td></tr><tr><td><code>labelIcon</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>标签前的装饰图标，覆盖 labelIcon 属性。</td></tr></tbody></table></div><h2 id="textinput-事件" tabindex="-1">TextInput 事件 <a class="header-anchor" href="#textinput-事件" aria-label="Permalink to “TextInput 事件”">​</a></h2><div class="component-api-table" role="region" aria-label="TextInput 事件" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>update:modelValue</code></td><td><code>value: string</code></td><td>—</td><td>v-model 更新。先于 change 与 changeAction。</td></tr><tr><td><code>change</code></td><td><code>value: string, event: TextInputChangeEvent</code></td><td>—</td><td>每次有效修改与清除后触发。event.preventDefault() 只阻止 changeAction，不撤回 v-model 更新。</td></tr><tr><td><code>enter</code></td><td><code>event: KeyboardEvent</code></td><td>—</td><td>非输入法提交的 Enter。keydown 被取消时不触发。</td></tr><tr><td><code>keydown</code></td><td><code>event: KeyboardEvent</code></td><td>—</td><td>原生按键事件。调用 preventDefault() 可阻止 enter。</td></tr><tr><td><code>clear</code></td><td><code>event: MouseEvent</code></td><td>—</td><td>清除按钮被激活后触发。仍会发出 update:modelValue 和 change，并运行未取消的 action。</td></tr><tr><td><code>actionError</code></td><td><code>error: unknown, value: string, event: TextInputChangeEvent</code></td><td>—</td><td>同步异常或 Promise 拒绝后触发。组件自动清除该操作的加载状态。</td></tr></tbody></table></div><h2 id="textinputchangeevent" tabindex="-1">TextInputChangeEvent <a class="header-anchor" href="#textinputchangeevent" aria-label="Permalink to “TextInputChangeEvent”">​</a></h2><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">type</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> TextInputChangeEvent</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> =</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> CustomEvent</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">&lt;{</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  value</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> string</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  originalEvent</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> Event</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}&gt;</span></span></code></pre></div><ul><li>原生 <code>input</code> 事件通常无法取消。</li><li><code>change</code> 提供可以取消的组件事件。</li><li><code>event.detail.value</code> 保存修改后的值。</li><li><code>event.detail.originalEvent</code> 保存原始事件。</li><li><code>changeAction</code> 和 <code>actionError</code> 接收同一个组件事件。</li></ul><p>原始事件的类型取决于操作：</p><table tabindex="0"><thead><tr><th>操作</th><th>类型</th></tr></thead><tbody><tr><td>输入文字</td><td><code>InputEvent</code></td></tr><tr><td>提交输入法候选词</td><td><code>CompositionEvent</code></td></tr><tr><td>点击清除按钮</td><td><code>MouseEvent</code></td></tr></tbody></table><h2 id="异步操作" tabindex="-1">异步操作 <a class="header-anchor" href="#异步操作" aria-label="Permalink to “异步操作”">​</a></h2><p><code>changeAction</code> 接收修改后的值和组件事件。返回 Promise 时，组件会显示加载状态。</p><ul><li><strong>输入</strong>：保存期间仍可编辑。清除内容也会运行 <code>changeAction</code>。</li><li><strong>加载状态</strong>：存在未完成的操作时，<code>aria-busy</code> 为 <code>true</code>。所有操作结束后清除加载状态，失败的操作也会计入。</li><li><strong>值更新</strong>：父组件传入的新值优先于组件临时显示的值。</li><li><strong>并发保存</strong>：由应用取消旧请求或检查请求序号，避免过期结果覆盖新值。</li><li><strong>失败处理</strong>：通过 <code>@action-error</code> 展示错误。需要回滚时，由应用更新 <code>v-model</code> 绑定值。</li></ul><h2 id="模板引用" tabindex="-1">模板引用 <a class="header-anchor" href="#模板引用" aria-label="Permalink to “模板引用”">​</a></h2><p>模板引用公开以下属性和方法：</p><ul><li><code>element: HTMLInputElement | null</code>：原生输入元素。挂载前为 <code>null</code>。</li><li><code>focus(options?: FocusOptions)</code>：聚焦输入框。</li><li><code>blur()</code>：移除输入框焦点。</li><li><code>select()</code>：选中全部输入内容。</li></ul><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><ul><li><code>maxlength</code>、<code>minlength</code>、<code>pattern</code>、<code>required</code>、<code>form</code>、<code>aria-*</code>、<code>data-*</code> 和原生事件监听器传入原生 <code>input</code>。</li><li><code>class</code> 和 <code>style</code> 作用于输入框外层。<code>width</code> 作用于整个 <code>Field</code>。</li><li><code>value</code>、<code>type</code>、<code>disabled</code>、<code>readonly</code>、<code>autofocus</code> 与核心 ARIA 状态由组件管理，请使用对应的组件属性。</li><li><code>aria-describedby</code> 和 <code>aria-labelledby</code> 会与组件内部的关联 ID 合并。</li></ul><h3 id="禁用与只读" tabindex="-1">禁用与只读 <a class="header-anchor" href="#禁用与只读" aria-label="Permalink to “禁用与只读”">​</a></h3><ul><li><strong>禁用且无原因说明</strong>：使用原生 <code>disabled</code>，无法编辑、聚焦或提交该字段。</li><li><strong>禁用且有 <code>disabledMessage</code></strong>：使用 <code>aria-disabled</code> 和 <code>readonly</code> 保留焦点，以便查看原因。同时移除 <code>name</code>，阻止修改和清除。</li><li><strong>只读</strong>：保留焦点，允许复制，值仍包含在 <code>FormData</code> 中。</li><li>同时设置禁用和只读时，禁用优先。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><p>为组件添加类名，即可覆盖主题变量：</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">&lt;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#11782a",
		"--shiki-dark": "#85E89D"
	})}">TextInput</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> v-model</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">=</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">email</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> class</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">=</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;my-input&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> label</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">=</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;邮箱&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> /&gt;</span></span></code></pre></div><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-input</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-input-focus</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#10b981</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-radius-element</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">8</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">px</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><h3 id="外观与尺寸" tabindex="-1">外观与尺寸 <a class="header-anchor" href="#外观与尺寸" aria-label="Permalink to “外观与尺寸”">​</a></h3><ul><li><code>--astryx-input-background</code>：输入框背景色。</li><li><code>--astryx-input-border</code>：默认边框色。</li><li><code>--astryx-input-focus</code>：无校验状态时的焦点边框色。</li><li><code>--astryx-radius-element</code>：输入框圆角。</li><li><code>--astryx-input-height-sm</code>：小尺寸高度，Neutral 默认 <code>28px</code>。</li><li><code>--astryx-input-height-md</code>：中尺寸高度，Neutral 默认 <code>32px</code>。</li><li><code>--astryx-input-height-lg</code>：大尺寸高度，Neutral 默认 <code>36px</code>。</li></ul><h3 id="校验状态" tabindex="-1">校验状态 <a class="header-anchor" href="#校验状态" aria-label="Permalink to “校验状态”">​</a></h3><p>每种状态提供三个变量，分别控制边框与图标、消息文字、消息背景：</p><ul><li><strong>错误</strong>：<code>--astryx-input-error</code>、<code>--astryx-input-error-foreground</code>、<code>--astryx-input-error-background</code>。</li><li><strong>警告</strong>：<code>--astryx-input-warning</code>、<code>--astryx-input-warning-foreground</code>、<code>--astryx-input-warning-background</code>。</li><li><strong>成功</strong>：<code>--astryx-input-success</code>、<code>--astryx-input-success-foreground</code>、<code>--astryx-input-success-background</code>。</li></ul><p>在包含整个字段的父元素上覆盖状态变量，可同时调整输入框和状态消息。</p><h3 id="明暗模式" tabindex="-1">明暗模式 <a class="header-anchor" href="#明暗模式" aria-label="Permalink to “明暗模式”">​</a></h3><ul><li>Neutral 根据 CSS <code>color-scheme</code> 自动选择配色。</li><li>在根元素或主题容器上设置 <code>data-astryx-color-mode=&quot;light&quot;</code>，可固定使用浅色模式。</li><li>设置 <code>data-astryx-color-mode=&quot;dark&quot;</code>，可固定使用暗色模式。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/text-input/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
