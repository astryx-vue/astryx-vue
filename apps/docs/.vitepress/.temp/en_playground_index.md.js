import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region docs/en/playground/index.md
var __pageData = JSON.parse("{\"title\":\"Playground\",\"description\":\"\",\"frontmatter\":{\"title\":\"Playground\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/playground/index.md\",\"filePath\":\"en/playground/index.md\"}");
var _sfc_main = { name: "en/playground/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/playground/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var playground_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, playground_default as default };
