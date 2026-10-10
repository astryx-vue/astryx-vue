import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/en/components/radio/props.md
var __pageData = JSON.parse("{\"title\":\"Radio\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Radio\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/radio/props.md\",\"filePath\":\"en/components/radio/props.md\"}");
var _sfc_main = { name: "en/components/radio/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="radio-props" tabindex="-1">Radio Props <a class="header-anchor" href="#radio-props" aria-label="Permalink to “Radio Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Radio props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>value</code></td><td><code>string | number</code></td><td>—</td><td>Required. Option value.</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required. Visible label and accessible name.</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Description shown below the label.</td></tr><tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>ID of the native input. Auto-generated when omitted.</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable this option.</td></tr><tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Make this option read-only.</td></tr></tbody></table></div><h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to “Events”">​</a></h2><ul><li><code>change(value, event)</code>: fired when the user selects this option.</li></ul><p>When Radio is used inside RadioGroup, RadioGroup coordinates the change events.</p><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><ul><li><code>labelIcon</code>: decorative icon before the label.</li></ul><h2 id="usage-constraint" tabindex="-1">Usage constraint <a class="header-anchor" href="#usage-constraint" aria-label="Permalink to “Usage constraint”">​</a></h2><p><code>Radio</code> depends on <code>RadioContext</code>. When used standalone, it falls back to a context-free state and renders a single radio button only. Always use Radio as a child of RadioGroup or RadioList.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/radio/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
