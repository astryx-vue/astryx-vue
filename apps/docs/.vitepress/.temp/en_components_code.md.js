import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { i as codeLineNumbers, n as codeCollapsible, r as codeInline, t as codeBasic } from "./code.Cp_9Oito.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/code/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"Code\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Code\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/code.md\",\"filePath\":\"en/components/code/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "en/components/code.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to “Usage”">​</a></h2><p><code>Code</code> marks a short technical reference inside a sentence, such as a function name, a prop, a file path, or a command-line flag. It renders a semantic <code>&lt;code&gt;</code> element in a monospace font on a muted background, and it wraps long identifiers instead of pushing the surrounding paragraph wider.</p><p><code>CodeBlock</code> presents a read-only snippet of one or more lines. It adds the parts a snippet needs to stand on its own: a header with a title and the language, a copy button, optional line numbers, optional highlighted lines, optional syntax highlighting, a bounded scroll area, and an optional collapse control. Both components are exported from <code>@astryx-vue/core/Code</code>.</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { Code, CodeBlock } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Code&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">const</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> snippet</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}"> =</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;const total = items.length&#39;</span></span>
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
			})}">p</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;Count the items with &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Code</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;items.length&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Code</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;.&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">p</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">CodeBlock</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> :</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">code</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">snippet</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> language</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;typescript&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> title</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;count.ts&quot;</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p>The <code>language</code> prop selects the tokenizer. The built-in set covers <code>typescript</code>, <code>javascript</code>, <code>tsx</code>, <code>jsx</code>, <code>ts</code>, <code>js</code>, <code>json</code>, <code>html</code>, <code>xml</code>, <code>svg</code>, <code>css</code>, <code>scss</code>, <code>less</code>, <code>python</code>, <code>py</code>, <code>bash</code>, <code>sh</code>, <code>zsh</code>, <code>shell</code>, <code>php</code>, <code>hack</code>, <code>yaml</code>, <code>yml</code>, <code>markdown</code>, and <code>md</code>. Anything else, including <code>plaintext</code>, renders the code exactly as written without tokens, and <code>plaintext</code> also hides the language label because it says nothing the reader needs. A language the tokenizer does not know is not an error: you can also pass your own <code>tokenizer</code> function that returns tokens with absolute offsets, and it will be painted while the displayed and copied text stays the source string.</p><p>The header appears when there is a title or a visible language label, and it is where the copy button lives. When neither exists, the copy button floats at the top end of the block instead, so copying stays available without a header. <code>hasLanguageLabel</code> turns the label off while keeping the header a title-only bar.</p><p>Line numbers are off by default. Turn them on with <code>hasLineNumbers</code>; the gutter is sized to the widest line number so the code column starts at a stable offset. <code>highlightLines</code> takes one-indexed line numbers and tints those lines to draw attention to them. Set <code>isWrapped</code> when long lines should wrap rather than scroll sideways, and <code>maxHeight</code> to bound the height before the code scrolls vertically; <code>0</code> is a valid bound and means the body is fully collapsed to its header height. The block is as wide as its longest line by default: <code>width=&quot;fit-content&quot;</code> keeps a short snippet compact with a floor, while <code>width=&quot;100%&quot;</code> fills the parent. <code>container=&quot;section&quot;</code> drops the border, radius, and background so a block sits inside a card or panel without painting a second surface.</p><p>A long block can collapse. Set <code>isCollapsible</code> and the header becomes a disclosure control once the header is visible and the code reaches <code>collapsibleThreshold</code> lines, which is 10 by default. The block starts expanded, reports its state through <code>aria-expanded</code>, and points at the region it controls through <code>aria-controls</code>. While collapsed, that region stays mounted but <code>inert</code>, so the code is out of the tab order and out of the accessibility tree instead of sitting there invisibly. If the control disappears, for example because the title is removed, the block expands again on its own.</p><p>The copy button writes the exact <code>code</code> string, so what a reader pastes always matches the source even when the display is tokenized, numbered, or wrapped. After a successful write the control name changes to <code>Copied</code>, the icon flips from a copy glyph to a check, and a polite live region announces the same word; the hover hint keeps reading <code>Copy code</code>, because the icon flip is the confirmation. A rejected clipboard write keeps the control in its resting state and emits nothing. <code>copyLabel</code>, <code>copiedLabel</code>, and <code>codeLabel</code> carry the English defaults and exist so an application can localize those strings.</p><p>The code viewport is a named <code>role=&quot;group&quot;</code> with a keyboard stop, so a keyboard user can scroll a snippet that overflows. The copy control and the collapse control are separate siblings, each with its own accessible name, so activating one never triggers the other. Syntax colors come from the <code>--astryx-code-syntax-*</code> tokens, and <code>highlightMode</code> chooses how they are painted: <code>auto</code> uses the CSS Custom Highlight API when the browser supports it well and falls back to spans, <code>ranges</code> paints through the API without adding any element to the code text, and <code>spans</code> wraps every token in an element. The text, the semantics, and the copy output are the same in all three.</p><h2 id="best-practices" tabindex="-1">Best practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to “Best practices”">​</a></h2><table tabindex="0"><thead><tr><th>Guidance</th><th>Practices</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use <code>Code</code> for short references inside prose, such as a property name or a flag, and <code>CodeBlock</code> for anything that stands on its own or spans more than one line.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Set <code>language</code> to match the snippet so the tokens are accurate, and add a <code>title</code> when the code is a file. The title tells readers where the snippet came from.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use <code>size=&quot;inherit&quot;</code> on inline code inside larger or smaller text so the code matches the line it sits in.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Reach for <code>maxHeight</code> or <code>isCollapsible</code> on long snippets instead of nesting the block in your own scroll container.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Turn on line numbers for a two-line snippet. They add clutter without helping anyone find a line.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Put a paragraph of prose inside a <code>CodeBlock</code>, or use <code>Code</code> for a whole file. Each component has one job.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Rely on syntax colors alone to carry meaning. Tokens paint the code; they do not explain it.</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-label="Permalink to “Examples”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(codeBasic),
				description: "A code block with a title, a visible language label, and the copy button living in its header bar.",
				locale: "en",
				title: "Overview"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(codeInline),
				description: "Inline code in a sentence, in secondary color, and with size set to inherit inside larger text.",
				locale: "en",
				title: "Inline code"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(codeLineNumbers),
				description: "Line numbers with a gutter sized to the widest number, and two highlighted lines that draw the eye to the interesting part.",
				locale: "en",
				title: "Line numbers and highlights"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(codeCollapsible),
				description: "A long block that collapses from its header, with a maximum height so the expanded body scrolls instead of growing without bound.",
				locale: "en",
				title: "Collapsible and bounded"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region docs/en/components/code/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/code/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var code_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, code_default as default };
