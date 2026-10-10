import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { i as hoverCardPlacements, n as hoverCardControlled, t as hoverCardBasic } from "./hover-card.BAemcCQr.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/hover-card/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"Hover Card\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Hover Card\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/hover-card.md\",\"filePath\":\"en/components/hover-card/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "en/components/hover-card.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to “Usage”">​</a></h2><p><code>HoverCard</code> opens a card of richer content when the pointer hovers the trigger or keyboard focus lands on it. It differs from <code>Tooltip</code> in what it carries: a tooltip holds a line of plain text, while a hover card can hold an avatar, a name, a short bio, and action buttons. Use it for user profiles, link previews, and inline definitions.</p><p>Showing waits 300 milliseconds by default, so a pointer passing across the trigger does not flash the card. Hiding waits 200 milliseconds and is cancelled when the pointer enters the card, so the user can travel from the trigger into the card and keep reading or clicking without it vanishing on the way.</p><p>The trigger goes in the default slot and the card content goes in the <code>content</code> slot:</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p>When the trigger is plain text the component gives it a dashed underline and makes it focusable, so a keyboard user can open the card with Tab. When the trigger is an element such as a button or link, the component listens on that element and writes <code>aria-haspopup</code> and <code>aria-controls</code> onto it. Passing <code>label</code> exposes the card to assistive technology as a named <code>role=&quot;dialog&quot;</code>; without it the card is a <code>role=&quot;group&quot;</code> linked to the trigger by <code>aria-describedby</code>.</p><h2 id="best-practices" tabindex="-1">Best practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to “Best practices”">​</a></h2><table tabindex="0"><thead><tr><th>Guidance</th><th>Practices</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Keep the card supplementary: understanding improves with it, but the task is still completable without it.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use plain text as the trigger so the dashed underline and keyboard focus work by default; users then see that it is hoverable.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Pass <code>label</code> for content such as a profile, so the card enters the assistive-technology reading order as a named dialog.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Leave <code>touchTrigger</code> on <code>auto</code>: a trigger that does nothing on its own opens on a tap, while a button or link keeps its tap.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Put critical actions or required information only inside the card; it disappears as soon as the pointer leaves.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use a hover card where a tooltip or popover would do. A one-line hint belongs in <code>Tooltip</code>, and content the user must confirm belongs in <code>Popover</code>.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Put a long form inside the card. The pointer leaving closes it; that content belongs in a dialog.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Place it directly inside a <code>&lt;p&gt;</code>, a heading, or a link. Those placements work, but the layer&#39;s relationship to the document flow becomes hard to predict, so prefer a block context.</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-label="Permalink to “Examples”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(hoverCardBasic),
				title: "Basic",
				description: "Hover or focus the link and the card appears after a short delay, staying open once the pointer moves into it.",
				locale: "en"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(hoverCardPlacements),
				title: "Placements",
				description: "placement sets the side of the trigger; the card flips to the other side when there is no room.",
				locale: "en"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(hoverCardControlled),
				title: "Controlled",
				description: "Pass isOpen to control visibility. Hover and focus stop applying, and Escape only emits openChange(false).",
				locale: "en"
			}, null, _parent));
			_push(`<h2 id="accessibility" tabindex="-1">Accessibility <a class="header-anchor" href="#accessibility" aria-label="Permalink to “Accessibility”">​</a></h2><p>The hover card is a separate layer, and the component relates it to the trigger with ARIA attributes so assistive technology can both learn that the trigger carries extra context and read the structure and controls inside the open card:</p><ul><li>The card has <code>role=&quot;group&quot;</code>; with <code>label</code> it becomes a named <code>role=&quot;dialog&quot;</code>, because an unnamed dialog is invalid while an unnamed group is not.</li><li>Without <code>label</code>, the trigger carries <code>aria-describedby</code> pointing at the card.</li><li>With <code>label</code>, the trigger carries <code>aria-haspopup=&quot;dialog&quot;</code> instead, plus <code>aria-controls</code> while the card is open. <code>aria-expanded</code> is only written when the trigger&#39;s own role allows it; a plain-text <code>&lt;span&gt;</code> trigger has no such role, so it never gets the attribute.</li><li>Attributes the trigger already carried — <code>aria-haspopup</code>, <code>aria-controls</code>, <code>aria-expanded</code>, <code>aria-describedby</code> — are preserved and restored when the component unmounts.</li></ul><p>The keyboard path is complete: focusing the trigger opens the card immediately, and moving focus between the trigger and the card keeps it open. Pressing Escape while the card is showing closes it; if focus was inside the card it returns to the trigger, and that refocus does not reopen the card. In the controlled mode Escape only emits <code>openChange(false)</code> and the parent decides whether to close.</p><p>A touch screen has no hover, so <code>touchTrigger</code> decides what a tap does. The default <code>auto</code> opens the card on a tap of a trigger that performs no action of its own, and leaves the tap to buttons, links, and form controls; once open, a tap outside the card dismisses it. Because the content appears only briefly, keep information a user must see to complete a task out of the card.</p></div>`);
		};
	}
});
//#endregion
//#region docs/en/components/hover-card/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/hover-card/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var hover_card_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, hover_card_default as default };
