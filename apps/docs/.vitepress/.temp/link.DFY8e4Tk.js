import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main } from "./Link-CprjOuTI.Dzy3pVDJ.js";
import { createTextVNode, defineComponent, mergeProps, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region components/demos/link/colors.vue?vue&type=script&setup=true&lang.ts
var colors_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "colors",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "link-preview__row" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				href: "/",
				color: "primary"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Primary `);
					else return [createTextVNode(" Primary ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				href: "/",
				color: "secondary"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Secondary `);
					else return [createTextVNode(" Secondary ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				href: "/",
				color: "accent"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Accent `);
					else return [createTextVNode(" Accent ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				href: "/",
				color: "inherit"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Inherit `);
					else return [createTextVNode(" Inherit ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/link/colors.vue
var _sfc_setup$1 = colors_vue_vue_type_script_setup_true_lang_default.setup;
colors_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/link/colors.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var colors_default$1 = colors_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/link/colors.vue?raw&highlighted
var colors_default = {
	"source": "<script setup lang=\"ts\">\nimport { Link } from '@astryx-vue/core/Link'\n<\/script>\n\n<template>\n  <div class=\"link-preview__row\">\n    <Link href=\"/\" color=\"primary\">\n      Primary\n    </Link>\n    <Link href=\"/\" color=\"secondary\">\n      Secondary\n    </Link>\n    <Link href=\"/\" color=\"accent\">\n      Accent\n    </Link>\n    <Link href=\"/\" color=\"inherit\">\n      Inherit\n    </Link>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Link } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Link'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"link-preview__row\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"/\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"primary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Primary</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"/\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Secondary</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"/\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"accent\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Accent</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"/\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"inherit\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Inherit</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/link/external.vue?vue&type=script&setup=true&lang.ts
var external_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "external",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "link-preview__row" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				href: "https://github.com",
				"is-external-link": ""
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` GitHub `);
					else return [createTextVNode(" GitHub ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				href: "https://example.com",
				"is-external-link": "",
				"has-underline": ""
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` External link with underline `);
					else return [createTextVNode(" External link with underline ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/link/external.vue
var _sfc_setup = external_vue_vue_type_script_setup_true_lang_default.setup;
external_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/link/external.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var external_default$1 = external_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/link/external.vue?raw&highlighted
var external_default = {
	"source": "<script setup lang=\"ts\">\nimport { Link } from '@astryx-vue/core/Link'\n<\/script>\n\n<template>\n  <div class=\"link-preview__row\">\n    <Link href=\"https://github.com\" is-external-link>\n      GitHub\n    </Link>\n    <Link href=\"https://example.com\" is-external-link has-underline>\n      External link with underline\n    </Link>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Link } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Link'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"link-preview__row\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"https://github.com\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-external-link</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      GitHub</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"https://example.com\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-external-link</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> has-underline</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      External link with underline</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/link/index.ts
var linkColors = defineDemo(colors_default$1, colors_default, { className: "link-preview" });
var linkExternal = defineDemo(external_default$1, external_default, { className: "link-preview" });
//#endregion
export { linkExternal as n, linkColors as t };
