import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { i as hoverCardPlacements, n as hoverCardControlled, t as hoverCardBasic } from "./hover-card.BAemcCQr.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/hover-card/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"悬浮卡片\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"悬浮卡片\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/hover-card.md\",\"filePath\":\"zh/components/hover-card/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "components/hover-card.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to “使用方法”">​</a></h2><p><code>HoverCard</code> 在鼠标悬停或键盘聚焦触发元素时，弹出一张承载更丰富内容的卡片。它和 <code>Tooltip</code> 的区别在于内容：<code>Tooltip</code> 只放一行纯文本，而悬浮卡片可以放头像、姓名、简介和操作按钮，因此要显示用户的资料、链接的预览或术语的解释时，它是合适的选择。</p><p>卡片有一个默认 300 毫秒的显示延迟，避免指针扫过触发元素时就闪出卡片。隐藏也有一个默认 200 毫秒的延迟，并且指针移入卡片会取消这次隐藏，所以用户可以从触发元素把指针移进卡片里继续阅读或点击，卡片不会在途中消失。</p><p>触发元素写在默认插槽里，卡片内容写在 <code>content</code> 插槽里：</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { HoverCard } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/HoverCard&#39;</span></span>
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
			})}">HoverCard</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> label</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;Dana Whitfield&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    Dana Whitfield</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">template</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> #</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">content</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">      &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">p</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;Design systems engineer, Amsterdam.&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">p</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">template</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">HoverCard</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p>触发元素是纯文字时，组件会给它加上虚线底划线并让它可聚焦，键盘用户按 Tab 就能打开卡片；触发元素本身是一个按钮或链接时，组件直接监听那个元素，并把 <code>aria-haspopup</code>、<code>aria-controls</code> 这类属性写在它身上。传入 <code>label</code> 后卡片会以具名的 <code>role=&quot;dialog&quot;</code> 暴露给屏幕阅读器，不传 <code>label</code> 时则是 <code>role=&quot;group&quot;</code>，并通过 <code>aria-describedby</code> 指向卡片内容。</p><h2 id="最佳实践" tabindex="-1">最佳实践 <a class="header-anchor" href="#最佳实践" aria-label="Permalink to “最佳实践”">​</a></h2><table tabindex="0"><thead><tr><th>指引</th><th>实践</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>把悬浮卡片当作补充信息：有它更好理解，没它也能完成任务。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>用纯文字作为触发元素，让虚线下划线和键盘聚焦默认生效，用户能看出这里可以悬停。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>内容是资料那就传 <code>label</code>，卡片会以具名对话框的形式出现在辅助技术的浏览顺序里。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>让 <code>touchTrigger</code> 保持默认的 <code>auto</code>：本身不执行操作的触发元素轻点即打开，按钮和链接的轻点仍然归它们自己。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>把关键操作或必须看到的信息只放在卡片里。指针一移开卡片就消失，用户很容易错过。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>用悬浮卡片替代简单的提示或弹层。一行说明用 <code>Tooltip</code>，需要用户点击确认的内容用 <code>Popover</code>。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>在卡片里放需要长时间输入的表单。指针离开会让它关闭，这类内容应放进对话框。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>在 <code>&lt;p&gt;</code>、标题或链接内部直接使用。这些位置虽然可用，但浮层与文档流的关系会变得难以预测，优先放在块级上下文里。</td></tr></tbody></table><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to “示例”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(hoverCardBasic),
				title: "基本用法",
				description: "悬停或聚焦链接，卡片在短暂延迟后显示，指针移入卡片后仍保持打开。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(hoverCardPlacements),
				title: "位置",
				description: "placement 设置卡片相对触发元素的方向，空间不足时自动翻转到另一侧。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(hoverCardControlled),
				title: "受控",
				description: "传入 isOpen 控制显示。悬停和聚焦不再生效，按 Escape 只会发出 openChange(false)。",
				locale: "zh"
			}, null, _parent));
			_push(`<h2 id="无障碍" tabindex="-1">无障碍 <a class="header-anchor" href="#无障碍" aria-label="Permalink to “无障碍”">​</a></h2><p>悬浮卡片是一层独立的浮层，组件把两者用 ARIA 属性关联起来，屏幕阅读器既能知道触发元素多了一段说明，也能在卡片打开时读到里面的结构和操作：</p><ul><li>卡片带有 <code>role=&quot;group&quot;</code>；传入 <code>label</code> 后改为具名的 <code>role=&quot;dialog&quot;</code>，因为无名对话框不符合规范，而无名的 <code>group</code> 是合法的。</li><li>未传 <code>label</code> 时，触发元素带有 <code>aria-describedby</code> 指向卡片。</li><li>传了 <code>label</code> 时，触发元素改为带有 <code>aria-haspopup=&quot;dialog&quot;</code>，卡片打开期间再带上 <code>aria-controls</code>。<code>aria-expanded</code> 只在触发器本身允许该属性时才会写入；纯文字触发的 <code>&lt;span&gt;</code> 没有对应角色，因此不会带上它。</li><li>触发元素原有的 <code>aria-haspopup</code>、<code>aria-controls</code>、<code>aria-expanded</code>、<code>aria-describedby</code> 会被保留，组件卸载时恢复原值。</li></ul><p>键盘也能完整操作：聚焦触发元素会立即打开卡片，焦点在触发元素和卡片之间移动时卡片保持打开。卡片显示期间按 Escape 会关闭它；如果焦点当时在卡片内部，焦点会回到触发元素，且不会因为这次回焦而重新打开。受控模式下 Escape 只发出 <code>openChange(false)</code>，是否关闭由父组件决定。</p><p>触摸设备上没有悬停，所以轻点触发元素的行为由 <code>touchTrigger</code> 决定：默认的 <code>auto</code> 让本身不执行操作的触发元素轻点即打开，按钮、链接和表单控件则保留自己的轻点；打开后的卡片在卡片外轻点即关闭。因为内容只出现一小会儿，不要把用户完成任务必须看到的信息只放在卡片里。</p></div>`);
		};
	}
});
//#endregion
//#region docs/zh/components/hover-card/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/hover-card/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var hover_card_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, hover_card_default as default };
