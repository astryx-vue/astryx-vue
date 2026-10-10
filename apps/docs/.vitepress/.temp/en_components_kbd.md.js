import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { n as kbdKeyNames, r as kbdModifiers, t as kbdBasic } from "./kbd.BnYqzceS.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/kbd/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"Kbd\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Kbd\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/kbd.md\",\"filePath\":\"en/components/kbd/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "en/components/kbd.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to “Usage”">​</a></h2><p><code>Kbd</code> presents a keyboard shortcut as a small group of painted key badges, such as <code>⌘K</code> or <code>⇧↵</code>. It belongs next to the action it triggers — on the right of a menu item, inside a tooltip, or at the end of a line of help text — so you can mention the shortcut without writing out &quot;hold Command and press K&quot;.</p><p>Pass the shortcut as one string and separate the keys with <code>+</code>:</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { Kbd } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Kbd&#39;</span></span>
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
			})}">Kbd</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> keys</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;mod+k&quot;</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p>Every segment becomes its own badge, so <code>mod+k</code> paints two keys. Whitespace around a segment is ignored and the case does not matter, which makes <code>mod + K</code> and <code>mod+k</code> the same shortcut. Anything the component does not recognize is uppercased as written, so <code>f1</code> shows as <code>F1</code>.</p><p><code>mod</code> is the one key that follows the platform: it reads as <code>⌘</code> on Apple platforms and as <code>Ctrl</code> everywhere else. Reach for <code>mod</code> when you describe a shortcut that works across platforms, and use <code>ctrl</code> only when the shortcut really is bound to the Control key. The other named keys have a fixed glyph:</p><table tabindex="0"><thead><tr><th>Written as</th><th>Painted as</th></tr></thead><tbody><tr><td><code>mod</code></td><td><code>⌘</code> on Apple platforms, <code>Ctrl</code> elsewhere</td></tr><tr><td><code>ctrl</code></td><td><code>⌃</code></td></tr><tr><td><code>alt</code></td><td><code>⌥</code></td></tr><tr><td><code>shift</code></td><td><code>⇧</code></td></tr><tr><td><code>enter</code></td><td><code>↵</code></td></tr><tr><td><code>backspace</code></td><td><code>⌫</code></td></tr><tr><td><code>tab</code></td><td><code>⇥</code></td></tr><tr><td><code>escape</code></td><td><code>Esc</code></td></tr><tr><td><code>up</code> / <code>down</code> / <code>left</code> / <code>right</code></td><td><code>↑</code> <code>↓</code> <code>←</code> <code>→</code></td></tr><tr><td><code>plus</code></td><td><code>+</code></td></tr></tbody></table><p><code>esc</code> is an alias for <code>escape</code>, and <code>return</code> is an alias for <code>enter</code>; an alias paints and is announced exactly like the key it names. Because <code>+</code> separates the keys, write <code>plus</code> for the plus key itself, as in <code>shift+plus</code>.</p><p>To a screen reader the whole group is one image named &quot;Command + K&quot;; the glyphs inside the badges are hidden because <code>⌘</code> and <code>⇧</code> are announced as nothing useful. The keys are spoken as words instead. Note that <code>Kbd</code> only presents a shortcut: it does not listen for keystrokes, and the shortcut still has to be implemented by the product.</p><h2 id="best-practices" tabindex="-1">Best practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to “Best practices”">​</a></h2><table tabindex="0"><thead><tr><th>Guidance</th><th>Practices</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Place the shortcut next to the action it triggers: on the right of a menu item, in a tooltip, or straight after the wording it belongs to.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Describe a cross-platform shortcut with <code>mod</code> rather than <code>ctrl</code> or <code>cmd</code>, so macOS users read <code>⌘</code> and everyone else reads <code>Ctrl</code>.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Only mention shortcuts that exist and can actually be pressed in the current context. A wrong hint is worse than no hint.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Spell shortcuts the same way as the rest of the product, so documentation and settings never disagree.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Treat <code>Kbd</code> as the only way to discover an action. Shortcuts supplement visible controls, they do not replace them.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Scatter shortcut hints across a screen. They are supporting information; in bulk they drown out the content.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Hand-write <code>⌘</code> or <code>⇧</code> characters instead of using the component. Hand-written glyphs do not follow the platform, and screen readers cannot announce what they mean.</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-label="Permalink to “Examples”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(kbdBasic),
				description: "Shortcuts sit beside the action they trigger: the label leads, the key badges follow, and the two read as one line.",
				locale: "en",
				title: "Shortcut list"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(kbdModifiers),
				description: "mod paints ⌘ on macOS and Ctrl elsewhere, while ctrl, alt, and shift keep their own glyphs and plus stands for the plus key.",
				locale: "en",
				title: "Modifiers and combinations"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(kbdKeyNames),
				description: "Every key name the component understands, with the glyph it paints. esc and return are aliases for escape and enter.",
				locale: "en",
				title: "Key names"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region docs/en/components/kbd/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/kbd/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var kbd_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, kbd_default as default };
