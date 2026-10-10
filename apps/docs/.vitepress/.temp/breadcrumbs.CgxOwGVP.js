import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { computed, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, inject, mergeProps, normalizeClass, openBlock, provide, renderSlot, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/Breadcrumbs-C3YZFQ9w.js
var breadcrumbContextKey = Symbol("breadcrumbContext");
var _hoisted_1$1 = {
	class: "astryx-breadcrumb-item__separator",
	"aria-hidden": "true"
};
var _hoisted_2$1 = ["href"];
var _hoisted_3 = {
	key: 0,
	class: "astryx-breadcrumb-item__icon"
};
var _hoisted_4 = {
	key: 0,
	class: "astryx-breadcrumb-item__icon"
};
var _hoisted_5 = {
	key: 0,
	class: "astryx-breadcrumb-item__icon"
};
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	__name: "BreadcrumbItem",
	props: {
		href: {},
		isCurrent: { type: Boolean }
	},
	emits: ["click"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const context = inject(breadcrumbContextKey, void 0);
		const variant = computed(() => context?.variant.value ?? "default");
		const separator = computed(() => context?.separator.value ?? "/");
		const classes = computed(() => ["astryx-breadcrumb-item", `astryx-breadcrumb-item--variant-${variant.value}`]);
		const contentClasses = computed(() => ["astryx-breadcrumb-item__content", props.isCurrent && "astryx-breadcrumb-item__content--current"]);
		function handleClick(event) {
			if (props.isCurrent) {
				event.preventDefault();
				return;
			}
			emit("click", event);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("li", { class: normalizeClass(classes.value) }, [createElementVNode("span", _hoisted_1$1, toDisplayString(separator.value), 1), __props.href && !__props.isCurrent ? (openBlock(), createElementBlock("a", {
				key: 0,
				href: __props.href,
				class: "astryx-breadcrumb-item__content",
				onClick: handleClick
			}, [_ctx.$slots.startIcon ? (openBlock(), createElementBlock("span", _hoisted_3, [renderSlot(_ctx.$slots, "startIcon")])) : createCommentVNode("v-if", true), renderSlot(_ctx.$slots, "default")], 8, _hoisted_2$1)) : !__props.isCurrent ? (openBlock(), createElementBlock("button", {
				key: 1,
				type: "button",
				class: "astryx-breadcrumb-item__content",
				onClick: handleClick
			}, [_ctx.$slots.startIcon ? (openBlock(), createElementBlock("span", _hoisted_4, [renderSlot(_ctx.$slots, "startIcon")])) : createCommentVNode("v-if", true), renderSlot(_ctx.$slots, "default")])) : (openBlock(), createElementBlock("span", {
				key: 2,
				class: normalizeClass(contentClasses.value),
				"aria-current": "page"
			}, [_ctx.$slots.startIcon ? (openBlock(), createElementBlock("span", _hoisted_5, [renderSlot(_ctx.$slots, "startIcon")])) : createCommentVNode("v-if", true), renderSlot(_ctx.$slots, "default")], 2))], 2);
		};
	}
});
var _hoisted_1 = ["aria-label"];
var _hoisted_2 = { class: "astryx-breadcrumbs__list" };
var _sfc_main = /*@__PURE__*/ defineComponent({
	__name: "Breadcrumbs",
	props: {
		separator: { default: "/" },
		variant: { default: "default" },
		label: { default: "Breadcrumb" }
	},
	setup(__props) {
		const props = __props;
		provide(breadcrumbContextKey, {
			variant: computed(() => props.variant),
			separator: computed(() => props.separator)
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("nav", {
				class: "astryx-breadcrumbs",
				"aria-label": __props.label
			}, [createElementVNode("ol", _hoisted_2, [renderSlot(_ctx.$slots, "default")])], 8, _hoisted_1);
		};
	}
});
//#endregion
//#region components/demos/breadcrumbs/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main), _attrs, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1), { href: "/" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Home `);
								else return [createTextVNode(" Home ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { href: "/components" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Components `);
								else return [createTextVNode(" Components ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { "is-current": "" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Breadcrumbs `);
								else return [createTextVNode(" Breadcrumbs ")];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1), { href: "/" }, {
							default: withCtx(() => [createTextVNode(" Home ")]),
							_: 1
						}),
						createVNode(unref(_sfc_main$1), { href: "/components" }, {
							default: withCtx(() => [createTextVNode(" Components ")]),
							_: 1
						}),
						createVNode(unref(_sfc_main$1), { "is-current": "" }, {
							default: withCtx(() => [createTextVNode(" Breadcrumbs ")]),
							_: 1
						})
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/breadcrumbs/basic.vue
var _sfc_setup$1 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/breadcrumbs/basic.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/breadcrumbs/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'\n<\/script>\n\n<template>\n  <Breadcrumbs>\n    <BreadcrumbItem href=\"/\">\n      Home\n    </BreadcrumbItem>\n    <BreadcrumbItem href=\"/components\">\n      Components\n    </BreadcrumbItem>\n    <BreadcrumbItem is-current>\n      Breadcrumbs\n    </BreadcrumbItem>\n  </Breadcrumbs>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { BreadcrumbItem, Breadcrumbs } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Breadcrumbs'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Breadcrumbs</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"/\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Home</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"/components\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Components</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-current</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Breadcrumbs</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Breadcrumbs</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/breadcrumbs/supporting.vue?vue&type=script&setup=true&lang.ts
var supporting_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "supporting",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main), mergeProps({ variant: "supporting" }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1), { href: "/" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Home `);
								else return [createTextVNode(" Home ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { href: "/components" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Components `);
								else return [createTextVNode(" Components ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { "is-current": "" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Breadcrumbs `);
								else return [createTextVNode(" Breadcrumbs ")];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1), { href: "/" }, {
							default: withCtx(() => [createTextVNode(" Home ")]),
							_: 1
						}),
						createVNode(unref(_sfc_main$1), { href: "/components" }, {
							default: withCtx(() => [createTextVNode(" Components ")]),
							_: 1
						}),
						createVNode(unref(_sfc_main$1), { "is-current": "" }, {
							default: withCtx(() => [createTextVNode(" Breadcrumbs ")]),
							_: 1
						})
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/breadcrumbs/supporting.vue
var _sfc_setup = supporting_vue_vue_type_script_setup_true_lang_default.setup;
supporting_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/breadcrumbs/supporting.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var supporting_default$1 = supporting_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/breadcrumbs/supporting.vue?raw&highlighted
var supporting_default = {
	"source": "<script setup lang=\"ts\">\nimport { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'\n<\/script>\n\n<template>\n  <Breadcrumbs variant=\"supporting\">\n    <BreadcrumbItem href=\"/\">\n      Home\n    </BreadcrumbItem>\n    <BreadcrumbItem href=\"/components\">\n      Components\n    </BreadcrumbItem>\n    <BreadcrumbItem is-current>\n      Breadcrumbs\n    </BreadcrumbItem>\n  </Breadcrumbs>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { BreadcrumbItem, Breadcrumbs } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Breadcrumbs'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Breadcrumbs</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"/\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Home</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"/components\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Components</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-current</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Breadcrumbs</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BreadcrumbItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Breadcrumbs</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/breadcrumbs/index.ts
var breadcrumbsBasic = defineDemo(basic_default$1, basic_default, { className: "breadcrumbs-preview" });
var breadcrumbsSupporting = defineDemo(supporting_default$1, supporting_default, { className: "breadcrumbs-preview" });
//#endregion
export { breadcrumbsSupporting as n, breadcrumbsBasic as t };
