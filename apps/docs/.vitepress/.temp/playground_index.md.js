import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/zh/playground/index.md
var __pageData = JSON.parse("{\"title\":\"演练场\",\"description\":\"\",\"frontmatter\":{\"title\":\"演练场\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"playground/index.md\",\"filePath\":\"zh/playground/index.md\"}");
var _sfc_main = { name: "playground/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/playground/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var playground_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, playground_default as default };
