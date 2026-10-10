import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/en/components/skeleton/props.md
var __pageData = JSON.parse("{\"title\":\"Skeleton\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Skeleton\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/skeleton/props.md\",\"filePath\":\"en/components/skeleton/props.md\"}");
var _sfc_main = { name: "en/components/skeleton/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Skeleton Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>width</code></td><td><code>number | string</code></td><td><code>&#39;100%&#39;</code></td><td>Placeholder width. Numbers are interpreted as pixels. Strings are preserved as CSS dimensions.</td></tr><tr><td><code>height</code></td><td><code>number | string</code></td><td><code>&#39;100%&#39;</code></td><td>Placeholder height. Numbers are interpreted as pixels. Strings are preserved as CSS dimensions.</td></tr><tr><td><code>radius</code></td><td><code>&#39;none&#39; | 0 | 1 | 2 | 3 | 4 | &#39;rounded&#39;</code></td><td><code>3</code></td><td>Design-token radius step. Use <code>none</code> for square corners and <code>rounded</code> for a fully rounded shape.</td></tr><tr><td><code>index</code></td><td><code>number</code></td><td><code>0</code></td><td>Stagger index. Each increment delays the animation by 100ms.</td></tr></tbody></table></div><h2 id="accessibility" tabindex="-1">Accessibility <a class="header-anchor" href="#accessibility" aria-label="Permalink to “Accessibility”">​</a></h2><ul><li><code>Skeleton</code> sets <code>aria-hidden=&quot;true&quot;</code> by default.</li><li>Assistive technology does not read the default placeholders.</li><li>Give the surrounding loading region an accessible name.</li><li>Set <code>aria-busy=&quot;true&quot;</code> on that region.</li><li>If the system requests reduced motion, the pulse animation stops.</li><li>In forced-colors mode, placeholders remain visible.</li></ul><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p>The root element is <code>&lt;div&gt;</code>.</p><p>The root element receives:</p><ul><li>HTML attributes.</li><li><code>aria-*</code> attributes.</li><li><code>data-*</code> attributes.</li><li><code>class</code>.</li><li><code>style</code>.</li><li>Native event listeners.</li></ul><p>An explicit <code>aria-hidden</code> value overrides the default.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/skeleton/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
