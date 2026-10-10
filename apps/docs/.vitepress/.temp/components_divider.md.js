import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { a as dividerVertical, i as dividerVariants, n as dividerLabel, t as dividerBasic } from "./divider.EoVx6WmH.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/divider/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"分隔线\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"分隔线\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/divider.md\",\"filePath\":\"zh/components/divider/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "components/divider.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to “使用方法”">​</a></h2><p><code>Divider</code> 用一条细线把相关内容分成若干区块，适合在表单、列表或设置项之间做视觉上的划分。需要为分区标注名称时，也可以把简短文字放在线条中间：</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { Divider } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Divider&#39;</span></span>
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
			})}">Divider</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> label</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;或&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> /&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">template</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span></code></pre></div><h2 id="最佳实践" tabindex="-1">最佳实践 <a class="header-anchor" href="#最佳实践" aria-label="Permalink to “最佳实践”">​</a></h2><table tabindex="0"><thead><tr><th>指引</th><th>实践</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>相关内容区块之间使用 <code>subtle</code> 分隔线；需要更醒目的边界时，改用 <code>strong</code>。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>分区需要一个可见的类别标题时，为分隔线添加 <code>label</code>，文字会居中显示在线条上。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>避免密集使用分隔线：能用留白和排版区分内容时，优先使用间距而不是线条。</td></tr></tbody></table><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to “示例”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(dividerBasic),
				title: "基本用法",
				description: "水平分隔线是默认形态，会占满所在容器的可用宽度。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(dividerLabel),
				title: "文字标签",
				description: "传入 label 后文字会居中显示在线条中间，样式与辅助文字一致，适合“或”“以下为评论”这类简短标注。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(dividerVariants),
				title: "变体",
				description: "线条提供 subtle 和 strong 两种强度：subtle 是默认值，视觉较轻；strong 使用强调边框色，适合需要明显边界的场合。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(dividerVertical),
				title: "垂直",
				description: "把 orientation 设为 vertical 可得到垂直分隔线，适合放在按钮、图标等固定高度的行内元素之间。",
				locale: "zh"
			}, null, _parent));
			_push(`<h2 id="无障碍" tabindex="-1">无障碍 <a class="header-anchor" href="#无障碍" aria-label="Permalink to “无障碍”">​</a></h2><p>分隔线本身没有交互行为，但辅助技术仍需要知道它是一条分隔线、朝向如何，才能在浏览时正确描述这个元素。组件会自动在根元素上补齐这部分语义：</p><ul><li>根元素带有 <code>role=&quot;separator&quot;</code>，并用 <code>aria-orientation</code> 反映当前的 <code>orientation</code>。</li><li>提供 <code>label</code> 时，标签文字会通过 <code>aria-labelledby</code> 成为分隔线的无障碍名称。</li></ul><p>如果希望用别的文字为分隔线命名，可以设置 <code>aria-label</code>。一旦设置了 <code>aria-label</code>，组件就用它作为无障碍名称，不再自动关联 <code>label</code>。</p></div>`);
		};
	}
});
//#endregion
//#region docs/zh/components/divider/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/divider/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var divider_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, divider_default as default };
