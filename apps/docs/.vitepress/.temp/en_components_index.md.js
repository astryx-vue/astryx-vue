import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region docs/en/components/index.md
var __pageData = JSON.parse("{\"title\":\"Components\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Components\"},\"headers\":[],\"relativePath\":\"en/components/index.md\",\"filePath\":\"en/components/index.md\"}");
var _sfc_main = { name: "en/components/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_ComponentsOverview = resolveComponent("ComponentsOverview");
	_push(`<div${ssrRenderAttrs(_attrs)}>`);
	_push(ssrRenderComponent(_component_ComponentsOverview, { locale: "en" }, null, _parent));
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var components_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, components_default as default };
