import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/zh/components/button-group/props.md
var __pageData = JSON.parse("{\"title\":\"按钮组\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"按钮组\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/button-group/props.md\",\"filePath\":\"zh/components/button-group/props.md\"}");
var _sfc_main = { name: "components/button-group/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="buttongroup-props" tabindex="-1">ButtonGroup Props <a class="header-anchor" href="#buttongroup-props" aria-label="Permalink to “ButtonGroup Props”">​</a></h2><div class="component-api-table" role="region" aria-label="ButtonGroup Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>按钮组的无障碍名称，供屏幕阅读器在组内导航时播报。</td></tr><tr><td><code>orientation</code></td><td><code>&#39;horizontal&#39; | &#39;vertical&#39;</code></td><td><code>&#39;horizontal&#39;</code></td><td>按钮的排列方向，组内方向键沿此方向移动焦点。</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39; | &#39;lg&#39;</code></td><td><code>&#39;md&#39;</code></td><td>组内按钮继承的默认尺寸；子按钮设置了自己的 size 时优先使用。</td></tr><tr><td><code>elevation</code></td><td><code>&#39;none&#39; | &#39;low&#39; | &#39;med&#39; | &#39;high&#39;</code></td><td><code>&#39;none&#39;</code></td><td>整个按钮组的静止阴影强度；放入组内的按钮不再单独显示阴影。</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用组内全部 Button 和 IconButton。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><p>ButtonGroup 通过必需的默认插槽接收 Button 或 IconButton。</p><h2 id="键盘导航" tabindex="-1">键盘导航 <a class="header-anchor" href="#键盘导航" aria-label="Permalink to “键盘导航”">​</a></h2><table tabindex="0"><thead><tr><th>按键</th><th>行为</th></tr></thead><tbody><tr><td>左右方向键</td><td>在水平组中移动焦点。</td></tr><tr><td>上下方向键</td><td>在垂直组中移动焦点。</td></tr><tr><td><code>Home</code></td><td>聚焦第一个可用按钮。</td></tr><tr><td><code>End</code></td><td>聚焦最后一个可用按钮。</td></tr></tbody></table><ul><li>键盘导航跳过禁用按钮。</li><li>从右到左的水平布局会交换左右方向键的行为。</li></ul><h2 id="模板引用" tabindex="-1">模板引用 <a class="header-anchor" href="#模板引用" aria-label="Permalink to “模板引用”">​</a></h2><p><code>ButtonGroup</code> 公开 <code>element</code>。 类型为 <code>HTMLDivElement | null</code>。</p><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>以下内容传入根元素：</p><ul><li>HTML 属性。</li><li><code>aria-*</code> 属性。</li><li><code>data-*</code> 属性。</li><li><code>class</code>。</li><li><code>style</code>。</li><li>原生事件监听器。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/button-group/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
