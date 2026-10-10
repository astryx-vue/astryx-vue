import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/en/components/text/props.md
var __pageData = JSON.parse("{\"title\":\"Text\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Text\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/text/props.md\",\"filePath\":\"en/components/text/props.md\"}");
var _sfc_main = { name: "en/components/text/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Text Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>type</code></td><td><code>TextType</code></td><td><code>&#39;body&#39;</code></td><td>Semantic text type. Determines default size, weight, and line-height. Optional: body, large, label, supporting, code, display-1, display-2, display-3.</td></tr><tr><td><code>size</code></td><td><code>TextSize</code></td><td>-</td><td>Explicit font size override. Optional: sm, md, lg, xl.</td></tr><tr><td><code>color</code></td><td><code>TextColor</code></td><td><code>&#39;primary&#39;</code></td><td>Text color. Optional: primary, secondary, accent, inherit.</td></tr><tr><td><code>weight</code></td><td><code>TextWeight</code></td><td>-</td><td>Font weight override. Optional: regular, medium, semibold, bold.</td></tr><tr><td><code>display</code></td><td><code>TextDisplay</code></td><td><code>&#39;inline&#39;</code></td><td>Display type: <code>inline</code> or <code>block</code>.</td></tr><tr><td><code>as</code></td><td><code>TextAs</code></td><td><code>&#39;span&#39;</code></td><td>HTML element to render. Optional: span, p, div, label.</td></tr><tr><td><code>maxLines</code></td><td><code>number</code></td><td><code>0</code></td><td>Maximum lines before truncation. 0 means no truncation.</td></tr></tbody></table></div><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p>The root element is determined by <code>as</code>, defaulting to <code>&lt;span&gt;</code>.</p><p>The following are passed to the root element:</p><ul><li>HTML attributes.</li><li><code>aria-*</code> attributes.</li><li><code>data-*</code> attributes.</li><li><code>class</code>.</li><li><code>style</code>.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/text/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
