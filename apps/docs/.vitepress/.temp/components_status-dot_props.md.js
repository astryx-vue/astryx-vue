import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/zh/components/status-dot/props.md
var __pageData = JSON.parse("{\"title\":\"状态点\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"状态点\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/status-dot/props.md\",\"filePath\":\"zh/components/status-dot/props.md\"}");
var _sfc_main = { name: "components/status-dot/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="StatusDot Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>variant</code></td><td><code>StatusDotVariant</code></td><td><code>&#39;neutral&#39;</code></td><td>状态点的语义颜色变体，可选 neutral、info、success、warning、error。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>状态的无障碍标签，必填。会作为 <code>aria-label</code> 供屏幕阅读器读取。</td></tr><tr><td><code>isPulsing</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否显示脉冲动画，开启后状态点会呼吸闪烁，用于提示正在进行中的活动。</td></tr></tbody></table></div><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>根元素为 <code>&lt;span&gt;</code>。</p><p>以下内容传入根元素：</p><ul><li>HTML 属性。</li><li><code>aria-*</code> 属性。</li><li><code>data-*</code> 属性。</li><li><code>class</code>。</li><li><code>style</code>。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/status-dot/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
