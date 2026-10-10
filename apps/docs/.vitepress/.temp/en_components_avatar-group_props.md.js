import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/en/components/avatar-group/props.md
var __pageData = JSON.parse("{\"title\":\"Avatar Group\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Avatar Group\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/avatar-group/props.md\",\"filePath\":\"en/components/avatar-group/props.md\"}");
var _sfc_main = { name: "en/components/avatar-group/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="avatargroup-props" tabindex="-1">AvatarGroup Props <a class="header-anchor" href="#avatargroup-props" aria-label="Permalink to “AvatarGroup Props”">​</a></h2><div class="component-api-table" role="region" aria-label="AvatarGroup Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>size</code></td><td><code>AvatarSize</code></td><td><code>&#39;md&#39;</code></td><td>Uniform size for all avatars in the group.</td></tr><tr><td><code>shape</code></td><td><code>AvatarShape</code></td><td><code>&#39;circle&#39;</code></td><td>Uniform shape for all avatars in the group.</td></tr></tbody></table></div><h2 id="avatargroupoverflow-props" tabindex="-1">AvatarGroupOverflow Props <a class="header-anchor" href="#avatargroupoverflow-props" aria-label="Permalink to “AvatarGroupOverflow Props”">​</a></h2><div class="component-api-table" role="region" aria-label="AvatarGroupOverflow Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>count</code></td><td><code>number</code></td><td>-</td><td>Number of hidden avatars, displayed as +N.</td></tr></tbody></table></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><div class="component-api-table" role="region" aria-label="AvatarGroup Slots" tabindex="0"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>default</code></td><td><code>Avatar</code> elements, optionally ending with an <code>AvatarGroupOverflow</code>.</td></tr></tbody></table></div><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p>The root element is a <code>&lt;div role=&quot;group&quot;&gt;</code>.</p><p>The following are passed to the root element:</p><ul><li>HTML attributes.</li><li><code>aria-*</code> attributes.</li><li><code>data-*</code> attributes.</li><li><code>class</code>.</li><li><code>style</code>.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/avatar-group/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
