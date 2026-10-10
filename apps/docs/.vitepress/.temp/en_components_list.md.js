import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { i as listMarkers, n as listDensities, r as listInteractive, t as listBasic } from "./list.B0l083G0.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/list/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"List\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"List\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/list.md\",\"filePath\":\"en/components/list/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "en/components/list.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to “Usage”">​</a></h2><p><code>List</code> presents a collection of related entries, and <code>ListItem</code> is one row inside it. The pair renders a semantic <code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code> and lays out every row as start content, label, description, and end content, so a settings screen, an inbox, or a set of steps does not have to rebuild that row layout each time.</p><p>One row needs nothing more than a <code>label</code>:</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p><code>description</code> is the secondary line under the label. The <code>startContent</code> and <code>endContent</code> slots place an icon, an avatar, a badge, or an action at either end of the row, and <code>label</code> and <code>description</code> each have a same-named slot for content that needs richer markup than a string.</p><p>The list sets the density for all of its rows, and a single row can override it. <code>compact</code> uses 4px of block padding, <code>balanced</code> is the 8px default, and <code>spacious</code> uses 12px and widens the inline padding by one step as well. <code>hasDividers</code> rules a line between neighbouring rows, and the last row never draws one.</p><p><code>listStyle</code> decides what appears in front of each row: <code>disc</code> draws a filled bullet, <code>circle</code> draws an outlined one, and <code>decimal</code> switches the list to an <code>&lt;ol&gt;</code> and numbers the rows, with <code>start</code> choosing the first number. The default <code>none</code> draws no marker at all.</p><p>A row becomes interactive in one of two ways. Give it <code>onClick</code> and a button appears inside the row, filling the content area, so keyboard users can tab to it and press Enter or Space; give it <code>href</code> and that same place becomes a link, with <code>noopener</code> and <code>noreferrer</code> added automatically when <code>target=&quot;_blank&quot;</code>. Clicking another control inside the row, such as a button in <code>endContent</code>, does not run the row&#39;s own action.</p><p><code>isSelected</code> marks the row as selected. When the row carries a role that permits <code>aria-selected</code> — <code>option</code>, <code>tab</code>, or <code>row</code>, for instance — the state is written there; otherwise it falls back to <code>aria-current=&quot;true&quot;</code>, which is valid on any element, so assistive technology still hears which row is current. <code>isDisabled</code> makes the row inert and dims its content.</p><p>The <code>header</code> slot renders a title above the list and associates it through <code>aria-labelledby</code>, so a screen reader announces the title when it enters the list. <code>edgeCompensation=&quot;inline&quot;</code> is for a list placed inside a padded container: it pulls every row toward the container&#39;s inline content edges so the row text lines up with a sibling heading, cancelling no more than the container padding each edge actually publishes.</p><p>The package also exports the more general <code>Item</code> primitive. <code>ListItem</code> is that primitive rendered as an <code>&lt;li&gt;</code> with the density and marker from its list; use <code>Item</code> directly when the same row layout is needed outside a list, or when you need its extra controls — <code>as</code>, <code>align</code>, <code>labelLines</code>, <code>descriptionLines</code>, and <code>layout</code>. Most screens only need <code>List</code> and <code>ListItem</code>.</p><h2 id="best-practices" tabindex="-1">Best practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to “Best practices”">​</a></h2><table tabindex="0"><thead><tr><th>Guidance</th><th>Practices</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Give the list a <code>header</code>. A screen reader announces it on entering the list, and sighted users get the context of the collection immediately.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Put icons, avatars, badges, or timestamps in <code>startContent</code> and <code>endContent</code>, so the two ends of a row carry the category and the status.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use <code>isSelected</code> to distinguish the current row and let the component pick <code>aria-selected</code> or <code>aria-current</code> from the row&#39;s role, instead of writing ARIA by hand.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Set <code>descriptionLines</code> when the length of the content varies, or rely on the default single-line truncation for string descriptions, so the row height does not jump.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Nest a second control inside an interactive row as its main action. The row&#39;s button already fills the content area, and two click targets make the focus order and the behaviour hard to predict.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use a list for a single entry. A list means the entries belong together; a short paragraph reads more naturally for one item.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Mix interactive and static rows in one list without a visible difference, leaving users unsure which rows open something.</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-label="Permalink to “Examples”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(listBasic),
				description: "A list with a header, rows that carry an icon on the left, and a badge or a chevron on the right.",
				locale: "en",
				title: "Basic"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(listDensities),
				description: "The three density steps change the block padding of every row, and a single row can override the density its list sets.",
				locale: "en",
				title: "Densities"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(listMarkers),
				description: "Disc and circle draw a bullet in front of each row, while decimal renders an ordered list whose numbering can start at any value.",
				locale: "en",
				title: "Markers"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(listInteractive),
				description: "Rows that carry a click handler become buttons with hover and pressed states; the selected row is marked, and the disabled row is inert.",
				locale: "en",
				title: "Selection and interaction"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region docs/en/components/list/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/list/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var list_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, list_default as default };
