import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/en/components/badge/props.md
var __pageData = JSON.parse("{\"title\":\"Badge\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Badge\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/badge/props.md\",\"filePath\":\"en/components/badge/props.md\"}");
var _sfc_main = { name: "en/components/badge/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Badge Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>variant</code></td><td><code>BadgeVariant</code></td><td><code>&#39;neutral&#39;</code></td><td>Sets the visual variant of the badge. Optional: neutral, info, success, warning, error, blue, cyan, green, orange, pink, purple, red, teal, yellow.</td></tr></tbody></table></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><div class="component-api-table" role="region" aria-label="Badge slots" tabindex="0"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>default</code></td><td>Text content displayed by the badge.</td></tr><tr><td><code>icon</code></td><td>Optional leading icon. An icon should not replace the text label.</td></tr></tbody></table></div><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p>The root element is <code>&lt;span&gt;</code>.</p><p>The root element receives:</p><ul><li>HTML attributes.</li><li><code>aria-*</code> attributes.</li><li><code>data-*</code> attributes.</li><li><code>class</code>.</li><li><code>style</code>.</li><li>Native event listeners.</li></ul><p><code>Badge</code> is a read-only indicator. Do not add interactive behavior.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/badge/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
