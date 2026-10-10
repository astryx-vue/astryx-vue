import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/zh/components/checkbox-indicator/props.md
var __pageData = JSON.parse("{\"title\":\"复选指示器\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"复选指示器\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/checkbox-indicator/props.md\",\"filePath\":\"zh/components/checkbox-indicator/props.md\"}");
var _sfc_main = { name: "components/checkbox-indicator/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="属性列表" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>state</code></td><td><code>&#39;unchecked&#39; | &#39;checked&#39; | &#39;indeterminate&#39;</code></td><td>—</td><td>必需，要展示的标记状态。</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39;</code></td><td><code>&#39;md&#39;</code></td><td>指示器尺寸，md 为 24px，sm 为 20px。</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>以禁用的视觉样式展示，仅影响外观，不涉及交互行为。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><ul><li>默认插槽替换勾选和半选标记。</li><li>插槽内容只作装饰。</li><li>不得在插槽中放入可聚焦控件。</li></ul><h2 id="无障碍" tabindex="-1">无障碍 <a class="header-anchor" href="#无障碍" aria-label="Permalink to “无障碍”">​</a></h2><ul><li>根元素固定为 <code>aria-hidden=&quot;true&quot;</code>。</li><li>组件不设置交互角色。</li><li>组件不接收 <code>role</code>、<code>tabindex</code> 或 <code>contenteditable</code>。</li><li>组件不提供点击事件或键盘行为。</li><li>模板引用的 <code>element</code> 是 <code>HTMLSpanElement | null</code>。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><p>指示器与 <a href="/components/checkbox-input/props#主题">CheckboxInput</a> 共用颜色变量。</p><ul><li><code>.astryx-checkbox-indicator</code>：指示器外框。</li><li><code>.astryx-checkbox-indicator-check</code>：勾选标记。</li><li><code>.astryx-checkbox-indicator-dash</code>：半选标记。</li><li><code>data-state</code>：当前显示状态。</li><li><code>data-size</code>：当前尺寸。</li><li><code>data-disabled</code>：禁用状态。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/checkbox-indicator/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
