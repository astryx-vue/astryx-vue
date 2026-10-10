import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { createCommentVNode, createElementBlock, createElementVNode, createTextVNode, defineComponent, openBlock, renderSlot, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/Blockquote-DFqBv_oJ.js
var _hoisted_1 = { class: "astryx-blockquote" };
var _hoisted_2 = { key: 0 };
var _hoisted_3 = { class: "astryx-blockquote__cite" };
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxBlockquote",
	__name: "Blockquote",
	props: { cite: {} },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("blockquote", _hoisted_1, [renderSlot(_ctx.$slots, "default"), _ctx.$slots.cite || __props.cite != null ? (openBlock(), createElementBlock("footer", _hoisted_2, [createElementVNode("cite", _hoisted_3, [renderSlot(_ctx.$slots, "cite", {}, () => [createTextVNode(toDisplayString(__props.cite), 1)])])])) : createCommentVNode("v-if", true)]);
		};
	}
});
//#endregion
//#region components/demos/blockquote/cite.vue?vue&type=script&setup=true&lang.ts
var cite_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "cite",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(_sfc_main), null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Design is not just what it looks like and feels like. Design is how it works. `);
					else return [createTextVNode(" Design is not just what it looks like and feels like. Design is how it works. ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), { cite: "Steve Jobs" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` The people who are crazy enough to think they can change the world are the ones who do. `);
					else return [createTextVNode(" The people who are crazy enough to think they can change the world are the ones who do. ")];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region components/demos/blockquote/cite.vue
var _sfc_setup = cite_vue_vue_type_script_setup_true_lang_default.setup;
cite_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/blockquote/cite.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region components/demos/blockquote/index.ts
var blockquoteCite = defineDemo(cite_vue_vue_type_script_setup_true_lang_default, {
	"source": "<script setup lang=\"ts\">\nimport { Blockquote } from '@astryx-vue/core/Blockquote'\n<\/script>\n\n<template>\n  <Blockquote>\n    Design is not just what it looks like and feels like. Design is how it works.\n  </Blockquote>\n  <Blockquote cite=\"Steve Jobs\">\n    The people who are crazy enough to think they can change the world are the ones who do.\n  </Blockquote>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Blockquote } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Blockquote'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Blockquote</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    Design is not just what it looks like and feels like. Design is how it works.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Blockquote</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Blockquote</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> cite</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Steve Jobs\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    The people who are crazy enough to think they can change the world are the ones who do.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Blockquote</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
}, { className: "blockquote-preview" });
//#endregion
export { blockquoteCite as t };
