import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/en/index.md
var __pageData = JSON.parse("{\"title\":\"astryx-vue\",\"description\":\"A community Vue 3 implementation of the Astryx design system.\",\"frontmatter\":{\"layout\":\"page\",\"title\":\"astryx-vue\",\"description\":\"A community Vue 3 implementation of the Astryx design system.\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/index.md\",\"filePath\":\"en/index.md\"}");
var _sfc_main = { name: "en/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><main class="astryx-home"><section class="astryx-hero" aria-labelledby="astryx-home-title"><div class="astryx-hero__atmosphere" aria-hidden="true"></div><div class="astryx-hero__content"><div class="astryx-wordmark" role="img" aria-label="astryx-vue"><span class="astryx-wordmark__vue" aria-hidden="true"></span><span class="astryx-wordmark__mark" aria-hidden="true"></span></div><h1 id="astryx-home-title">The Astryx design language, implemented for Vue</h1><div class="astryx-hero__actions" aria-label="Start exploring"><a class="astryx-button astryx-button--primary" href="/en/guide/getting-started">Get started</a><a class="astryx-button astryx-button--secondary" href="/en/components/">Browse components</a></div></div></section></main></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var en_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, en_default as default };
