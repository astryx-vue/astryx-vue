import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/zh/index.md
var __pageData = JSON.parse("{\"title\":\"astryx-vue\",\"description\":\"面向 Vue 3 的 Astryx 设计系统社区实现。\",\"frontmatter\":{\"layout\":\"page\",\"title\":\"astryx-vue\",\"description\":\"面向 Vue 3 的 Astryx 设计系统社区实现。\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"index.md\",\"filePath\":\"zh/index.md\"}");
var _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><main class="astryx-home"><section class="astryx-hero" aria-labelledby="astryx-home-title"><div class="astryx-hero__atmosphere" aria-hidden="true"></div><div class="astryx-hero__content"><div class="astryx-wordmark" role="img" aria-label="astryx-vue"><span class="astryx-wordmark__vue" aria-hidden="true"></span><span class="astryx-wordmark__mark" aria-hidden="true"></span></div><h1 id="astryx-home-title">astryx 设计语言的 Vue 实现版本</h1><div class="astryx-hero__actions" aria-label="开始浏览"><a class="astryx-button astryx-button--primary" href="/guide/getting-started">开始使用</a><a class="astryx-button astryx-button--secondary" href="/components/">浏览组件</a></div></div></section></main></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var zh_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, zh_default as default };
