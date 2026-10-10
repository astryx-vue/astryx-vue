import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { n as switchSizes, r as switchStates, t as switchBasic } from "./switch.DAmJOwxZ.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/switch/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"Switch\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Switch\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/switch.md\",\"filePath\":\"en/components/switch/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "en/components/switch.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to “Usage”">​</a></h2><p><code>Switch</code> toggles a single boolean state.</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { Switch } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Switch&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> { shallowRef } </span><span style="${ssrRenderStyle({
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
			})}"> enabled</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}"> =</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> shallowRef</span><span style="${ssrRenderStyle({
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
			})}">Switch</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> v-model</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">enabled</span><span style="${ssrRenderStyle({
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
			})}">&quot;Notifications&quot;</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to “Best practices”">​</a></h2><table tabindex="0"><thead><tr><th>Guidance</th><th>Practices</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use for settings that apply immediately; the toggle should take effect without a separate save action.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Pair with a clear, concise label that describes the setting being controlled.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use for options that require a form submission to take effect; use a checkbox instead.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Wrap a disabled switch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-label="Permalink to “Examples”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(switchBasic),
				title: "Basic",
				description: "Bind a boolean value with v-model. The label and description are automatically associated through Field.",
				locale: "en"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(switchSizes),
				title: "Sizes",
				description: "Switch comes in sm, md, and lg sizes.",
				locale: "en"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(switchStates),
				title: "Disabled and read-only",
				description: "When disabledMessage is provided, the disabled switch remains focusable so the reason can be read.",
				locale: "en"
			}, null, _parent));
			_push(`<h2 id="keyboard-interactions" tabindex="-1">Keyboard interactions <a class="header-anchor" href="#keyboard-interactions" aria-label="Permalink to “Keyboard interactions”">​</a></h2><p><code>Switch</code> is built on a native checkbox, so its keyboard behaviour follows the browser&#39;s defaults and every action is reachable without a mouse. With focus on the switch, these keys apply:</p><ul><li>Tab moves focus to the switch.</li><li>Space toggles the checked state.</li><li>Escape closes the disabled-reason tooltip.</li></ul><p>The disabled-reason tooltip only appears when the switch is disabled and a <code>disabledMessage</code> is provided, so Escape has an effect only in that case.</p><h2 id="usage-notes" tabindex="-1">Usage notes <a class="header-anchor" href="#usage-notes" aria-label="Permalink to “Usage notes”">​</a></h2><p>Use a switch for a two-state option that takes effect right away, such as turning notifications on or off. If an option only applies once the form is submitted, use a checkbox instead; otherwise users may assume the switch has already saved the change.</p><p><code>isRequired</code> only shows the required indicator and sets <code>aria-required</code>; it does not perform validation or block form submission.</p></div>`);
		};
	}
});
//#endregion
//#region docs/en/components/switch/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/switch/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var switch_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, switch_default as default };
