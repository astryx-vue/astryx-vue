import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/zh/components/avatar-group/props.md
var __pageData = JSON.parse("{\"title\":\"头像组\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"头像组\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/avatar-group/props.md\",\"filePath\":\"zh/components/avatar-group/props.md\"}");
var _sfc_main = { name: "components/avatar-group/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="avatargroup-props" tabindex="-1">AvatarGroup Props <a class="header-anchor" href="#avatargroup-props" aria-label="Permalink to “AvatarGroup Props”">​</a></h2><div class="component-api-table" role="region" aria-label="AvatarGroup Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>size</code></td><td><code>AvatarSize</code></td><td><code>&#39;md&#39;</code></td><td>组内所有头像统一使用的尺寸，单个头像自身的 <code>size</code> 在组内不再生效。</td></tr><tr><td><code>shape</code></td><td><code>AvatarShape</code></td><td><code>&#39;circle&#39;</code></td><td>组内所有头像统一使用的形状，单个头像自身的 <code>shape</code> 在组内不再生效。</td></tr></tbody></table></div><h2 id="avatargroupoverflow-props" tabindex="-1">AvatarGroupOverflow Props <a class="header-anchor" href="#avatargroupoverflow-props" aria-label="Permalink to “AvatarGroupOverflow Props”">​</a></h2><div class="component-api-table" role="region" aria-label="AvatarGroupOverflow Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>count</code></td><td><code>number</code></td><td>-</td><td>隐藏头像的数量，显示为 +N。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><div class="component-api-table" role="region" aria-label="AvatarGroup 插槽" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>组内的 <code>Avatar</code> 元素，末尾可放一个 <code>AvatarGroupOverflow</code>。</td></tr></tbody></table></div><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>根元素为 <code>&lt;div role=&quot;group&quot;&gt;</code>。</p><p>以下内容传入根元素：</p><ul><li>HTML 属性。</li><li><code>aria-*</code> 属性。</li><li><code>data-*</code> 属性。</li><li><code>class</code>。</li><li><code>style</code>。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/avatar-group/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
