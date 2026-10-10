import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$1 } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { n as getFocusables, t as focusElement } from "./focus-CpficIgf.CTu7RTTj.js";
import { t as _sfc_main$2 } from "./Stack-iv52y_Jv.C5zk9p8n.js";
import { t as usePositionedLayer } from "./usePositionedLayer-C1NBOsVT.CqLwBJaO.js";
import { t as _sfc_main$3 } from "./TextInput-NNcCzhwB.TrtQCAjS.js";
import { Fragment, Teleport, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, mergeProps, nextTick, normalizeStyle, onBeforeUnmount, onMounted, onUpdated, openBlock, ref, renderSlot, shallowRef, unref, useId, useSSRContext, vShow, watch, withCtx, withDirectives } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region ../../packages/core/dist/Popover-PVdL8wjx.js
var _hoisted_1 = [
	"role",
	"aria-modal",
	"aria-label",
	"tabindex",
	"data-placement"
];
var _hoisted_2 = { class: "astryx-popover__body" };
var _hoisted_3 = {
	key: 0,
	class: "astryx-popover__close"
};
var GAP = 4;
var DEFAULT_MAX_WIDTH = 320;
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxPopover",
	__name: "Popover",
	props: {
		placement: { default: "below" },
		alignment: { default: "start" },
		isOpen: {
			type: Boolean,
			default: void 0
		},
		isEnabled: {
			type: Boolean,
			default: true
		},
		width: { default: void 0 },
		padding: { default: 3 },
		label: { default: void 0 },
		role: { default: "dialog" },
		isModal: {
			type: Boolean,
			default: true
		},
		hasCloseButton: {
			type: Boolean,
			default: true
		},
		closeButtonLabel: { default: "Close" },
		hasAutoFocus: {
			type: Boolean,
			default: true
		},
		hasLightDismiss: {
			type: Boolean,
			default: true
		},
		hasEscapeDismiss: {
			type: Boolean,
			default: true
		}
	},
	emits: ["openChange"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const popoverId = `astryx-popover-${useId()}`;
		const anchorRef = ref(null);
		const surfaceRef = ref(null);
		const isOpenState = ref(false);
		const anchorWidth = ref(0);
		const { position, detach: detachPosition } = usePositionedLayer({
			anchor: anchorRef,
			layer: surfaceRef,
			isOpen: isOpenState,
			placement: computed(() => props.placement),
			alignment: computed(() => props.alignment),
			gap: GAP
		});
		const surfaceRole = computed(() => props.role === "dialog" ? "dialog" : void 0);
		const surfaceAriaModal = computed(() => props.role === "dialog" && props.isModal ? "true" : void 0);
		const surfaceAriaLabel = computed(() => props.role === "dialog" ? props.label : void 0);
		const surfaceTabIndex = computed(() => props.role === "dialog" ? -1 : void 0);
		const surfaceStyle = computed(() => {
			const style = {
				"--_popover-padding": `var(--astryx-spacing-${String(props.padding).replace(".", "-")})`,
				"top": `${position.value.top}px`,
				"left": `${position.value.left}px`
			};
			if (props.width != null) style.width = typeof props.width === "number" ? `${props.width}px` : props.width;
			else {
				style.minWidth = `min(${anchorWidth.value}px, ${DEFAULT_MAX_WIDTH}px)`;
				style.maxWidth = `min(${DEFAULT_MAX_WIDTH}px, calc(100vw - 16px))`;
			}
			return style;
		});
		let boundButton = null;
		function setOpen(next) {
			if (isOpenState.value === next) return;
			isOpenState.value = next;
			emit("openChange", next);
		}
		function findTriggerButton(element) {
			if (!element) return null;
			if (element.matches("button, [role=\"button\"]")) return element;
			return element.querySelector("button, [role=\"button\"]");
		}
		function syncTriggerAttributes() {
			if (!boundButton) return;
			boundButton.setAttribute("aria-haspopup", props.role === "dialog" ? "dialog" : "true");
			boundButton.setAttribute("aria-expanded", String(isOpenState.value));
			boundButton.setAttribute("aria-controls", popoverId);
		}
		function onTriggerClick() {
			if (!props.isEnabled) return;
			setOpen(!isOpenState.value);
		}
		function onTriggerKeydown(event) {
			if (event.key !== "Enter" && event.key !== " ") return;
			event.preventDefault();
			onTriggerClick();
		}
		function bindButton() {
			const next = findTriggerButton(anchorRef.value);
			if (next === boundButton) return;
			unbindButton();
			boundButton = next;
			if (!next) return;
			next.addEventListener("click", onTriggerClick);
			if (next.tagName !== "BUTTON" && next.getAttribute("role") === "button") next.addEventListener("keydown", onTriggerKeydown);
			syncTriggerAttributes();
		}
		function unbindButton() {
			if (!boundButton) return;
			boundButton.removeEventListener("click", onTriggerClick);
			boundButton.removeEventListener("keydown", onTriggerKeydown);
			boundButton.removeAttribute("aria-haspopup");
			boundButton.removeAttribute("aria-expanded");
			boundButton.removeAttribute("aria-controls");
			boundButton = null;
		}
		function focusInitialTarget() {
			const surface = surfaceRef.value;
			if (!surface) return;
			const first = getFocusables(surface).find((element) => !element.closest(".astryx-popover__close"));
			if (first && focusElement(first)) return;
			if (props.role === "dialog") focusElement(surface);
		}
		function onDocumentPointerDown(event) {
			if (!props.hasLightDismiss || !isOpenState.value) return;
			const target = event.target;
			if (surfaceRef.value?.contains(target) || anchorRef.value?.contains(target)) return;
			setOpen(false);
		}
		function trapTab(event) {
			const surface = surfaceRef.value;
			if (!surface) return;
			const items = getFocusables(surface);
			if (items.length === 0) {
				event.preventDefault();
				focusElement(surface);
				return;
			}
			const first = items[0];
			const last = items[items.length - 1];
			const active = document.activeElement;
			if (!surface.contains(active)) {
				event.preventDefault();
				focusElement(event.shiftKey ? last : first);
				return;
			}
			if (event.shiftKey && (active === first || active === surface)) {
				event.preventDefault();
				focusElement(last);
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				focusElement(first);
			}
		}
		function onDocumentKeydown(event) {
			if (!isOpenState.value) return;
			if (event.key === "Escape" && props.hasEscapeDismiss) {
				setOpen(false);
				return;
			}
			if (event.key === "Tab" && props.isModal && props.role === "dialog") trapTab(event);
		}
		watch(isOpenState, (open) => {
			syncTriggerAttributes();
			if (open) {
				anchorWidth.value = anchorRef.value?.getBoundingClientRect().width ?? 0;
				document.addEventListener("pointerdown", onDocumentPointerDown, true);
				document.addEventListener("keydown", onDocumentKeydown);
				if (props.hasAutoFocus && props.role === "dialog") nextTick(focusInitialTarget);
				return;
			}
			document.removeEventListener("pointerdown", onDocumentPointerDown, true);
			document.removeEventListener("keydown", onDocumentKeydown);
			if ((surfaceRef.value?.contains(document.activeElement) ?? false) && boundButton) nextTick(() => focusElement(boundButton));
		});
		watch(() => props.isOpen, (open) => {
			if (open === void 0 || open === isOpenState.value) return;
			isOpenState.value = open;
		});
		watch(() => props.isEnabled, (enabled) => {
			if (!enabled && isOpenState.value) setOpen(false);
		});
		onMounted(() => {
			bindButton();
			if (props.isOpen !== void 0) isOpenState.value = props.isOpen;
		});
		onUpdated(bindButton);
		onBeforeUnmount(() => {
			unbindButton();
			detachPosition();
			document.removeEventListener("pointerdown", onDocumentPointerDown, true);
			document.removeEventListener("keydown", onDocumentKeydown);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("span", {
				ref_key: "anchorRef",
				ref: anchorRef,
				class: "astryx-popover-trigger"
			}, [renderSlot(_ctx.$slots, "default")], 512), (openBlock(), createBlock(Teleport, { to: "body" }, [withDirectives(createElementVNode("div", {
				id: popoverId,
				ref_key: "surfaceRef",
				ref: surfaceRef,
				class: "astryx-popover",
				role: surfaceRole.value,
				"aria-modal": surfaceAriaModal.value,
				"aria-label": surfaceAriaLabel.value,
				tabindex: surfaceTabIndex.value,
				"data-placement": unref(position).placement,
				style: normalizeStyle(surfaceStyle.value)
			}, [createElementVNode("div", _hoisted_2, [renderSlot(_ctx.$slots, "content")]), __props.hasCloseButton ? (openBlock(), createElementBlock("div", _hoisted_3, [createVNode(unref(_sfc_main$1), {
				variant: "secondary",
				label: __props.closeButtonLabel,
				onClick: _cache[0] || (_cache[0] = ($event) => setOpen(false))
			}, null, 8, ["label"])])) : createCommentVNode("v-if", true)], 12, _hoisted_1), [[vShow, isOpenState.value]])]))], 64);
		};
	}
});
//#endregion
//#region components/demos/popover/actions.vue?vue&type=script&setup=true&lang.ts
var actions_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "actions",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				role: "none",
				"has-close-button": false,
				padding: 1,
				placement: "below",
				alignment: "end"
			}, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1), {
							label: "Duplicate",
							variant: "ghost"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), {
							label: "Rename",
							variant: "ghost"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), {
							label: "Delete",
							variant: "destructive"
						}, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1), {
							label: "Duplicate",
							variant: "ghost"
						}),
						createVNode(unref(_sfc_main$1), {
							label: "Rename",
							variant: "ghost"
						}),
						createVNode(unref(_sfc_main$1), {
							label: "Delete",
							variant: "destructive"
						})
					];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), {
						label: "More actions",
						variant: "ghost"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), {
						label: "More actions",
						variant: "ghost"
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/popover/actions.vue
var _sfc_setup$4 = actions_vue_vue_type_script_setup_true_lang_default.setup;
actions_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/popover/actions.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var actions_default$1 = actions_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/popover/actions.vue?raw&highlighted
var actions_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Popover } from '@astryx-vue/core/Popover'\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <Popover role=\"none\" :has-close-button=\"false\" :padding=\"1\" placement=\"below\" alignment=\"end\">\n      <Button label=\"More actions\" variant=\"ghost\" />\n      <template #content>\n        <Button label=\"Duplicate\" variant=\"ghost\" />\n        <Button label=\"Rename\" variant=\"ghost\" />\n        <Button label=\"Delete\" variant=\"destructive\" />\n      </template>\n    </Popover>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Popover } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Popover'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> role</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"none\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">has-close-button</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">1</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> placement</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"below\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> alignment</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"end\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"More actions\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ghost\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Duplicate\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ghost\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Rename\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ghost\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Delete\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"destructive\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/popover/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), { label: "Project details" }, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), { gap: 3 }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<p${_scopeId}>Popovers hold short, interactive content next to the control that opened them.</p>`);
								_push(ssrRenderComponent(unref(_sfc_main$1), {
									label: "Got it",
									variant: "primary"
								}, null, _parent, _scopeId));
							} else return [createVNode("p", null, "Popovers hold short, interactive content next to the control that opened them."), createVNode(unref(_sfc_main$1), {
								label: "Got it",
								variant: "primary"
							})];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$2), { gap: 3 }, {
						default: withCtx(() => [createVNode("p", null, "Popovers hold short, interactive content next to the control that opened them."), createVNode(unref(_sfc_main$1), {
							label: "Got it",
							variant: "primary"
						})]),
						_: 1
					})];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), {
						label: "Details",
						variant: "secondary"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), {
						label: "Details",
						variant: "secondary"
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/popover/basic.vue
var _sfc_setup$3 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/popover/basic.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/popover/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Popover } from '@astryx-vue/core/Popover'\nimport { VStack } from '@astryx-vue/core/Stack'\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <Popover label=\"Project details\">\n      <Button label=\"Details\" variant=\"secondary\" />\n      <template #content>\n        <VStack :gap=\"3\">\n          <p>Popovers hold short, interactive content next to the control that opened them.</p>\n          <Button label=\"Got it\" variant=\"primary\" />\n        </VStack>\n      </template>\n    </Popover>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Popover } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Popover'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Project details\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Details\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Popovers hold short, interactive content next to the control that opened them.&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Got it\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"primary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/popover/form.vue?vue&type=script&setup=true&lang.ts
var form_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "form",
	__ssrInlineRender: true,
	setup(__props) {
		const name = shallowRef("");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				label: "Rename project",
				width: 280,
				padding: 4
			}, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), { gap: 3 }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(ssrRenderComponent(unref(_sfc_main$3), {
									modelValue: name.value,
									"onUpdate:modelValue": ($event) => name.value = $event,
									label: "Project name",
									placeholder: "Untitled project"
								}, null, _parent, _scopeId));
								_push(ssrRenderComponent(unref(_sfc_main$1), {
									label: "Save",
									variant: "primary"
								}, null, _parent, _scopeId));
							} else return [createVNode(unref(_sfc_main$3), {
								modelValue: name.value,
								"onUpdate:modelValue": ($event) => name.value = $event,
								label: "Project name",
								placeholder: "Untitled project"
							}, null, 8, ["modelValue", "onUpdate:modelValue"]), createVNode(unref(_sfc_main$1), {
								label: "Save",
								variant: "primary"
							})];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$2), { gap: 3 }, {
						default: withCtx(() => [createVNode(unref(_sfc_main$3), {
							modelValue: name.value,
							"onUpdate:modelValue": ($event) => name.value = $event,
							label: "Project name",
							placeholder: "Untitled project"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]), createVNode(unref(_sfc_main$1), {
							label: "Save",
							variant: "primary"
						})]),
						_: 1
					})];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), {
						label: "Rename",
						variant: "secondary"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), {
						label: "Rename",
						variant: "secondary"
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/popover/form.vue
var _sfc_setup$2 = form_vue_vue_type_script_setup_true_lang_default.setup;
form_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/popover/form.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var form_default$1 = form_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/popover/form.vue?raw&highlighted
var form_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Popover } from '@astryx-vue/core/Popover'\nimport { VStack } from '@astryx-vue/core/Stack'\nimport { TextInput } from '@astryx-vue/core/TextInput'\nimport { shallowRef } from 'vue'\n\nconst name = shallowRef('')\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <Popover label=\"Rename project\" :width=\"280\" :padding=\"4\">\n      <Button label=\"Rename\" variant=\"secondary\" />\n      <template #content>\n        <VStack :gap=\"3\">\n          <TextInput v-model=\"name\" label=\"Project name\" placeholder=\"Untitled project\" />\n          <Button label=\"Save\" variant=\"primary\" />\n        </VStack>\n      </template>\n    </Popover>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Popover } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Popover'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { TextInput } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/TextInput'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> name</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">''</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Rename project\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">width</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">280</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">4</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Rename\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TextInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">name</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Project name\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> placeholder</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Untitled project\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Save\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"primary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/popover/overview.vue?vue&type=script&setup=true&lang.ts
var overview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "overview",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$2), {
				gap: 2,
				align: "center"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="astryx-popover" style="${ssrRenderStyle({
							"position": "relative",
							"top": "auto",
							"left": "auto",
							"width": "240px"
						})}"${_scopeId}><div class="astryx-popover__body"${_scopeId}>`);
						_push(ssrRenderComponent(unref(_sfc_main$2), { gap: 3 }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<span${_scopeId}>Short, interactive content.</span>`);
									_push(ssrRenderComponent(unref(_sfc_main$1), {
										label: "Got it",
										variant: "primary"
									}, null, _parent, _scopeId));
								} else return [createVNode("span", null, "Short, interactive content."), createVNode(unref(_sfc_main$1), {
									label: "Got it",
									variant: "primary"
								})];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div>`);
						_push(ssrRenderComponent(unref(_sfc_main), { label: "Project details" }, {
							content: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span${_scopeId}>Short, interactive content.</span>`);
								else return [createVNode("span", null, "Short, interactive content.")];
							}),
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), {
									label: "Details",
									variant: "secondary"
								}, null, _parent, _scopeId));
								else return [createVNode(unref(_sfc_main$1), {
									label: "Details",
									variant: "secondary"
								})];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode("div", {
						class: "astryx-popover",
						style: {
							"position": "relative",
							"top": "auto",
							"left": "auto",
							"width": "240px"
						}
					}, [createVNode("div", { class: "astryx-popover__body" }, [createVNode(unref(_sfc_main$2), { gap: 3 }, {
						default: withCtx(() => [createVNode("span", null, "Short, interactive content."), createVNode(unref(_sfc_main$1), {
							label: "Got it",
							variant: "primary"
						})]),
						_: 1
					})])]), createVNode(unref(_sfc_main), { label: "Project details" }, {
						content: withCtx(() => [createVNode("span", null, "Short, interactive content.")]),
						default: withCtx(() => [createVNode(unref(_sfc_main$1), {
							label: "Details",
							variant: "secondary"
						})]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/popover/overview.vue
var _sfc_setup$1 = overview_vue_vue_type_script_setup_true_lang_default.setup;
overview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/popover/overview.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var overview_default$1 = overview_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/popover/overview.vue?raw&highlighted
var overview_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Popover } from '@astryx-vue/core/Popover'\nimport { VStack } from '@astryx-vue/core/Stack'\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <VStack :gap=\"2\" align=\"center\">\n      <div class=\"astryx-popover\" style=\"position: relative; top: auto; left: auto; width: 240px\">\n        <div class=\"astryx-popover__body\">\n          <VStack :gap=\"3\">\n            <span>Short, interactive content.</span>\n            <Button label=\"Got it\" variant=\"primary\" />\n          </VStack>\n        </div>\n      </div>\n      <Popover label=\"Project details\">\n        <Button label=\"Details\" variant=\"secondary\" />\n        <template #content>\n          <span>Short, interactive content.</span>\n        </template>\n      </Popover>\n    </VStack>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Popover } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Popover'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"astryx-popover\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> style</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"position: relative; top: auto; left: auto; width: 240px\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"astryx-popover__body\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Short, interactive content.&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Got it\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"primary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Project details\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Details\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Short, interactive content.&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/popover/placements.vue?vue&type=script&setup=true&lang.ts
var placements_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "placements",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				label: "Below",
				placement: "below"
			}, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p${_scopeId}>Opens below the trigger.</p>`);
					else return [createVNode("p", null, "Opens below the trigger.")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), {
						label: "Below",
						variant: "secondary"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), {
						label: "Below",
						variant: "secondary"
					})];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				label: "Above",
				placement: "above",
				alignment: "end"
			}, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p${_scopeId}>Opens above the trigger, aligned to its end.</p>`);
					else return [createVNode("p", null, "Opens above the trigger, aligned to its end.")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), {
						label: "Above",
						variant: "secondary"
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), {
						label: "Above",
						variant: "secondary"
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/popover/placements.vue
var _sfc_setup = placements_vue_vue_type_script_setup_true_lang_default.setup;
placements_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/popover/placements.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var placements_default$1 = placements_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/popover/placements.vue?raw&highlighted
var placements_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Popover } from '@astryx-vue/core/Popover'\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <Popover label=\"Below\" placement=\"below\">\n      <Button label=\"Below\" variant=\"secondary\" />\n      <template #content>\n        <p>Opens below the trigger.</p>\n      </template>\n    </Popover>\n    <Popover label=\"Above\" placement=\"above\" alignment=\"end\">\n      <Button label=\"Above\" variant=\"secondary\" />\n      <template #content>\n        <p>Opens above the trigger, aligned to its end.</p>\n      </template>\n    </Popover>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Popover } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Popover'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Below\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> placement</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"below\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Below\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Opens below the trigger.&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Above\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> placement</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"above\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> alignment</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"end\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Above\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Opens above the trigger, aligned to its end.&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Popover</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/popover/index.ts
var options = { className: "input-preview-host" };
var popoverBasic = defineDemo(basic_default$1, basic_default, options);
var popoverPlacements = defineDemo(placements_default$1, placements_default, options);
var popoverForm = defineDemo(form_default$1, form_default, options);
var popoverActions = defineDemo(actions_default$1, actions_default, options);
var popoverOverview = defineDemo(overview_default$1, overview_default, options);
//#endregion
export { popoverPlacements as a, popoverOverview as i, popoverBasic as n, popoverForm as r, popoverActions as t };
