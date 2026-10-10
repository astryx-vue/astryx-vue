import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/zh/components/text/props.md
var __pageData = JSON.parse("{\"title\":\"文本\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"文本\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/text/props.md\",\"filePath\":\"zh/components/text/props.md\"}");
var _sfc_main = { name: "components/text/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Text Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>type</code></td><td><code>TextType</code></td><td><code>&#39;body&#39;</code></td><td>语义文本类型，可选 body、large、label、supporting、code、display-1、display-2、display-3。</td></tr><tr><td><code>size</code></td><td><code>TextSize</code></td><td>-</td><td>显式字号覆盖，可选 sm、md、lg、xl。</td></tr><tr><td><code>color</code></td><td><code>TextColor</code></td><td><code>&#39;primary&#39;</code></td><td>文字颜色，可选 primary、secondary、accent、inherit。</td></tr><tr><td><code>weight</code></td><td><code>TextWeight</code></td><td>-</td><td>字重覆盖，可选 regular、medium、semibold、bold。</td></tr><tr><td><code>display</code></td><td><code>TextDisplay</code></td><td><code>&#39;inline&#39;</code></td><td>显示类型：<code>inline</code> 或 <code>block</code>。</td></tr><tr><td><code>as</code></td><td><code>TextAs</code></td><td><code>&#39;span&#39;</code></td><td>实际渲染的 HTML 元素，可选 span、p、div、label。</td></tr><tr><td><code>maxLines</code></td><td><code>number</code></td><td><code>0</code></td><td>最大显示行数，超出部分截断并显示省略号，0 表示不截断。</td></tr></tbody></table></div><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>根元素由 <code>as</code> 决定，默认为 <code>&lt;span&gt;</code>。</p><p>以下内容传入根元素：</p><ul><li>HTML 属性。</li><li><code>aria-*</code> 属性。</li><li><code>data-*</code> 属性。</li><li><code>class</code>。</li><li><code>style</code>。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/text/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
