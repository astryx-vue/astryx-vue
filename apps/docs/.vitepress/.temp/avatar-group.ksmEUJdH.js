import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { i as resolveSize, n as _sfc_main$1$1, r as AvatarGroupContext } from "./Avatar-CEU50QJE.BuB-Q2bY.js";
import { computed, createElementBlock, createVNode, defineComponent, inject, mergeProps, normalizeClass, normalizeStyle, openBlock, provide, renderSlot, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/AvatarGroup-CZcgAMjM.js
var _hoisted_1$1 = {
	class: "astryx-avatar-group",
	role: "group",
	"aria-label": "Avatar group"
};
var OVERLAP_RATIO = .25;
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	__name: "AvatarGroup",
	props: {
		size: { default: "md" },
		shape: { default: "circle" }
	},
	setup(__props) {
		const props = __props;
		const numericSize = computed(() => resolveSize(props.size));
		const overlap = computed(() => Math.round(numericSize.value * OVERLAP_RATIO));
		provide(AvatarGroupContext, {
			size: computed(() => props.size),
			shape: computed(() => props.shape),
			overlap
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$1, [renderSlot(_ctx.$slots, "default")]);
		};
	}
});
var _hoisted_1 = ["aria-label"];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AvatarGroupOverflow",
	__name: "AvatarGroupOverflow",
	props: { count: {} },
	setup(__props) {
		const avatarGroup = inject(AvatarGroupContext, void 0);
		const size = computed(() => avatarGroup?.size.value ?? "md");
		const shape = computed(() => avatarGroup?.shape.value ?? "circle");
		const numericSize = computed(() => resolveSize(size.value));
		const rootStyle = computed(() => ({
			width: `${numericSize.value}px`,
			height: `${numericSize.value}px`,
			marginInlineStart: `${-(avatarGroup?.overlap.value ?? 0)}px`
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				class: normalizeClass(["astryx-avatar-group-overflow", [`astryx-avatar-group-overflow--${shape.value}`]]),
				style: normalizeStyle(rootStyle.value),
				role: "img",
				"aria-label": `${__props.count} more avatars`
			}, " +" + toDisplayString(__props.count), 15, _hoisted_1);
		};
	}
});
//#endregion
//#region components/demos/avatar-group/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main$1), mergeProps({ size: "md" }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Ana Thomas" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Ben Lee" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Carol Davis" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Nam Tran" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main), { count: 5 }, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1$1), { name: "Ana Thomas" }),
						createVNode(unref(_sfc_main$1$1), { name: "Ben Lee" }),
						createVNode(unref(_sfc_main$1$1), { name: "Carol Davis" }),
						createVNode(unref(_sfc_main$1$1), { name: "Nam Tran" }),
						createVNode(unref(_sfc_main), { count: 5 })
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/avatar-group/basic.vue
var _sfc_setup$1 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/avatar-group/basic.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/avatar-group/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Avatar } from '@astryx-vue/core/Avatar'\nimport { AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'\n<\/script>\n\n<template>\n  <AvatarGroup size=\"md\">\n    <Avatar name=\"Ana Thomas\" />\n    <Avatar name=\"Ben Lee\" />\n    <Avatar name=\"Carol Davis\" />\n    <Avatar name=\"Nam Tran\" />\n    <AvatarGroupOverflow :count=\"5\" />\n  </AvatarGroup>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Avatar } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Avatar'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { AvatarGroup, AvatarGroupOverflow } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/AvatarGroup'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"md\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Ana Thomas\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Ben Lee\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Carol Davis\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Nam Tran\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroupOverflow</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">count</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">5</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroup</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/avatar-group/sizes.vue?vue&type=script&setup=true&lang.ts
var sizes_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "sizes",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "avatar-group-preview__stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$1), { size: "sm" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Ana Thomas" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Ben Lee" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Carol Davis" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main), { count: 2 }, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1$1), { name: "Ana Thomas" }),
						createVNode(unref(_sfc_main$1$1), { name: "Ben Lee" }),
						createVNode(unref(_sfc_main$1$1), { name: "Carol Davis" }),
						createVNode(unref(_sfc_main), { count: 2 })
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$1), { size: "md" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Ana Thomas" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Ben Lee" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Carol Davis" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main), { count: 2 }, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1$1), { name: "Ana Thomas" }),
						createVNode(unref(_sfc_main$1$1), { name: "Ben Lee" }),
						createVNode(unref(_sfc_main$1$1), { name: "Carol Davis" }),
						createVNode(unref(_sfc_main), { count: 2 })
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$1), { size: "lg" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Ana Thomas" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Ben Lee" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Carol Davis" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main), { count: 2 }, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1$1), { name: "Ana Thomas" }),
						createVNode(unref(_sfc_main$1$1), { name: "Ben Lee" }),
						createVNode(unref(_sfc_main$1$1), { name: "Carol Davis" }),
						createVNode(unref(_sfc_main), { count: 2 })
					];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/avatar-group/sizes.vue
var _sfc_setup = sizes_vue_vue_type_script_setup_true_lang_default.setup;
sizes_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/avatar-group/sizes.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var sizes_default$1 = sizes_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/avatar-group/sizes.vue?raw&highlighted
var sizes_default = {
	"source": "<script setup lang=\"ts\">\nimport { Avatar } from '@astryx-vue/core/Avatar'\nimport { AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'\n<\/script>\n\n<template>\n  <div class=\"avatar-group-preview__stack\">\n    <AvatarGroup size=\"sm\">\n      <Avatar name=\"Ana Thomas\" />\n      <Avatar name=\"Ben Lee\" />\n      <Avatar name=\"Carol Davis\" />\n      <AvatarGroupOverflow :count=\"2\" />\n    </AvatarGroup>\n    <AvatarGroup size=\"md\">\n      <Avatar name=\"Ana Thomas\" />\n      <Avatar name=\"Ben Lee\" />\n      <Avatar name=\"Carol Davis\" />\n      <AvatarGroupOverflow :count=\"2\" />\n    </AvatarGroup>\n    <AvatarGroup size=\"lg\">\n      <Avatar name=\"Ana Thomas\" />\n      <Avatar name=\"Ben Lee\" />\n      <Avatar name=\"Carol Davis\" />\n      <AvatarGroupOverflow :count=\"2\" />\n    </AvatarGroup>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Avatar } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Avatar'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { AvatarGroup, AvatarGroupOverflow } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/AvatarGroup'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"avatar-group-preview__stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Ana Thomas\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Ben Lee\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Carol Davis\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroupOverflow</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">count</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroup</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"md\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Ana Thomas\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Ben Lee\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Carol Davis\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroupOverflow</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">count</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroup</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"lg\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Ana Thomas\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Ben Lee\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Carol Davis\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroupOverflow</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">count</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">AvatarGroup</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/avatar-group/index.ts
var avatarGroupBasic = defineDemo(basic_default$1, basic_default, { className: "avatar-group-preview" });
var avatarGroupSizes = defineDemo(sizes_default$1, sizes_default, { className: "avatar-group-preview" });
//#endregion
export { avatarGroupSizes as n, avatarGroupBasic as t };
