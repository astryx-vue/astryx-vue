import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/en/components/visually-hidden/props.md
var __pageData = JSON.parse("{\"title\":\"Visually Hidden\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Visually Hidden\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/visually-hidden/props.md\",\"filePath\":\"en/components/visually-hidden/props.md\"}");
var _sfc_main = { name: "en/components/visually-hidden/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="VisuallyHidden Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>&#39;span&#39;</code></td><td>Root HTML element or Vue component. Use <code>div</code> for a live region or block content.</td></tr></tbody></table></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><div class="component-api-table" role="region" aria-label="VisuallyHidden slots" tabindex="0"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>default</code></td><td>Content exposed to assistive technology while hidden visually. This slot is required.</td></tr></tbody></table></div><h2 id="template-ref" tabindex="-1">Template ref <a class="header-anchor" href="#template-ref" aria-label="Permalink to “Template ref”">​</a></h2><p>The component exposes <code>element</code> with type <code>HTMLElement | null</code>. <code>element</code> points to the rendered root element.</p><h2 id="styling-constraints" tabindex="-1">Styling constraints <a class="header-anchor" href="#styling-constraints" aria-label="Permalink to “Styling constraints”">​</a></h2><ul><li>The component ignores incoming <code>class</code>.</li><li>The component ignores incoming <code>style</code>.</li><li>External styles cannot replace the fixed hiding rules.</li></ul><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p>The root element receives:</p><ul><li><code>aria-*</code> attributes.</li><li><code>role</code>.</li><li><code>id</code>.</li><li><code>data-*</code> attributes.</li><li>Native event listeners.</li></ul><div class="warning custom-block"><p class="custom-block-title">Hidden content</p><p>Do not put interactive controls inside <code>VisuallyHidden</code>. The visual interface cannot show those controls.</p><p>To hide content from all users, use conditional rendering or the native <code>hidden</code> attribute.</p></div></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/visually-hidden/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
