import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { i as bottomSheetTall, r as bottomSheetSnap, t as bottomSheetBasic } from "./bottom-sheet.ODiRk8HJ.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/bottom-sheet/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"底部弹窗\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"底部弹窗\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/bottom-sheet.md\",\"filePath\":\"zh/components/bottom-sheet/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "components/bottom-sheet.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to “使用方法”">​</a></h2><p><code>BottomSheet</code> 从视口底部升起一块面板，用来承载筛选、分享、快速操作和表单这类移动端优先的内容。面板顶部有一条装饰性的拖拽条，下面是可以滚动的内容区；背景由遮罩压暗并阻挡交互。它基于原生 <code>&lt;dialog&gt;</code> 元素，因此在打开时会把焦点锁在面板内部、把页面其余部分设为不可交互，关闭后把焦点还给打开它的元素。</p><p>最基本的用法是自己管理开关状态，把标签和内容交给组件：</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}">script</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> setup</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> lang</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;ts&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> { BottomSheet } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/BottomSheet&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> { ref } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">const</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> isOpen</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}"> =</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> ref</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">(</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">false</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">)</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">script</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">template</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">button</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> type</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;button&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> @click</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;isOpen = true&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    筛选</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">button</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">BottomSheet</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> v-model</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">:</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">is-open</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">isOpen</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> label</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;筛选&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">p</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;这里放筛选条件。&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">p</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">BottomSheet</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">template</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span></code></pre></div><p><code>label</code> 是必填项，它会成为面板的无障碍名称，屏幕阅读器在进入面板时会读出它。面板本身没有内置标题，所以这个名称需要由你提供。是否打开由 <code>isOpen</code> 决定：不绑定 <code>v-model:is-open</code> 时组件自己管理状态，Escape、点击遮罩或向下拖动都会关闭它；绑定时组件完全跟随绑定的值，这些操作只会发出 <code>openChange(false)</code> 请求，是否关闭由父组件决定。</p><p><code>height</code> 决定面板展开后的高度，可以使用三个命名档位。<code>hug</code> 让面板贴合内容，最多占到视口的 92%，适合内容固定且不长的场景；<code>capped</code> 是默认档，约占视口高度的 62%，是列表类内容的常用选择；<code>tall</code> 固定在接近满屏的高度，适合表单或内容会持续变长的场景。也可以直接传数字（像素）或任意 CSS 长度，例如 <code>420</code> 或 <code>&quot;min(70vh, 30rem)&quot;</code>。无论哪个档位，内容超过可见高度时都在面板内部滚动，不会把页面撑长。</p><p><code>snapPoints</code> 让用户可以拖动面板停在中间高度，而不仅仅是全开或关闭。每个点位写的是面板的可见高度：数字是视口比例（<code>0.5</code> 就是半个屏幕），<code>&quot;50%&quot;</code> 是同样的意思，<code>&quot;320px&quot;</code> 是绝对高度。面板自身的高度始终是最高的那一档，所以 <code>snap-points=&quot;[0.5]&quot;</code> 表示「要么半屏，要么全屏」。短到只有自身四分之一以下的档位被视为「露一角」：它不重排内容，而是把整块面板滑走一部分，同时把遮罩调淡。不传 <code>snapPoints</code> 时面板只支持打开和关闭，拖动仍然可以关闭它。</p><p>向下拖动可以关闭面板，向上快速一甩会把面板展开到最高档。拖动时遮罩的深浅跟随面板的位置变化，松手后停到最近的档位。拖动条和（滚动到顶部后的）内容区都可以发起拖动。系统开启「减少动态效果」时，进入和退出的动画会缩短到几乎不可见，但面板的位置和状态变化照常发生。</p><p><code>purpose</code> 控制隐式关闭的尺度，和 <code>Dialog</code> 一致。默认的 <code>info</code> 允许 Escape、点击遮罩和向下拖动；<code>form</code> 只允许 Escape，避免用户误触遮罩丢失已经输入的内容；<code>required</code> 屏蔽全部隐式关闭，并使用 <code>alertdialog</code> 语义，用于必须由用户明确响应的流程。想要面板和页面同时可交互时，把 <code>hasScrim</code> 设为 <code>false</code>：面板会用非模态方式打开，背景不再被压暗，页面可以继续滚动和点击，拖动关闭依旧可用。非模态面板不会把焦点从页面上抢走，因此 Escape 只在焦点位于面板内部时才会关闭它。</p><p><code>padding</code> 设置内容区的内边距，取值来自全局间距刻度。不设置时使用主题为底部弹窗定义的内边距，主题没有定义时取 <code>--spacing-4</code>（16px），四个逻辑边相同；传入 <code>0</code> 可以让内容紧贴面板边缘。内容区同时是一个容器，如果它的唯一子元素是自带内边距的区块，那个区块会顶掉这层内边距，不会被叠加两次。</p><h2 id="最佳实践" tabindex="-1">最佳实践 <a class="header-anchor" href="#最佳实践" aria-label="Permalink to “最佳实践”">​</a></h2><table tabindex="0"><thead><tr><th>指引</th><th>实践</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>用在小屏上的临时任务：筛选、分享、快速操作、详情预览。让内容从底部升起，符合拇指的触达范围。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>按内容选择高度档位：内容固定且短用 <code>hug</code>，列表用 <code>capped</code>，表单或持续变长的内容用 <code>tall</code>。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>用 <code>purpose=&quot;form&quot;</code> 保护已经输入的内容，同时保留 Escape；只有必须由用户明确结束的流程才用 <code>required</code>。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>给 <code>label</code> 写清楚面板是什么，例如「筛选条件」「分享到」，它是屏幕阅读器进入面板时唯一的上下文。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>让面板内容过长。内容很多时考虑拆成多个步骤，或改用整页。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>在桌面端把它当默认的弹窗使用。需要居中的模态对话框时使用 <code>Dialog</code>。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>依赖拖动作为唯一的关闭方式。Escape、遮罩点击和显式的操作按钮同样重要。</td></tr></tbody></table><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to “示例”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(bottomSheetBasic),
				description: "从底部升起的筛选面板：拖动条、标题和操作按钮，遮罩点击或 Escape 均可关闭。",
				locale: "zh",
				title: "基本用法"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(bottomSheetTall),
				description: "tall 档位固定接近满屏高度，列表在面板内部滚动，页面本身不会被撑长。",
				locale: "zh",
				title: "列表"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(bottomSheetSnap),
				description: "snapPoints 让用户把面板拖到半个屏幕的高度，松手后停在最近的档位。",
				locale: "zh",
				title: "拖动到中间高度"
			}, null, _parent));
			_push(`<h2 id="无障碍" tabindex="-1">无障碍 <a class="header-anchor" href="#无障碍" aria-label="Permalink to “无障碍”">​</a></h2><p>面板基于原生 <code>&lt;dialog&gt;</code> 元素构建。带遮罩时使用 <code>showModal()</code> 打开，浏览器会把它放到顶层、把背景设为不可交互，并把 Tab 焦点限制在面板内；不带遮罩时使用 <code>show()</code> 打开，页面保持可用。<code>label</code> 通过 <code>aria-label</code> 成为面板的名称，<code>purpose=&quot;required&quot;</code> 时角色变为 <code>alertdialog</code>。</p><p>打开时，焦点会落到面板内第一个带 <code>data-autofocus</code> 的元素上；没有这样的元素时，焦点落在面板本身。关闭后，焦点回到打开面板时的那个元素（如果它还在页面里），或者回到 <code>finalFocusRef</code> 指定的元素。抬起与关闭的动画结束后才执行焦点归还，避免焦点落在正在滑走的面板上。</p><p>Escape 只在 <code>purpose</code> 不是 <code>required</code> 时关闭面板（带遮罩的模态面板会把焦点限制在内部；无遮罩的面板不抢焦点，因此焦点需要位于面板内）；输入法正在组合文字时按下的 Escape 属于取消输入，不会关闭面板。内容区滚动到顶部后可以向下拖动关闭面板，滚动到内容底部时可以向上拖动展开面板；<code>purpose</code> 不是 <code>info</code> 时拖动只会停靠在最近的档位，不会关闭。</p><p>当内容区实际溢出时，它会成为一个可聚焦的滚动区域，带 <code>role=&quot;group&quot;</code> 和面板的 <code>label</code> 作为名称，键盘用户可以聚焦它并用方向键滚动内容。</p><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">.my-sheet</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c13617",
				"--shiki-dark": "#FFAB70"
			})}">  --astryx-bottom-sheet-background</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">#ffffff</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c13617",
				"--shiki-dark": "#FFAB70"
			})}">  --astryx-bottom-sheet-foreground</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">#171717</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c13617",
				"--shiki-dark": "#FFAB70"
			})}">  --astryx-bottom-sheet-border</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">#d4d4d4</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c13617",
				"--shiki-dark": "#FFAB70"
			})}">  --astryx-bottom-sheet-handle-background</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">#d4d4d4</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c13617",
				"--shiki-dark": "#FFAB70"
			})}">  --astryx-bottom-sheet-scrim</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">#00000080</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c13617",
				"--shiki-dark": "#FFAB70"
			})}">  --astryx-bottom-sheet-shadow</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">0</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> -12</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">px</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> 24</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">px</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> rgb</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">(</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">0</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> 0</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> 0</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> / </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">15</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">%</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">);</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">}</span></span></code></pre></div><p>Neutral 主题自动适配明暗模式。<code>class</code> 与 <code>style</code> 会落在面板这个 <code>&lt;div&gt;</code> 上，而不是包裹它的 <code>&lt;dialog&gt;</code>，因此上面的变量写在面板上生效。</p></div>`);
		};
	}
});
//#endregion
//#region docs/zh/components/bottom-sheet/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/bottom-sheet/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var bottom_sheet_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, bottom_sheet_default as default };
