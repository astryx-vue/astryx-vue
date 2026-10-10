import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/en/components/checkbox-indicator/props.md
var __pageData = JSON.parse("{\"title\":\"Checkbox Indicator\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Checkbox Indicator\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/checkbox-indicator/props.md\",\"filePath\":\"en/components/checkbox-indicator/props.md\"}");
var _sfc_main = { name: "en/components/checkbox-indicator/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Properties" tabindex="0"><table><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>state</code></td><td><code>&#39;unchecked&#39; | &#39;checked&#39; | &#39;indeterminate&#39;</code></td><td>—</td><td>Required. The visual state.</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39;</code></td><td><code>&#39;md&#39;</code></td><td>Indicator size.</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Shows disabled styling.</td></tr></tbody></table></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><ul><li>The default slot replaces the checkmark and dash.</li><li>Slot content is decorative.</li><li>Do not put focusable controls in the slot.</li></ul><h2 id="accessibility" tabindex="-1">Accessibility <a class="header-anchor" href="#accessibility" aria-label="Permalink to “Accessibility”">​</a></h2><ul><li>The root always has <code>aria-hidden=&quot;true&quot;</code>.</li><li>The component has no interactive role.</li><li>It ignores <code>role</code>, <code>tabindex</code> and <code>contenteditable</code> attributes.</li><li>It provides no click or keyboard behavior.</li><li>The exposed <code>element</code> is <code>HTMLSpanElement | null</code>.</li></ul><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><p>The indicator shares color variables with <a href="/en/components/checkbox-input/props#theme">CheckboxInput</a>.</p><ul><li><code>.astryx-checkbox-indicator</code>: outer box.</li><li><code>.astryx-checkbox-indicator-check</code>: checkmark.</li><li><code>.astryx-checkbox-indicator-dash</code>: indeterminate mark.</li><li><code>data-state</code>: current visual state.</li><li><code>data-size</code>: current size.</li><li><code>data-disabled</code>: disabled state.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/checkbox-indicator/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
