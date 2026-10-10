import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$1 } from "./Text-CKd7e3gK.CukfIJwc.js";
import { t as _sfc_main$2 } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { r as _sfc_main$2$1, t as _sfc_main$3 } from "./Stack-iv52y_Jv.C5zk9p8n.js";
import { Fragment, computed, createBlock, createElementBlock, createTextVNode, createVNode, defineComponent, mergeProps, openBlock, renderList, renderSlot, toDisplayString, unref, useAttrs, useSSRContext, useTemplateRef, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
//#region ../../packages/core/dist/Center-DVaZaTGP.js
var _hoisted_1 = ["data-axis"];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxCenter",
	inheritAttrs: false,
	__name: "Center",
	props: {
		axis: { default: "both" },
		width: {},
		height: {},
		maxWidth: {},
		minHeight: {},
		padding: {},
		paddingInline: {},
		paddingInlineStart: {},
		paddingInlineEnd: {},
		paddingBlock: {},
		paddingBlockStart: {},
		paddingBlockEnd: {},
		isInline: {
			type: Boolean,
			default: false
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const attrs = useAttrs();
		const root = useTemplateRef("root");
		__expose({ element: root });
		const spacingVariables = {
			0: "var(--astryx-spacing-0, 0px)",
			.5: "var(--astryx-spacing-0-5, 2px)",
			1: "var(--astryx-spacing-1, 4px)",
			1.5: "var(--astryx-spacing-1-5, 6px)",
			2: "var(--astryx-spacing-2, 8px)",
			3: "var(--astryx-spacing-3, 12px)",
			4: "var(--astryx-spacing-4, 16px)",
			5: "var(--astryx-spacing-5, 20px)",
			6: "var(--astryx-spacing-6, 24px)",
			8: "var(--astryx-spacing-8, 32px)",
			10: "var(--astryx-spacing-10, 40px)"
		};
		function formatSize(value) {
			if (value == null) return void 0;
			return typeof value === "number" ? `${value}px` : value;
		}
		function formatSpacing(value) {
			return value == null ? void 0 : spacingVariables[value];
		}
		const paddingBlockStart = computed(() => props.paddingBlockStart ?? props.paddingBlock ?? props.padding);
		const paddingBlockEnd = computed(() => props.paddingBlockEnd ?? props.paddingBlock ?? props.padding);
		const paddingInlineStart = computed(() => props.paddingInlineStart ?? props.paddingInline ?? props.padding);
		const paddingInlineEnd = computed(() => props.paddingInlineEnd ?? props.paddingInline ?? props.padding);
		const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")));
		const rootClass = computed(() => [
			"astryx-center",
			props.isInline && "astryx-center--inline",
			attrs.class
		]);
		const rootStyle = computed(() => {
			const centerStyle = {
				height: formatSize(props.height),
				maxWidth: formatSize(props.maxWidth),
				minHeight: formatSize(props.minHeight),
				width: formatSize(props.width)
			};
			centerStyle["--astryx-center-padding-block-start"] = formatSpacing(paddingBlockStart.value);
			centerStyle["--astryx-center-padding-block-end"] = formatSpacing(paddingBlockEnd.value);
			centerStyle["--astryx-center-padding-inline-start"] = formatSpacing(paddingInlineStart.value);
			centerStyle["--astryx-center-padding-inline-end"] = formatSpacing(paddingInlineEnd.value);
			return [attrs.style, centerStyle];
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", mergeProps({
				ref_key: "root",
				ref: root
			}, forwardedAttrs.value, {
				class: rootClass.value,
				"data-axis": __props.axis,
				style: rootStyle.value
			}), [renderSlot(_ctx.$slots, "default")], 16, _hoisted_1);
		};
	}
});
//#endregion
//#region components/demos/center/axes.vue?vue&type=script&setup=true&lang.ts
var axes_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "axes",
	__ssrInlineRender: true,
	setup(__props) {
		const axes = [
			{
				axis: "both",
				caption: "axis=\"both\""
			},
			{
				axis: "horizontal",
				caption: "axis=\"horizontal\""
			},
			{
				axis: "vertical",
				caption: "axis=\"vertical\""
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main$2$1), mergeProps({
				class: "center-preview__examples",
				gap: 4,
				wrap: "wrap"
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<!--[-->`);
						ssrRenderList(axes, (item) => {
							_push(`<div class="center-preview__example"${_scopeId}>`);
							_push(ssrRenderComponent(unref(_sfc_main), {
								class: "center-preview__stage",
								axis: item.axis,
								height: 120,
								padding: 2
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`<span class="center-preview__chip"${_scopeId}>Content</span>`);
									else return [createVNode("span", { class: "center-preview__chip" }, "Content")];
								}),
								_: 2
							}, _parent, _scopeId));
							_push(`<span class="center-preview__caption"${_scopeId}>${ssrInterpolate(item.caption)}</span></div>`);
						});
						_push(`<!--]-->`);
					} else return [(openBlock(), createBlock(Fragment, null, renderList(axes, (item) => {
						return createVNode("div", {
							key: item.axis,
							class: "center-preview__example"
						}, [createVNode(unref(_sfc_main), {
							class: "center-preview__stage",
							axis: item.axis,
							height: 120,
							padding: 2
						}, {
							default: withCtx(() => [createVNode("span", { class: "center-preview__chip" }, "Content")]),
							_: 1
						}, 8, ["axis"]), createVNode("span", { class: "center-preview__caption" }, toDisplayString(item.caption), 1)]);
					}), 64))];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/center/axes.vue
var _sfc_setup$3 = axes_vue_vue_type_script_setup_true_lang_default.setup;
axes_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/center/axes.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var axes_default$1 = axes_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/center/axes.vue?raw&highlighted
var axes_default = {
	"source": "<script setup lang=\"ts\">\nimport type { CenterAxis } from '@astryx-vue/core/Center'\nimport { Center } from '@astryx-vue/core/Center'\nimport { HStack } from '@astryx-vue/core/Stack'\n\nconst axes: { axis: CenterAxis, caption: string }[] = [\n  { axis: 'both', caption: 'axis=\"both\"' },\n  { axis: 'horizontal', caption: 'axis=\"horizontal\"' },\n  { axis: 'vertical', caption: 'axis=\"vertical\"' },\n]\n<\/script>\n\n<template>\n  <HStack class=\"center-preview__examples\" :gap=\"4\" wrap=\"wrap\">\n    <div v-for=\"item in axes\" :key=\"item.axis\" class=\"center-preview__example\">\n      <Center class=\"center-preview__stage\" :axis=\"item.axis\" :height=\"120\" :padding=\"2\">\n        <span class=\"center-preview__chip\">Content</span>\n      </Center>\n      <span class=\"center-preview__caption\">{{ item.caption }}</span>\n    </div>\n  </HStack>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { CenterAxis } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Center'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Center } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Center'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> axes</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { </span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">axis</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> CenterAxis</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">caption</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> string</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { axis: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'both'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, caption: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'axis=\"both\"'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { axis: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'horizontal'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, caption: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'axis=\"horizontal\"'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { axis: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'vertical'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, caption: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'axis=\"vertical\"'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__examples\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">4</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> wrap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"wrap\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-for</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"item in axes\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> :key</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"item.axis\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__example\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Center</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__stage\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">axis</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">item.axis</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">120</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__chip\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Content&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\">Center</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__caption\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>{{ item.caption }}&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/center/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main), mergeProps({
				class: "center-preview__stage",
				height: 180,
				padding: 4
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$3), {
						class: "center-preview__content",
						gap: 2,
						"h-align": "center"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(ssrRenderComponent(unref(_sfc_main$2), { variant: "info" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Draft `);
										else return [createTextVNode(" Draft ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(unref(_sfc_main$1), { weight: "medium" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` No projects yet `);
										else return [createTextVNode(" No projects yet ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(unref(_sfc_main$1), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Create a project to see it listed here. `);
										else return [createTextVNode(" Create a project to see it listed here. ")];
									}),
									_: 1
								}, _parent, _scopeId));
							} else return [
								createVNode(unref(_sfc_main$2), { variant: "info" }, {
									default: withCtx(() => [createTextVNode(" Draft ")]),
									_: 1
								}),
								createVNode(unref(_sfc_main$1), { weight: "medium" }, {
									default: withCtx(() => [createTextVNode(" No projects yet ")]),
									_: 1
								}),
								createVNode(unref(_sfc_main$1), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Create a project to see it listed here. ")]),
									_: 1
								})
							];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$3), {
						class: "center-preview__content",
						gap: 2,
						"h-align": "center"
					}, {
						default: withCtx(() => [
							createVNode(unref(_sfc_main$2), { variant: "info" }, {
								default: withCtx(() => [createTextVNode(" Draft ")]),
								_: 1
							}),
							createVNode(unref(_sfc_main$1), { weight: "medium" }, {
								default: withCtx(() => [createTextVNode(" No projects yet ")]),
								_: 1
							}),
							createVNode(unref(_sfc_main$1), {
								type: "supporting",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Create a project to see it listed here. ")]),
								_: 1
							})
						]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/center/basic.vue
var _sfc_setup$2 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/center/basic.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/center/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Badge } from '@astryx-vue/core/Badge'\nimport { Center } from '@astryx-vue/core/Center'\nimport { VStack } from '@astryx-vue/core/Stack'\nimport { Text } from '@astryx-vue/core/Text'\n<\/script>\n\n<template>\n  <Center class=\"center-preview__stage\" :height=\"180\" :padding=\"4\">\n    <VStack class=\"center-preview__content\" :gap=\"2\" h-align=\"center\">\n      <Badge variant=\"info\">\n        Draft\n      </Badge>\n      <Text weight=\"medium\">\n        No projects yet\n      </Text>\n      <Text type=\"supporting\" color=\"secondary\">\n        Create a project to see it listed here.\n      </Text>\n    </VStack>\n  </Center>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Badge } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Badge'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Center } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Center'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Center</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__stage\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">180</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">4</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__content\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> h-align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Badge</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"info\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        Draft</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Badge</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> weight</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"medium\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        No projects yet</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        Create a project to see it listed here.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\">Center</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/center/inline.vue?vue&type=script&setup=true&lang.ts
var inline_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "inline",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<p${ssrRenderAttrs(mergeProps({ class: "center-preview__sentence" }, _attrs))}> The build finished and `);
			_push(ssrRenderComponent(unref(_sfc_main), {
				class: "center-preview__badge",
				"is-inline": "",
				width: 22,
				height: 22
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-checkmark" style="${ssrRenderStyle({ "color": "var(--astryx-icon-success-foreground)" })}"${_scopeId}></span>`);
					else return [createVNode("span", {
						class: "css-icon css-icon--sm i-carbon-checkmark",
						style: { "color": "var(--astryx-icon-success-foreground)" }
					})];
				}),
				_: 1
			}, _parent));
			_push(` every artifact is up to date, so the sentence keeps a single line box while the glyph sits in a centered square. A second inline box marks the retried job: `);
			_push(ssrRenderComponent(unref(_sfc_main), {
				class: "center-preview__badge",
				"is-inline": "",
				width: 22,
				height: 22
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-warning" style="${ssrRenderStyle({ "color": "var(--astryx-icon-warning-foreground)" })}"${_scopeId}></span>`);
					else return [createVNode("span", {
						class: "css-icon css-icon--sm i-carbon-warning",
						style: { "color": "var(--astryx-icon-warning-foreground)" }
					})];
				}),
				_: 1
			}, _parent));
			_push(`</p>`);
		};
	}
});
//#endregion
//#region components/demos/center/inline.vue
var _sfc_setup$1 = inline_vue_vue_type_script_setup_true_lang_default.setup;
inline_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/center/inline.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var inline_default$1 = inline_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/center/inline.vue?raw&highlighted
var inline_default = {
	"source": "<script setup lang=\"ts\">\nimport { Center } from '@astryx-vue/core/Center'\n<\/script>\n\n<template>\n  <p class=\"center-preview__sentence\">\n    The build finished and\n    <Center class=\"center-preview__badge\" is-inline :width=\"22\" :height=\"22\">\n      <span class=\"css-icon css-icon--sm i-carbon-checkmark\" style=\"color: var(--astryx-icon-success-foreground)\" />\n    </Center>\n    every artifact is up to date, so the sentence keeps a single line box while the glyph sits in a\n    centered square. A second inline box marks the retried job:\n    <Center class=\"center-preview__badge\" is-inline :width=\"22\" :height=\"22\">\n      <span class=\"css-icon css-icon--sm i-carbon-warning\" style=\"color: var(--astryx-icon-warning-foreground)\" />\n    </Center>\n  </p>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Center } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Center'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__sentence\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    The build finished and</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Center</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__badge\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-inline</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">width</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">22</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">22</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-checkmark\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> style</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"color: var(--astryx-icon-success-foreground)\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\">Center</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    every artifact is up to date, so the sentence keeps a single line box while the glyph sits in a</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    centered square. A second inline box marks the retried job:</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Center</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__badge\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-inline</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">width</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">22</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">22</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-warning\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> style</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"color: var(--astryx-icon-warning-foreground)\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\">Center</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/center/padding.vue?vue&type=script&setup=true&lang.ts
var padding_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "padding",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main$2$1), mergeProps({
				class: "center-preview__examples",
				gap: 4,
				wrap: "wrap"
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="center-preview__example"${_scopeId}>`);
						_push(ssrRenderComponent(unref(_sfc_main), {
							class: "center-preview__stage",
							height: 120,
							padding: 0
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="center-preview__area"${_scopeId}>padding 0</span>`);
								else return [createVNode("span", { class: "center-preview__area" }, "padding 0")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<span class="center-preview__caption"${_scopeId}>padding=&quot;0&quot;</span></div><div class="center-preview__example"${_scopeId}>`);
						_push(ssrRenderComponent(unref(_sfc_main), {
							class: "center-preview__stage",
							height: 120,
							padding: 3
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="center-preview__area"${_scopeId}>padding 3</span>`);
								else return [createVNode("span", { class: "center-preview__area" }, "padding 3")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<span class="center-preview__caption"${_scopeId}>padding=&quot;3&quot;</span></div><div class="center-preview__example"${_scopeId}>`);
						_push(ssrRenderComponent(unref(_sfc_main), {
							class: "center-preview__stage",
							height: 120,
							padding: 6
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="center-preview__area"${_scopeId}>padding 6</span>`);
								else return [createVNode("span", { class: "center-preview__area" }, "padding 6")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<span class="center-preview__caption"${_scopeId}>padding=&quot;6&quot;</span></div><div class="center-preview__example"${_scopeId}>`);
						_push(ssrRenderComponent(unref(_sfc_main), {
							class: "center-preview__stage",
							height: 120,
							"padding-block": 1,
							"padding-inline": 6
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="center-preview__area"${_scopeId}>inline 6</span>`);
								else return [createVNode("span", { class: "center-preview__area" }, "inline 6")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<span class="center-preview__caption"${_scopeId}>paddingInline=&quot;6&quot; paddingBlock=&quot;1&quot;</span></div>`);
					} else return [
						createVNode("div", { class: "center-preview__example" }, [createVNode(unref(_sfc_main), {
							class: "center-preview__stage",
							height: 120,
							padding: 0
						}, {
							default: withCtx(() => [createVNode("span", { class: "center-preview__area" }, "padding 0")]),
							_: 1
						}), createVNode("span", { class: "center-preview__caption" }, "padding=\"0\"")]),
						createVNode("div", { class: "center-preview__example" }, [createVNode(unref(_sfc_main), {
							class: "center-preview__stage",
							height: 120,
							padding: 3
						}, {
							default: withCtx(() => [createVNode("span", { class: "center-preview__area" }, "padding 3")]),
							_: 1
						}), createVNode("span", { class: "center-preview__caption" }, "padding=\"3\"")]),
						createVNode("div", { class: "center-preview__example" }, [createVNode(unref(_sfc_main), {
							class: "center-preview__stage",
							height: 120,
							padding: 6
						}, {
							default: withCtx(() => [createVNode("span", { class: "center-preview__area" }, "padding 6")]),
							_: 1
						}), createVNode("span", { class: "center-preview__caption" }, "padding=\"6\"")]),
						createVNode("div", { class: "center-preview__example" }, [createVNode(unref(_sfc_main), {
							class: "center-preview__stage",
							height: 120,
							"padding-block": 1,
							"padding-inline": 6
						}, {
							default: withCtx(() => [createVNode("span", { class: "center-preview__area" }, "inline 6")]),
							_: 1
						}), createVNode("span", { class: "center-preview__caption" }, "paddingInline=\"6\" paddingBlock=\"1\"")])
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/center/padding.vue
var _sfc_setup = padding_vue_vue_type_script_setup_true_lang_default.setup;
padding_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/center/padding.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var padding_default$1 = padding_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/center/padding.vue?raw&highlighted
var padding_default = {
	"source": "<script setup lang=\"ts\">\nimport { Center } from '@astryx-vue/core/Center'\nimport { HStack } from '@astryx-vue/core/Stack'\n<\/script>\n\n<template>\n  <HStack class=\"center-preview__examples\" :gap=\"4\" wrap=\"wrap\">\n    <div class=\"center-preview__example\">\n      <Center class=\"center-preview__stage\" :height=\"120\" :padding=\"0\">\n        <span class=\"center-preview__area\">padding 0</span>\n      </Center>\n      <span class=\"center-preview__caption\">padding=\"0\"</span>\n    </div>\n    <div class=\"center-preview__example\">\n      <Center class=\"center-preview__stage\" :height=\"120\" :padding=\"3\">\n        <span class=\"center-preview__area\">padding 3</span>\n      </Center>\n      <span class=\"center-preview__caption\">padding=\"3\"</span>\n    </div>\n    <div class=\"center-preview__example\">\n      <Center class=\"center-preview__stage\" :height=\"120\" :padding=\"6\">\n        <span class=\"center-preview__area\">padding 6</span>\n      </Center>\n      <span class=\"center-preview__caption\">padding=\"6\"</span>\n    </div>\n    <div class=\"center-preview__example\">\n      <Center class=\"center-preview__stage\" :height=\"120\" :padding-block=\"1\" :padding-inline=\"6\">\n        <span class=\"center-preview__area\">inline 6</span>\n      </Center>\n      <span class=\"center-preview__caption\">paddingInline=\"6\" paddingBlock=\"1\"</span>\n    </div>\n  </HStack>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Center } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Center'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__examples\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">4</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> wrap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"wrap\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__example\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Center</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__stage\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">120</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">0</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__area\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>padding 0&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\">Center</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__caption\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>padding=\"0\"&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__example\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Center</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__stage\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">120</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__area\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>padding 3&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\">Center</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__caption\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>padding=\"3\"&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__example\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Center</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__stage\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">120</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">6</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__area\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>padding 6&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\">Center</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__caption\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>padding=\"6\"&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__example\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Center</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__stage\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">120</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding-block</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">1</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding-inline</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">6</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__area\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>inline 6&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\">Center</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center-preview__caption\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>paddingInline=\"6\" paddingBlock=\"1\"&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/center/index.ts
var options = { className: "center-preview" };
var centerBasic = defineDemo(basic_default$1, basic_default, options);
var centerAxes = defineDemo(axes_default$1, axes_default, options);
var centerPadding = defineDemo(padding_default$1, padding_default, options);
var centerInline = defineDemo(inline_default$1, inline_default, options);
//#endregion
export { centerPadding as i, centerBasic as n, centerInline as r, centerAxes as t };
