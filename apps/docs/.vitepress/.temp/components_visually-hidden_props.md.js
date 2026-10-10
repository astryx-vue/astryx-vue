import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/zh/components/visually-hidden/props.md
var __pageData = JSON.parse("{\"title\":\"视觉隐藏\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"视觉隐藏\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/visually-hidden/props.md\",\"filePath\":\"zh/components/visually-hidden/props.md\"}");
var _sfc_main = { name: "components/visually-hidden/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="VisuallyHidden Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>&#39;span&#39;</code></td><td>根 HTML 元素或 Vue 组件。实时区域或块级内容可使用 <code>div</code>。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><div class="component-api-table" role="region" aria-label="VisuallyHidden 插槽" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>对辅助技术公开、但从视觉界面隐藏的内容。此插槽为必需项。</td></tr></tbody></table></div><h2 id="模板引用" tabindex="-1">模板引用 <a class="header-anchor" href="#模板引用" aria-label="Permalink to “模板引用”">​</a></h2><p>组件公开 <code>element</code>。类型为 <code>HTMLElement | null</code>。 <code>element</code> 指向最终渲染的根元素。</p><h2 id="样式约束" tabindex="-1">样式约束 <a class="header-anchor" href="#样式约束" aria-label="Permalink to “样式约束”">​</a></h2><ul><li>组件忽略传入的 <code>class</code>。</li><li>组件忽略传入的 <code>style</code>。</li><li>固定的隐藏样式不接受外部覆盖。</li></ul><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>以下内容传入根元素：</p><ul><li><code>aria-*</code> 属性。</li><li><code>role</code>。</li><li><code>id</code>。</li><li><code>data-*</code> 属性。</li><li>原生事件监听器。</li></ul><div class="warning custom-block"><p class="custom-block-title">隐藏内容</p><p>不得在 <code>VisuallyHidden</code> 内放置交互控件。视觉界面无法显示这些控件。</p><p>必须对所有用户隐藏内容时，使用条件渲染或原生 <code>hidden</code> 属性。</p></div></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/visually-hidden/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
