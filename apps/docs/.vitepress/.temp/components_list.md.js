import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { i as listMarkers, n as listDensities, r as listInteractive, t as listBasic } from "./list.B0l083G0.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/list/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"列表\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"列表\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/list.md\",\"filePath\":\"zh/components/list/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "components/list.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to “使用方法”">​</a></h2><p><code>List</code> 用来呈现一组彼此相关的条目，<code>ListItem</code> 是其中的一行。它渲染出语义正确的 <code>&lt;ul&gt;</code> 或 <code>&lt;ol&gt;</code>，并统一安排一行内部「起始内容 + 标签 + 描述 + 结束内容」四块位置，所以设置项、通知、步骤说明这类界面不必每次都重新写一遍行布局。</p><p>一行最少只需要一个 <code>label</code>：</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { List, ListItem } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/List&#39;</span></span>
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
			})}">List</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> header</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;Inbox&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">ListItem</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> label</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;Mentions&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> description</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;Comments that name you&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> /&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">ListItem</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> label</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;Build finished&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> description</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;main passed every check&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> /&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">List</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p><code>description</code> 是标签下方的次要文字。使用 <code>startContent</code> 和 <code>endContent</code> 两个插槽可以把图标、头像、徽章或操作按钮放在行的两端；<code>label</code> 和 <code>description</code> 也各有一个同名插槽，当文字需要用富文本表达时改用它即可。</p><p>列表的密度由 <code>List</code> 的 <code>density</code> 统一决定，单行可以用 <code>ListItem</code> 的 <code>density</code> 覆盖它。<code>compact</code> 对应 4 像素的上下内边距，<code>balanced</code> 是默认的 8 像素，<code>spacious</code> 是 12 像素并把左右内边距也放宽一档。<code>hasDividers</code> 会在相邻两行之间画一条分隔线，最后一行不会画。</p><p><code>listStyle</code> 决定每行前面画什么标记：<code>disc</code> 是实心圆点，<code>circle</code> 是空心圆点，<code>decimal</code> 会改用 <code>&lt;ol&gt;</code> 渲染并给出序号，<code>start</code> 用来指定序号从几开始。不需要标记时保持默认的 <code>none</code>。</p><p>一行可以通过两种方式变成可交互。给出 <code>onClick</code> 之后，行内部会出现一个占满内容区的按钮，键盘用户可以用 Tab 聚焦它、用回车或空格触发；给出 <code>href</code> 时同一位置会变成链接，<code>target=&quot;_blank&quot;</code> 会自动补上 <code>noopener</code> 和 <code>noreferrer</code>。点击行内的其他控件（例如 <code>endContent</code> 里的按钮）不会触发这一行自己的动作。</p><p><code>isSelected</code> 把行标记为选中。如果这一行带有允许 <code>aria-selected</code> 的角色，例如 <code>option</code>、<code>tab</code> 或 <code>row</code>，状态会写进 <code>aria-selected</code>；否则会退回到在任何元素上都合法的 <code>aria-current=&quot;true&quot;</code>，屏幕阅读器仍然能读到当前项。<code>isDisabled</code> 会让行变成惰性的，并把它的内容调淡。</p><p><code>header</code> 插槽会在列表上方渲染一段标题，并用 <code>aria-labelledby</code> 与列表关联起来，于是屏幕阅读器在进入列表时会先读出这个标题。<code>edgeCompensation=&quot;inline&quot;</code> 用于把列表放在带内边距的容器里时让每一行的文字与同级的标题对齐：它会按每个逻辑边缘各自可用的容器内边距，抵消掉行自身的左右内边距，最多抵消到零。</p><p>包里同时导出了更通用的原语 <code>Item</code>。<code>ListItem</code> 就是它在 <code>&lt;li&gt;</code> 上的一层封装，加上来自 <code>List</code> 的密度和标记；需要在非列表结构里复用同一套行布局时，可以直接使用 <code>Item</code>，它能通过 <code>as</code> 决定根元素，并提供 <code>align</code>、<code>labelLines</code>、<code>descriptionLines</code>、<code>layout</code> 等额外控制。大多数界面只需要 <code>List</code> 和 <code>ListItem</code>。</p><h2 id="最佳实践" tabindex="-1">最佳实践 <a class="header-anchor" href="#最佳实践" aria-label="Permalink to “最佳实践”">​</a></h2><table tabindex="0"><thead><tr><th>指引</th><th>实践</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>用 <code>header</code> 给列表一个标题。屏幕阅读器进入列表时会先读出它，用户也能立刻知道这组内容是什么。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>用 <code>startContent</code> 和 <code>endContent</code> 放置图标、头像、徽章或时间戳，让行的两端承担分类和信息提示的作用。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>需要区分当前项时使用 <code>isSelected</code>，让组件根据角色选择 <code>aria-selected</code> 或 <code>aria-current</code>，而不是自己写 ARIA 属性。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>内容长度不定时给出 <code>descriptionLines</code>，或者让组件按默认的单行截断来裁剪字符串描述，避免行高随文字跳动。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>在可点击的行里再放一个可点击的控件作为主要操作。行的按钮已经占据整块内容区，两个点击目标会让焦点顺序和行为都变得难以预测。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>为单个条目使用列表。列表意味着这些内容属于同一组，条目太少时用普通的段落更自然。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>在同一个列表里混用可点击和不可点击的行而不作区分，用户会不知道哪些行可以打开。</td></tr></tbody></table><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to “示例”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(listBasic),
				description: "带标题的列表：左侧图标用于分类，右侧徽章或箭头用于提示数量与可进入。",
				locale: "zh",
				title: "基础用法"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(listDensities),
				description: "三档密度改变每一行的上下内边距，同一列表中的单行也可以覆盖列表给定的密度。",
				locale: "zh",
				title: "密度"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(listMarkers),
				description: "disc 与 circle 在每行前面画出项目符号，decimal 则改用有序列表渲染，并且可以从任意数值开始编号。",
				locale: "zh",
				title: "标记"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(listInteractive),
				description: "带有点击处理的行会变成按钮，并带有悬停和按下状态；选中行有明确的标记，被禁用的行不响应任何操作。",
				locale: "zh",
				title: "选择与交互"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region docs/zh/components/list/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/list/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var list_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, list_default as default };
