import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$2 } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { t as _sfc_main$3 } from "./Stack-iv52y_Jv.C5zk9p8n.js";
import { t as _sfc_main$4 } from "./Link-CprjOuTI.Dzy3pVDJ.js";
import { computed, createBlock, createCommentVNode, createElementBlock, createTextVNode, createVNode, defineComponent, getCurrentScope, mergeModels, mergeProps, nextTick, normalizeProps, onMounted, onScopeDispose, openBlock, ref, renderSlot, toValue, unref, useModel, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/Overlay-DKILTHxI.js
var _hoisted_1 = [
	"data-position",
	"data-align",
	"data-scrim",
	"data-visibility",
	"inert"
];
var _hoisted_2 = ["data-astryx-media"];
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "AstryxOverlayScrim",
	__name: "OverlayScrim",
	props: {
		scrim: {
			type: [String, Boolean],
			default: "dark"
		},
		position: { default: "fill" },
		align: { default: "end" },
		showOn: { default: "always" },
		isOpen: {
			type: Boolean,
			default: void 0
		}
	},
	setup(__props) {
		const props = __props;
		const isControlled = computed(() => props.isOpen !== void 0);
		const isInert = computed(() => isControlled.value && props.isOpen !== true);
		const mediaMode = computed(() => {
			if (props.scrim === "dark") return "dark";
			return props.scrim === "light" ? "light" : void 0;
		});
		const scrimMode = computed(() => props.scrim === false ? "none" : props.scrim);
		const visibility = computed(() => {
			if (isControlled.value) return props.isOpen ? "visible" : "hidden";
			if (props.showOn === "always") return "visible";
			return props.showOn === "focus" ? "focus" : "hover";
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "astryx-overlay-scrim",
				"data-position": __props.position,
				"data-align": __props.align,
				"data-scrim": scrimMode.value,
				"data-visibility": visibility.value,
				inert: isInert.value ? true : void 0
			}, [mediaMode.value ? (openBlock(), createElementBlock("div", {
				key: 0,
				class: "astryx-overlay-scrim__media",
				"data-astryx-media": mediaMode.value
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_2)) : renderSlot(_ctx.$slots, "default", {}, void 0, void 0, 1)], 8, _hoisted_1);
		};
	}
});
var INTERACTIVE_SELECTOR = [
	"button",
	"a",
	"input",
	"select",
	"textarea",
	"[role=\"button\"]",
	"[role=\"link\"]",
	"[role=\"checkbox\"]",
	"[role=\"radio\"]",
	"[role=\"switch\"]",
	"[role=\"tab\"]",
	"[role=\"menuitem\"]",
	"[role=\"option\"]",
	"[role=\"combobox\"]",
	"[role=\"listbox\"]",
	"[role=\"slider\"]",
	"[role=\"spinbutton\"]",
	"[data-pressable-container]"
].join(",");
/**
* 点击落在容器里的交互元素上时，这一次点击属于那个元素，不属于容器。
*/
function hasInteractiveAncestor(target, root) {
	let current = target;
	while (current != null && current !== root && current !== document.body) {
		if (current.matches(INTERACTIVE_SELECTOR) && current.getAttribute("aria-readonly") !== "true") return true;
		current = current.parentElement;
	}
	return false;
}
/** 结束一段文字选择的点击不是一次点按，不应触发切换。 */
function hasTextSelection(node) {
	if (typeof document === "undefined" || typeof document.getSelection !== "function") return false;
	const selection = document.getSelection();
	if (selection == null || selection.isCollapsed) return false;
	return node.contains(selection.anchorNode);
}
function useHoverNone() {
	const isTouchDevice = ref(false);
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") return isTouchDevice;
	const query = window.matchMedia("(hover: none)");
	isTouchDevice.value = query.matches;
	const onChange = () => {
		isTouchDevice.value = query.matches;
	};
	query.addEventListener("change", onChange);
	if (getCurrentScope()) onScopeDispose(() => query.removeEventListener("change", onChange));
	return isTouchDevice;
}
/**
* 给任意容器加上浮层遮罩的行为：返回要挂在容器上的属性，
* 以及要渲染在容器内部的遮罩属性。
*/
function useOverlay(options = {}) {
	const containerRef = ref(null);
	const isTouchDevice = useHoverNone();
	const isToggledOpen = ref(false);
	const isHoverMode = computed(() => {
		const showOn = toValue(options.showOn);
		return showOn === "hover" || showOn === "hover-or-focus";
	});
	const hasTouchToggle = computed(() => isTouchDevice.value && isHoverMode.value);
	const isOpen = computed(() => {
		const controlled = toValue(options.isOpen);
		if (controlled !== void 0) return controlled;
		return hasTouchToggle.value ? isToggledOpen.value : void 0;
	});
	function toggle() {
		isToggledOpen.value = !isToggledOpen.value;
	}
	function onClick(event) {
		if (!hasTouchToggle.value) return;
		const container = containerRef.value;
		const target = event.target;
		if (!container || !(target instanceof Element)) return;
		if (hasTextSelection(container)) return;
		if (target !== event.currentTarget && hasInteractiveAncestor(target, container)) return;
		toggle();
	}
	return {
		containerRef,
		containerProps: computed(() => ({
			"class": "astryx-overlay-scope",
			"data-pressable-container": "true",
			"onClick": hasTouchToggle.value ? onClick : void 0
		})),
		scrimProps: computed(() => ({
			scrim: toValue(options.scrim),
			position: toValue(options.position),
			align: toValue(options.align),
			showOn: toValue(options.showOn),
			isOpen: isOpen.value
		})),
		isOpen,
		hasTouchToggle,
		toggle
	};
}
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxOverlay",
	__name: "Overlay",
	props: /*@__PURE__*/ mergeModels({
		showOn: { default: "always" },
		scrim: {
			type: [String, Boolean],
			default: "dark"
		},
		position: { default: "fill" },
		align: { default: "end" }
	}, {
		"isOpen": {
			type: Boolean,
			default: void 0
		},
		"isOpenModifiers": {}
	}),
	emits: ["update:isOpen"],
	setup(__props, { expose: __expose }) {
		const props = __props;
		const isOpen = useModel(__props, "isOpen");
		const { containerRef, containerProps, scrimProps } = useOverlay({
			showOn: computed(() => props.showOn),
			isOpen,
			scrim: computed(() => props.scrim),
			position: computed(() => props.position),
			align: computed(() => props.align)
		});
		__expose({ element: computed(() => containerRef.value) });
		/**
		* 基础内容的圆角由它自己决定，外层容器照着它裁剪，遮罩才不会盖住圆角。
		*/
		function syncRadius() {
			const root = containerRef.value;
			const firstChild = root?.firstElementChild;
			if (!root || !firstChild) return;
			const radius = getComputedStyle(firstChild).borderRadius;
			if (radius && radius !== "0px") root.style.borderRadius = radius;
		}
		onMounted(() => {
			nextTick(syncRadius);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", mergeProps({
				ref_key: "containerRef",
				ref: containerRef
			}, unref(containerProps), { class: "astryx-overlay" }), [renderSlot(_ctx.$slots, "default"), _ctx.$slots.content ? (openBlock(), createBlock(_sfc_main$1, normalizeProps(mergeProps({ key: 0 }, unref(scrimProps))), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "content")]),
				_: 3
			}, 16)) : createCommentVNode("v-if", true)], 16);
		};
	}
});
//#endregion
//#region components/demos/overlay/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main), mergeProps({ class: "overlay-preview__frame" }, _attrs), {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), {
						label: "Quick view",
						size: "sm",
						variant: "secondary"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$2), {
						label: "Quick view",
						size: "sm",
						variant: "secondary"
					})];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<div class="overlay-preview__media"${_scopeId}><span class="overlay-preview__media-label"${_scopeId}>Fjord at dusk</span></div>`);
					else return [createVNode("div", { class: "overlay-preview__media" }, [createVNode("span", { class: "overlay-preview__media-label" }, "Fjord at dusk")])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/overlay/basic.vue
var _sfc_setup$3 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/overlay/basic.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/overlay/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Overlay } from '@astryx-vue/core/Overlay'\n<\/script>\n\n<template>\n  <Overlay class=\"overlay-preview__frame\">\n    <div class=\"overlay-preview__media\">\n      <span class=\"overlay-preview__media-label\">Fjord at dusk</span>\n    </div>\n    <template #content>\n      <Button label=\"Quick view\" size=\"sm\" variant=\"secondary\" />\n    </template>\n  </Overlay>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Overlay } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Overlay'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__frame\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media-label\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Fjord at dusk&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Quick view\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/overlay/hover.vue?vue&type=script&setup=true&lang.ts
var hover_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "hover",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main$3), mergeProps({
				class: "overlay-preview__stack",
				gap: 3
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main), {
							class: "overlay-preview__frame",
							"show-on": "hover"
						}, {
							content: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), {
									label: "Watch reel",
									size: "sm",
									variant: "secondary"
								}, null, _parent, _scopeId));
								else return [createVNode(unref(_sfc_main$2), {
									label: "Watch reel",
									size: "sm",
									variant: "secondary"
								})];
							}),
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="overlay-preview__media"${_scopeId}>`);
									_push(ssrRenderComponent(unref(_sfc_main$4), {
										class: "overlay-preview__media-label",
										color: "inherit",
										"has-underline": "",
										href: "#season-highlights"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Season highlights `);
											else return [createTextVNode(" Season highlights ")];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(`</div>`);
								} else return [createVNode("div", { class: "overlay-preview__media" }, [createVNode(unref(_sfc_main$4), {
									class: "overlay-preview__media-label",
									color: "inherit",
									"has-underline": "",
									href: "#season-highlights"
								}, {
									default: withCtx(() => [createTextVNode(" Season highlights ")]),
									_: 1
								})])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<p class="overlay-preview__hint"${_scopeId}> Hover the tile, or focus the link inside it, to reveal the overlay. </p>`);
					} else return [createVNode(unref(_sfc_main), {
						class: "overlay-preview__frame",
						"show-on": "hover"
					}, {
						content: withCtx(() => [createVNode(unref(_sfc_main$2), {
							label: "Watch reel",
							size: "sm",
							variant: "secondary"
						})]),
						default: withCtx(() => [createVNode("div", { class: "overlay-preview__media" }, [createVNode(unref(_sfc_main$4), {
							class: "overlay-preview__media-label",
							color: "inherit",
							"has-underline": "",
							href: "#season-highlights"
						}, {
							default: withCtx(() => [createTextVNode(" Season highlights ")]),
							_: 1
						})])]),
						_: 1
					}), createVNode("p", { class: "overlay-preview__hint" }, " Hover the tile, or focus the link inside it, to reveal the overlay. ")];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/overlay/hover.vue
var _sfc_setup$2 = hover_vue_vue_type_script_setup_true_lang_default.setup;
hover_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/overlay/hover.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var hover_default$1 = hover_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/overlay/hover.vue?raw&highlighted
var hover_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Link } from '@astryx-vue/core/Link'\nimport { Overlay } from '@astryx-vue/core/Overlay'\nimport { VStack } from '@astryx-vue/core/Stack'\n<\/script>\n\n<template>\n  <VStack class=\"overlay-preview__stack\" :gap=\"3\">\n    <Overlay class=\"overlay-preview__frame\" show-on=\"hover\">\n      <div class=\"overlay-preview__media\">\n        <Link\n          class=\"overlay-preview__media-label\"\n          color=\"inherit\"\n          has-underline\n          href=\"#season-highlights\"\n        >\n          Season highlights\n        </Link>\n      </div>\n      <template #content>\n        <Button label=\"Watch reel\" size=\"sm\" variant=\"secondary\" />\n      </template>\n    </Overlay>\n    <p class=\"overlay-preview__hint\">\n      Hover the tile, or focus the link inside it, to reveal the overlay.\n    </p>\n  </VStack>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Link } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Link'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Overlay } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Overlay'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__frame\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> show-on</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"hover\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media-label\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"inherit\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          has-underline</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"#season-highlights\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Season highlights</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Watch reel\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__hint\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Hover the tile, or focus the link inside it, to reveal the overlay.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/overlay/positions.vue?vue&type=script&setup=true&lang.ts
var positions_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "positions",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "overlay-preview__grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				position: "fill",
				align: "center"
			}, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), {
						label: "Play",
						size: "sm",
						variant: "secondary"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$2), {
						label: "Play",
						size: "sm",
						variant: "secondary"
					})];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<div class="overlay-preview__media"${_scopeId}><span class="overlay-preview__media-label"${_scopeId}>Position fill</span></div>`);
					else return [createVNode("div", { class: "overlay-preview__media" }, [createVNode("span", { class: "overlay-preview__media-label" }, "Position fill")])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				position: "bottom",
				align: "start"
			}, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), {
						label: "Play",
						size: "sm",
						variant: "secondary"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$2), {
						label: "Play",
						size: "sm",
						variant: "secondary"
					})];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<div class="overlay-preview__media"${_scopeId}><span class="overlay-preview__media-label"${_scopeId}>Position bottom</span></div>`);
					else return [createVNode("div", { class: "overlay-preview__media" }, [createVNode("span", { class: "overlay-preview__media-label" }, "Position bottom")])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				position: "top",
				align: "end"
			}, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), {
						label: "Play",
						size: "sm",
						variant: "secondary"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$2), {
						label: "Play",
						size: "sm",
						variant: "secondary"
					})];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<div class="overlay-preview__media"${_scopeId}><span class="overlay-preview__media-label"${_scopeId}>Position top</span></div>`);
					else return [createVNode("div", { class: "overlay-preview__media" }, [createVNode("span", { class: "overlay-preview__media-label" }, "Position top")])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/overlay/positions.vue
var _sfc_setup$1 = positions_vue_vue_type_script_setup_true_lang_default.setup;
positions_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/overlay/positions.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var positions_default$1 = positions_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/overlay/positions.vue?raw&highlighted
var positions_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Overlay } from '@astryx-vue/core/Overlay'\n<\/script>\n\n<template>\n  <div class=\"overlay-preview__grid\">\n    <Overlay position=\"fill\" align=\"center\">\n      <div class=\"overlay-preview__media\">\n        <span class=\"overlay-preview__media-label\">Position fill</span>\n      </div>\n      <template #content>\n        <Button label=\"Play\" size=\"sm\" variant=\"secondary\" />\n      </template>\n    </Overlay>\n\n    <Overlay position=\"bottom\" align=\"start\">\n      <div class=\"overlay-preview__media\">\n        <span class=\"overlay-preview__media-label\">Position bottom</span>\n      </div>\n      <template #content>\n        <Button label=\"Play\" size=\"sm\" variant=\"secondary\" />\n      </template>\n    </Overlay>\n\n    <Overlay position=\"top\" align=\"end\">\n      <div class=\"overlay-preview__media\">\n        <span class=\"overlay-preview__media-label\">Position top</span>\n      </div>\n      <template #content>\n        <Button label=\"Play\" size=\"sm\" variant=\"secondary\" />\n      </template>\n    </Overlay>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Overlay } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Overlay'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> position</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"fill\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media-label\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Position fill&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Play\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> position</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"bottom\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media-label\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Position bottom&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Play\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> position</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"top\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"end\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media-label\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Position top&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Play\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/overlay/scrim.vue?vue&type=script&setup=true&lang.ts
var scrim_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "scrim",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "overlay-preview__grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), { scrim: "dark" }, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), {
						label: "View",
						size: "sm",
						variant: "secondary"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$2), {
						label: "View",
						size: "sm",
						variant: "secondary"
					})];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<div class="overlay-preview__media"${_scopeId}><span class="overlay-preview__media-label"${_scopeId}>Dark scrim</span></div>`);
					else return [createVNode("div", { class: "overlay-preview__media" }, [createVNode("span", { class: "overlay-preview__media-label" }, "Dark scrim")])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), { scrim: "light" }, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), {
						label: "View",
						size: "sm",
						variant: "secondary"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$2), {
						label: "View",
						size: "sm",
						variant: "secondary"
					})];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<div class="overlay-preview__media"${_scopeId}><span class="overlay-preview__media-label"${_scopeId}>Light scrim</span></div>`);
					else return [createVNode("div", { class: "overlay-preview__media" }, [createVNode("span", { class: "overlay-preview__media-label" }, "Light scrim")])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), { scrim: false }, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), {
						label: "View",
						size: "sm",
						variant: "primary"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$2), {
						label: "View",
						size: "sm",
						variant: "primary"
					})];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<div class="overlay-preview__media"${_scopeId}><span class="overlay-preview__media-label"${_scopeId}>No scrim</span></div>`);
					else return [createVNode("div", { class: "overlay-preview__media" }, [createVNode("span", { class: "overlay-preview__media-label" }, "No scrim")])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/overlay/scrim.vue
var _sfc_setup = scrim_vue_vue_type_script_setup_true_lang_default.setup;
scrim_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/overlay/scrim.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var scrim_default$1 = scrim_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/overlay/scrim.vue?raw&highlighted
var scrim_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Overlay } from '@astryx-vue/core/Overlay'\n<\/script>\n\n<template>\n  <div class=\"overlay-preview__grid\">\n    <Overlay scrim=\"dark\">\n      <div class=\"overlay-preview__media\">\n        <span class=\"overlay-preview__media-label\">Dark scrim</span>\n      </div>\n      <template #content>\n        <Button label=\"View\" size=\"sm\" variant=\"secondary\" />\n      </template>\n    </Overlay>\n\n    <Overlay scrim=\"light\">\n      <div class=\"overlay-preview__media\">\n        <span class=\"overlay-preview__media-label\">Light scrim</span>\n      </div>\n      <template #content>\n        <Button label=\"View\" size=\"sm\" variant=\"secondary\" />\n      </template>\n    </Overlay>\n\n    <Overlay :scrim=\"false\">\n      <div class=\"overlay-preview__media\">\n        <span class=\"overlay-preview__media-label\">No scrim</span>\n      </div>\n      <template #content>\n        <Button label=\"View\" size=\"sm\" variant=\"primary\" />\n      </template>\n    </Overlay>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Overlay } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Overlay'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> scrim</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"dark\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media-label\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Dark scrim&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"View\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> scrim</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"light\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media-label\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Light scrim&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"View\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">scrim</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overlay-preview__media-label\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>No scrim&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"View\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"primary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Overlay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/overlay/index.ts
var options = { className: "overlay-preview" };
var overlayBasic = defineDemo(basic_default$1, basic_default, options);
var overlayScrim = defineDemo(scrim_default$1, scrim_default, options);
var overlayPositions = defineDemo(positions_default$1, positions_default, options);
var overlayHover = defineDemo(hover_default$1, hover_default, options);
//#endregion
export { overlayScrim as i, overlayHover as n, overlayPositions as r, overlayBasic as t };
