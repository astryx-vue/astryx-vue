import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/en/components/heading/props.md
var __pageData = JSON.parse("{\"title\":\"Heading\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Heading\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/heading/props.md\",\"filePath\":\"en/components/heading/props.md\"}");
var _sfc_main = { name: "en/components/heading/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Heading Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>level</code></td><td><code>HeadingLevel</code></td><td>-</td><td>Heading level (1–6). Determines the semantic element (h1–h6).</td></tr><tr><td><code>type</code></td><td><code>HeadingType</code></td><td>-</td><td>Visual type variant that overrides the default level styling. Optional: <code>display-1</code>, <code>display-2</code>, <code>display-3</code>, <code>body</code>, <code>large</code>, <code>label</code>, <code>supporting</code>.</td></tr><tr><td><code>color</code></td><td><code>HeadingColor</code></td><td><code>&#39;primary&#39;</code></td><td>Text color. Optional: <code>primary</code>, <code>secondary</code>, <code>accent</code>, <code>inherit</code>.</td></tr><tr><td><code>weight</code></td><td><code>HeadingWeight</code></td><td>-</td><td>Font weight override. Optional: <code>regular</code>, <code>medium</code>, <code>semibold</code>, <code>bold</code>.</td></tr><tr><td><code>display</code></td><td><code>HeadingDisplay</code></td><td><code>&#39;block&#39;</code></td><td>Display type: <code>block</code> or <code>inline</code>.</td></tr><tr><td><code>maxLines</code></td><td><code>number</code></td><td><code>0</code></td><td>Maximum lines before truncation. 0 means no truncation.</td></tr></tbody></table></div><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p>The root element is <code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code>.</p><p>The following are passed to the root element:</p><ul><li>HTML attributes.</li><li><code>aria-*</code> attributes.</li><li><code>data-*</code> attributes.</li><li><code>class</code>.</li><li><code>style</code>.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/heading/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
