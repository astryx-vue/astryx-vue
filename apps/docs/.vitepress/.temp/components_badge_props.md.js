import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/zh/components/badge/props.md
var __pageData = JSON.parse("{\"title\":\"标签\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"标签\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/badge/props.md\",\"filePath\":\"zh/components/badge/props.md\"}");
var _sfc_main = { name: "components/badge/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Badge Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>variant</code></td><td><code>BadgeVariant</code></td><td><code>&#39;neutral&#39;</code></td><td>标签的视觉变体。语义变体：neutral、info、success、warning、error；分类颜色：blue、cyan、green、orange、pink、purple、red、teal、yellow。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><div class="component-api-table" role="region" aria-label="Badge 插槽" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>标签的文字内容。</td></tr><tr><td><code>icon</code></td><td>可选的前置图标。不得用图标代替文字。</td></tr></tbody></table></div><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>根元素为 <code>&lt;span&gt;</code>。</p><p>以下内容传入根元素：</p><ul><li>HTML 属性。</li><li><code>aria-*</code> 属性。</li><li><code>data-*</code> 属性。</li><li><code>class</code>。</li><li><code>style</code>。</li><li>原生事件监听器。</li></ul><p><code>Badge</code> 是只读指示器。不得为标签添加交互行为。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/badge/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
