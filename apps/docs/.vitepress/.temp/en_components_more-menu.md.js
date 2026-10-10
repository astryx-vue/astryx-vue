import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { a as moreMenuTriggers, i as moreMenuSizes, n as moreMenuOverview, r as moreMenuSections, t as moreMenuBasic } from "./more-menu.DYHmlBsQ.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/more-menu/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"More menu\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"More menu\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/more-menu.md\",\"filePath\":\"en/components/more-menu/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "en/components/more-menu.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to “Usage”">​</a></h2><p><code>MoreMenu</code> is an overflow menu behind a <code>⋯</code> trigger. It holds the actions that do not need to stay visible: secondary actions in a table row, a card header, or a toolbar. The trigger is an icon-only button; everything it offers lives in the menu it opens.</p><p>The menu&#39;s content is described by an <code>items</code> array. A plain entry is one action, <code>type: &#39;divider&#39;</code> is a hairline between groups, and <code>type: &#39;section&#39;</code> is a titled group:</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { MoreMenu } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/MoreMenu&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">const</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> items</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}"> =</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> [</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  { label: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&#39;Rename&#39;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">, </span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">onClick</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: () </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">=&gt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> rename</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">() },</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  { label: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&#39;Duplicate&#39;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">, </span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">onClick</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: () </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">=&gt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> duplicate</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">() },</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  { type: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&#39;divider&#39;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> },</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  { label: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&#39;Move to trash&#39;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">, variant: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&#39;destructive&#39;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">, </span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">onClick</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: () </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">=&gt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> remove</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">() },</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">]</span></span>
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
			})}">MoreMenu</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> :</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">items</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">items</span><span style="${ssrRenderStyle({
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
			})}">&quot;File actions&quot;</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p>The trigger is icon-only, so <code>label</code> is its accessible name, the name of the menu itself, and the text of its tooltip. The default, <code>More options</code>, fits most interfaces; when the menu holds the actions of one specific thing, a more concrete phrase such as &quot;Project actions&quot; reads better. Use the <code>icon</code> slot to replace the three-dot artwork.</p><p>Where focus lands when the menu opens depends on how it was opened. A keyboard open (<code>Enter</code>, <code>Space</code>, <code>ArrowDown</code>, or <code>ArrowUp</code> on the trigger) lands on the first or the last row; a pointer open puts focus on the menu container and pre-highlights nothing, so no row reads as already selected. Once open, <code>ArrowDown</code> and <code>ArrowUp</code> move between rows and wrap at both ends, <code>Home</code> and <code>End</code> jump to the ends, typing a letter jumps to the next row starting with it, <code>Enter</code> and <code>Space</code> run the focused row, <code>Escape</code> closes the menu and returns focus to the trigger, and <code>Tab</code> closes the menu and lets the browser move on from the trigger. Disabled rows are skipped and stay out of the keyboard path.</p><p>Mouse and touch behave differently on purpose. With a mouse, the highlight follows the pointer while it is held and the release decides which row acts; releasing outside the menu dismisses it. With a finger, a release off the menu leaves it open, because the highlight is following the finger — the gesture ends when a row is picked, the trigger is tapped, or <code>Escape</code> is pressed. The <code>placement</code> and <code>alignment</code> props place the anchored menu beside the trigger and flip it when there is no room; an overflow menu usually wants <code>alignment=&quot;end&quot;</code>, so the menu lines up with the trigger&#39;s trailing edge.</p><p><code>presentation</code> decides the shape the actions arrive in. <code>popover</code> (the default) is the anchored surface; <code>bottom-sheet</code> is a modal panel at the bottom of the screen, sized for a thumb; <code>adaptive</code> keeps the anchored menu on pointer-driven layouts and uses the bottom panel at 768px and below when the primary pointer is coarse. Inside the bottom panel a submenu does not open a second panel: the view is replaced, its title becomes the submenu&#39;s own label, a back button appears, and <code>Escape</code> leaves the submenu before it closes the panel.</p><p>The open state can belong to the component or to you. Pass <code>isMenuOpen</code> to control it, usually with <code>v-model:isMenuOpen</code>; <code>openChange</code> fires every time an open or close is requested.</p><h2 id="best-practices" tabindex="-1">Best practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to “Best practices”">​</a></h2><table tabindex="0"><thead><tr><th>Guidance</th><th>Practice</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Keep it for secondary actions. A primary action belongs in the open, where people can see it; hiding it in a menu makes it hard to find.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>With many entries, group them with dividers or sections — and keep destructive actions last and marked <code>variant=&quot;destructive&quot;</code>.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Give similar rows a <code>description</code>, so near neighbours such as &quot;Export&quot; and &quot;Publish&quot; can be told apart at a glance.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use <code>alignment=&quot;end&quot;</code> when the trigger sits at the end of a table row or toolbar, so the menu lines up with the trigger instead of covering the content.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use <code>presentation=&quot;adaptive&quot;</code> for interfaces used mostly on phones, where a thumb reaches the actions on a bottom panel.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Avoid`);
					else return [createTextVNode("Avoid")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Vague names, such as a &quot;More&quot; entry inside a &quot;More&quot; menu. The trigger needs a <code>label</code> that says what the menu is for.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Avoid`);
					else return [createTextVNode("Avoid")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Piling a dozen actions into one menu. Past a screenful, the reader has to open, scroll, and pick — worse than showing the actions directly.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Avoid`);
					else return [createTextVNode("Avoid")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Keying data or navigation off whether the menu happens to be open. A menu is a temporary surface; its state belongs in your own data.</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-label="Permalink to “Examples”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(moreMenuOverview),
				description: "An overflow menu with its surface open: actions, a divider, and a destructive row at the end.",
				locale: "en",
				title: "The menu surface"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(moreMenuSizes),
				description: "Row density follows the menu size: sm, md, and lg step through the same density scale a list item uses, so the three are easy to tell apart.",
				locale: "en",
				title: "Sizes"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(moreMenuBasic),
				description: "A working trigger. Open it with a click or with Enter, then pick an action to see it reported below.",
				locale: "en",
				title: "Basic usage"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(moreMenuSections),
				description: "Sections with headings group related actions, and each row can carry an icon, a description, and a shortcut hint.",
				locale: "en",
				title: "Groups and descriptions"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(moreMenuTriggers),
				description: "The trigger takes the button sizes and variants, can be disabled, accepts custom artwork, and can use the adaptive presentation.",
				locale: "en",
				title: "Trigger shapes"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region docs/en/components/more-menu/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/more-menu/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var more_menu_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, more_menu_default as default };
