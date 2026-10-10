import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/en/components/status-dot/props.md
var __pageData = JSON.parse("{\"title\":\"Status Dot\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Status Dot\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/status-dot/props.md\",\"filePath\":\"en/components/status-dot/props.md\"}");
var _sfc_main = { name: "en/components/status-dot/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="StatusDot Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>variant</code></td><td><code>StatusDotVariant</code></td><td><code>&#39;neutral&#39;</code></td><td>The semantic color variant of the status dot. Optional: <code>neutral</code>, <code>info</code>, <code>success</code>, <code>warning</code>, <code>error</code>.</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Required accessible label. Announced by screen readers via <code>aria-label</code>.</td></tr><tr><td><code>isPulsing</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the dot pulses to indicate an active state.</td></tr></tbody></table></div><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p>The root element is a <code>&lt;span&gt;</code>.</p><p>The following are passed to the root element:</p><ul><li>HTML attributes.</li><li><code>aria-*</code> attributes.</li><li><code>data-*</code> attributes.</li><li><code>class</code>.</li><li><code>style</code>.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/status-dot/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
