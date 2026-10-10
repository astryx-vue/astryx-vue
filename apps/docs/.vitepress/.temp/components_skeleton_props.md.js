import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/zh/components/skeleton/props.md
var __pageData = JSON.parse("{\"title\":\"骨架屏\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"骨架屏\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/skeleton/props.md\",\"filePath\":\"zh/components/skeleton/props.md\"}");
var _sfc_main = { name: "components/skeleton/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Skeleton Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>width</code></td><td><code>number | string</code></td><td><code>&#39;100%&#39;</code></td><td>占位块的宽度。传入数字时按像素处理，字符串则保留为 CSS 尺寸。</td></tr><tr><td><code>height</code></td><td><code>number | string</code></td><td><code>&#39;100%&#39;</code></td><td>占位块的高度。传入数字时按像素处理，字符串则保留为 CSS 尺寸。</td></tr><tr><td><code>radius</code></td><td><code>&#39;none&#39; | 0 | 1 | 2 | 3 | 4 | &#39;rounded&#39;</code></td><td><code>3</code></td><td>圆角使用设计令牌等级，<code>none</code> 为直角，<code>rounded</code> 为完全圆角。</td></tr><tr><td><code>index</code></td><td><code>number</code></td><td><code>0</code></td><td>交错动画的索引，每增加 1，动画延后 100ms，让多个占位块依次闪烁。</td></tr></tbody></table></div><h2 id="无障碍" tabindex="-1">无障碍 <a class="header-anchor" href="#无障碍" aria-label="Permalink to “无障碍”">​</a></h2><ul><li><code>Skeleton</code> 默认设置 <code>aria-hidden=&quot;true&quot;</code>。</li><li>辅助技术不会读取默认的占位块。</li><li>外围加载区域必须提供名称。</li><li>外围加载区域必须设置 <code>aria-busy=&quot;true&quot;</code>。</li><li>系统启用「减少动态效果」时，脉冲动画停止。</li><li>系统启用强制颜色模式时，占位块保持可见。</li></ul><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>根元素为 <code>&lt;div&gt;</code>。</p><p>以下内容传入根元素：</p><ul><li>HTML 属性。</li><li><code>aria-*</code> 属性。</li><li><code>data-*</code> 属性。</li><li><code>class</code>。</li><li><code>style</code>。</li><li>原生事件监听器。</li></ul><p>传入 <code>aria-hidden</code> 时，该值覆盖默认值。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/skeleton/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
