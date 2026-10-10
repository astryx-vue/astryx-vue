import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/zh/components/radio/props.md
var __pageData = JSON.parse("{\"title\":\"单选按钮\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"单选按钮\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/radio/props.md\",\"filePath\":\"zh/components/radio/props.md\"}");
var _sfc_main = { name: "components/radio/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="Radio 属性" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>value</code></td><td><code>string | number</code></td><td>—</td><td>必需。该选项的值，选中后作为单选组的当前值。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必需。选项的可见标签，同时作为无障碍名称供屏幕阅读器朗读。</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>显示在标签下方的补充说明。</td></tr><tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>原生 input 元素的 ID，省略时自动生成。</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用该选项，禁用后不可选择。</td></tr><tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否只读。只读的选项仍可见，但无法更改选中状态。</td></tr></tbody></table></div><h2 id="事件" tabindex="-1">事件 <a class="header-anchor" href="#事件" aria-label="Permalink to “事件”">​</a></h2><ul><li><code>change(value, event)</code>：用户选择该选项时触发。</li></ul><p>当 Radio 在 RadioGroup 内使用时，事件由 RadioGroup 统一管理。</p><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><ul><li><code>labelIcon</code>：标签前的装饰图标。</li></ul><h2 id="使用约束" tabindex="-1">使用约束 <a class="header-anchor" href="#使用约束" aria-label="Permalink to “使用约束”">​</a></h2><p><code>Radio</code> 依赖 <code>RadioContext</code> 获取所在组的状态。脱离 RadioGroup 独立使用时，它会退化为无上下文状态，只能渲染一个孤零零的单选按钮。 因此建议始终把 Radio 作为 RadioGroup 或 RadioList 的子项使用。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/radio/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
