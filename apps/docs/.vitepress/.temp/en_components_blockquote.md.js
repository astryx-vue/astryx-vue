import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { t as blockquoteCite } from "./blockquote.Bw6PLvv8.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/blockquote/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"Blockquote\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Blockquote\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/blockquote.md\",\"filePath\":\"en/components/blockquote/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "en/components/blockquote.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to “Usage”">​</a></h2><p>Import the component from its dedicated entry. The component loads its structural styles.</p><p>Import the theme in your application entry:</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/themes/neutral.css&#39;</span></span></code></pre></div><p>Component usage:</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { Blockquote } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Blockquote&#39;</span></span>
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
			})}">Blockquote</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> cite</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;Steve Jobs&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    Design is not just what it looks like and feels like. Design is how it works.</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Blockquote</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to “Best practices”">​</a></h2><table tabindex="0"><thead><tr><th>Guidance</th><th>Practices</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use for quoted text, testimonials, or highlighted excerpts from external sources.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Provide a cite prop when the source of the quote is known.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use for callout boxes or informational notes; use Banner for those.</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-label="Permalink to “Examples”">​</a></h2><p>Common quote and attribution configurations.</p>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(blockquoteCite),
				description: "A quote can stand alone. When its source is known, use cite to credit the author or publication.",
				locale: "en",
				title: "With attribution"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region docs/en/components/blockquote/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/blockquote/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var blockquote_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, blockquote_default as default };
