import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as invokeNativeEventHandler } from "./eventHandlers-DUXzBWZy.C50IdnRl.js";
import { i as buttonGroupContextKey, t as _sfc_main$1 } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { computed, createElementBlock, createVNode, defineComponent, mergeProps, onBeforeUnmount, onMounted, openBlock, provide, renderSlot, unref, useAttrs, useSSRContext, useTemplateRef, withCtx } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/ButtonGroup-ySQWanDP.js
var _hoisted_1 = [
	"aria-disabled",
	"aria-label",
	"data-elevation",
	"data-orientation",
	"data-size"
];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "ButtonGroup",
	inheritAttrs: false,
	__name: "ButtonGroup",
	props: {
		elevation: { default: "none" },
		isDisabled: {
			type: Boolean,
			default: false
		},
		label: {},
		orientation: { default: "horizontal" },
		size: { default: "md" }
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const attrs = useAttrs();
		const element = useTemplateRef("root");
		const orientation = computed(() => props.orientation);
		const isDisabled = computed(() => props.isDisabled);
		const size = computed(() => props.size);
		provide(buttonGroupContextKey, {
			isDisabled,
			orientation,
			size
		});
		const rootClass = computed(() => ["astryx-button-group", attrs.class]);
		const rootStyle = computed(() => attrs.style);
		const controlledAttrs = /* @__PURE__ */ new Set([
			"aria-disabled",
			"aria-label",
			"class",
			"onKeyDown",
			"onKeydown",
			"style"
		]);
		function getForwardedAttrs() {
			return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)));
		}
		function getItems() {
			const root = element.value;
			if (root == null) return [];
			return Array.from(root.children).filter((child) => child instanceof HTMLElement && child.classList.contains("astryx-button"));
		}
		function isItemDisabled(item) {
			return item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled") || item.disabled === true;
		}
		function findEnabledIndex(items, start, step, wrap) {
			let index = start;
			for (let visited = 0; visited < items.length; visited += 1) {
				if (index < 0 || index >= items.length) {
					if (!wrap) return -1;
					index = (index + items.length) % items.length;
				}
				const item = items[index];
				if (item != null && !isItemDisabled(item)) return index;
				index += step;
			}
			return -1;
		}
		function focusItem(items, index) {
			items[index]?.focus();
		}
		function handleKeydown(event) {
			invokeNativeEventHandler(attrs.onKeydown ?? attrs.onKeyDown, event);
			if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
			if (event.key === "Escape") {
				event.preventDefault();
				return;
			}
			const items = getItems();
			if (items.length === 0) return;
			const activeElement = typeof document === "undefined" ? null : document.activeElement;
			const currentIndex = items.findIndex((item) => item === activeElement || item.contains(activeElement));
			const root = element.value;
			const isRtl = root != null && typeof getComputedStyle !== "undefined" && getComputedStyle(root).direction === "rtl";
			const nextKey = props.orientation === "horizontal" ? isRtl ? "ArrowLeft" : "ArrowRight" : "ArrowDown";
			const previousKey = props.orientation === "horizontal" ? isRtl ? "ArrowRight" : "ArrowLeft" : "ArrowUp";
			let targetIndex = -1;
			if (event.key === nextKey) targetIndex = findEnabledIndex(items, currentIndex === -1 ? 0 : currentIndex + 1, 1, true);
			else if (event.key === previousKey) targetIndex = findEnabledIndex(items, currentIndex === -1 ? items.length - 1 : currentIndex - 1, -1, true);
			else if (event.key === "Home") targetIndex = findEnabledIndex(items, 0, 1, false);
			else if (event.key === "End") targetIndex = findEnabledIndex(items, items.length - 1, -1, false);
			else return;
			if (targetIndex !== -1) focusItem(items, targetIndex);
			event.preventDefault();
		}
		onMounted(() => {
			element.value?.addEventListener("keydown", handleKeydown);
		});
		onBeforeUnmount(() => {
			element.value?.removeEventListener("keydown", handleKeydown);
		});
		__expose({ element });
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", mergeProps({ ref: "root" }, getForwardedAttrs(), {
				"aria-disabled": isDisabled.value || void 0,
				"aria-label": __props.label,
				class: rootClass.value,
				"data-elevation": __props.elevation,
				"data-orientation": orientation.value,
				"data-size": size.value,
				role: "group",
				style: rootStyle.value
			}), [renderSlot(_ctx.$slots, "default")], 16, _hoisted_1);
		};
	}
});
//#endregion
//#region components/demos/button-group/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main), mergeProps({ label: "Editing actions" }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1), { label: "Copy" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { label: "Cut" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { label: "Paste" }, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1), { label: "Copy" }),
						createVNode(unref(_sfc_main$1), { label: "Cut" }),
						createVNode(unref(_sfc_main$1), { label: "Paste" })
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/button-group/basic.vue
var _sfc_setup$1 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/button-group/basic.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/button-group/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { ButtonGroup } from '@astryx-vue/core/ButtonGroup'\n<\/script>\n\n<template>\n  <ButtonGroup label=\"Editing actions\">\n    <Button label=\"Copy\" />\n    <Button label=\"Cut\" />\n    <Button label=\"Paste\" />\n  </ButtonGroup>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ButtonGroup } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/ButtonGroup'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ButtonGroup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Editing actions\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Copy\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Cut\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Paste\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ButtonGroup</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/button-group/floating.vue?vue&type=script&setup=true&lang.ts
var floating_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "floating",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main), mergeProps({
				elevation: "med",
				label: "Zoom actions"
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1), { label: "Zoom out" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { label: "Reset" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { label: "Zoom in" }, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1), { label: "Zoom out" }),
						createVNode(unref(_sfc_main$1), { label: "Reset" }),
						createVNode(unref(_sfc_main$1), { label: "Zoom in" })
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/button-group/floating.vue
var _sfc_setup = floating_vue_vue_type_script_setup_true_lang_default.setup;
floating_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/button-group/floating.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var floating_default$1 = floating_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/button-group/floating.vue?raw&highlighted
var floating_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { ButtonGroup } from '@astryx-vue/core/ButtonGroup'\n<\/script>\n\n<template>\n  <ButtonGroup elevation=\"med\" label=\"Zoom actions\">\n    <Button label=\"Zoom out\" />\n    <Button label=\"Reset\" />\n    <Button label=\"Zoom in\" />\n  </ButtonGroup>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ButtonGroup } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/ButtonGroup'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ButtonGroup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> elevation</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"med\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Zoom actions\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Zoom out\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Reset\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Zoom in\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ButtonGroup</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/button-group/index.ts
var buttonGroupPreviewClass = "button-group-preview-host button-group-preview";
var buttonGroupBasic = defineDemo(basic_default$1, basic_default, { className: buttonGroupPreviewClass });
var buttonGroupFloating = defineDemo(floating_default$1, floating_default, { className: buttonGroupPreviewClass });
//#endregion
export { buttonGroupFloating as n, buttonGroupBasic as t };
