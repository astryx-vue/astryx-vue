import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$1 } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { r as isFocusable } from "./focus-CpficIgf.CTu7RTTj.js";
import { t as _sfc_main$2 } from "./Stack-iv52y_Jv.C5zk9p8n.js";
import { t as usePositionedLayer } from "./usePositionedLayer-C1NBOsVT.CqLwBJaO.js";
import { Fragment, Teleport, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeProps, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, onUpdated, openBlock, ref, renderSlot, toDisplayString, unref, useId, useSSRContext, vShow, watch, withCtx, withDirectives } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region ../../packages/core/dist/Tooltip-mp0NMh_Y.js
var _hoisted_1 = ["data-placement"];
var HOVER_BRIDGE_DELAY = 100;
var GAP = 4;
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxTooltip",
	__name: "Tooltip",
	props: {
		content: { default: "" },
		placement: { default: "above" },
		alignment: { default: "center" },
		delay: { default: 200 },
		hideDelay: { default: 0 },
		focusTrigger: { default: "auto" },
		touchTrigger: { default: "auto" },
		isEnabled: {
			type: Boolean,
			default: true
		},
		hasHoverIndication: {
			type: [String, Boolean],
			default: "auto"
		},
		isOpen: {
			type: Boolean,
			default: void 0
		},
		isDefaultOpen: {
			type: Boolean,
			default: false
		}
	},
	emits: ["openChange"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const ACTION_TAGS = [
			"A",
			"BUTTON",
			"INPUT",
			"SELECT",
			"TEXTAREA"
		];
		const tooltipId = `astryx-tooltip-${useId()}`;
		const wrapperRef = ref(null);
		const bubbleRef = ref(null);
		const triggerRef = ref(null);
		const isVisible = ref(false);
		const isTextTrigger = ref(false);
		const isControlled = computed(() => props.isOpen !== void 0);
		const showIndication = computed(() => props.hasHoverIndication === true || props.hasHoverIndication === "auto" && isTextTrigger.value);
		const { position, detach: detachPosition } = usePositionedLayer({
			anchor: triggerRef,
			layer: bubbleRef,
			isOpen: isVisible,
			placement: computed(() => props.placement),
			alignment: computed(() => props.alignment),
			gap: GAP
		});
		const bubbleStyle = computed(() => ({
			top: `${position.value.top}px`,
			left: `${position.value.left}px`
		}));
		let trigger = null;
		let describedByBefore = null;
		let showTimer;
		let hideTimer;
		let isTouchPointer = false;
		function clearTimers() {
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
			showTimer = void 0;
			hideTimer = void 0;
		}
		function applyVisible(next) {
			if (isVisible.value === next) return false;
			isVisible.value = next;
			return true;
		}
		function setOpen(next) {
			if (applyVisible(next)) emit("openChange", next);
		}
		function showNow() {
			clearTimers();
			if (!props.isEnabled || isControlled.value) return;
			setOpen(true);
		}
		function hideNow() {
			clearTimers();
			if (isControlled.value) return;
			setOpen(false);
		}
		function scheduleShow() {
			if (!props.isEnabled || isControlled.value) return;
			clearTimers();
			showTimer = setTimeout(setOpen, props.delay, true);
		}
		function scheduleHide() {
			if (isControlled.value) return;
			clearTimers();
			const wait = props.hideDelay > 0 ? props.hideDelay : HOVER_BRIDGE_DELAY;
			hideTimer = setTimeout(setOpen, wait, false);
		}
		function cancelHide() {
			clearTimeout(hideTimer);
			hideTimer = void 0;
		}
		function matchesFocusVisible(element) {
			try {
				return element.matches(":focus-visible");
			} catch {
				return false;
			}
		}
		function onPointerEnter(event) {
			isTouchPointer = event.pointerType === "touch";
		}
		function onMouseEnter() {
			if (isTouchPointer) return;
			scheduleShow();
		}
		function onMouseLeave() {
			if (isTouchPointer) return;
			scheduleHide();
		}
		function onTouchTap() {
			if (!props.isEnabled || isControlled.value || props.touchTrigger === "none") return;
			if (props.touchTrigger === "auto" && trigger && ACTION_TAGS.includes(trigger.tagName)) return;
			if (isVisible.value) hideNow();
			else showNow();
		}
		function onPointerDown(event) {
			if (event.pointerType === "touch") {
				onTouchTap();
				return;
			}
			if (isControlled.value) return;
			hideNow();
		}
		function onFocusIn(event) {
			if (!props.isEnabled || isTouchPointer) return;
			const target = event.target;
			if (!matchesFocusVisible(target)) return;
			showNow();
		}
		function onFocusOut() {
			scheduleHide();
		}
		function onKeydown(event) {
			if (event.key !== "Escape") return;
			if (isControlled.value) {
				emit("openChange", false);
				return;
			}
			clearTimers();
			setOpen(false);
		}
		function shouldListenFocus(element) {
			return props.focusTrigger === "always" || props.focusTrigger === "auto" && isFocusable(element);
		}
		function resolveTrigger() {
			const wrapper = wrapperRef.value;
			if (!wrapper) return null;
			const child = wrapper.firstElementChild;
			isTextTrigger.value = child == null && (wrapper.textContent ?? "").trim() !== "";
			if (child) return child;
			if (isTextTrigger.value) {
				wrapper.tabIndex = 0;
				return wrapper;
			}
			return null;
		}
		function bindTrigger() {
			const next = resolveTrigger();
			if (next === trigger) return;
			unbindTrigger();
			trigger = next;
			triggerRef.value = next;
			if (!next) return;
			next.addEventListener("pointerenter", onPointerEnter);
			next.addEventListener("mouseenter", onMouseEnter);
			next.addEventListener("mouseleave", onMouseLeave);
			next.addEventListener("pointerdown", onPointerDown);
			if (shouldListenFocus(next)) {
				next.addEventListener("focusin", onFocusIn);
				next.addEventListener("focusout", onFocusOut);
			}
			describedByBefore = next.getAttribute("aria-describedby");
			next.setAttribute("aria-describedby", [describedByBefore, tooltipId].filter(Boolean).join(" "));
		}
		function unbindTrigger() {
			if (!trigger) return;
			trigger.removeEventListener("pointerenter", onPointerEnter);
			trigger.removeEventListener("mouseenter", onMouseEnter);
			trigger.removeEventListener("mouseleave", onMouseLeave);
			trigger.removeEventListener("pointerdown", onPointerDown);
			trigger.removeEventListener("focusin", onFocusIn);
			trigger.removeEventListener("focusout", onFocusOut);
			if (describedByBefore) trigger.setAttribute("aria-describedby", describedByBefore);
			else trigger.removeAttribute("aria-describedby");
			trigger = null;
			triggerRef.value = null;
			describedByBefore = null;
		}
		watch(isVisible, (visible) => {
			if (visible) document.addEventListener("keydown", onKeydown);
			else document.removeEventListener("keydown", onKeydown);
		});
		watch(() => props.isOpen, (open) => {
			clearTimers();
			if (open === void 0) return;
			applyVisible(open);
		});
		watch(() => props.isEnabled, (enabled) => {
			if (!enabled) hideNow();
		});
		onMounted(() => {
			bindTrigger();
			if (props.isOpen !== void 0) applyVisible(props.isOpen);
			else if (props.isDefaultOpen) setOpen(true);
		});
		onUpdated(bindTrigger);
		onBeforeUnmount(() => {
			clearTimers();
			unbindTrigger();
			detachPosition();
			document.removeEventListener("keydown", onKeydown);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("span", {
				ref_key: "wrapperRef",
				ref: wrapperRef,
				class: normalizeClass(["astryx-tooltip-trigger", {
					"astryx-tooltip-trigger--text": isTextTrigger.value,
					"astryx-tooltip-trigger--indicated": showIndication.value
				}])
			}, [renderSlot(_ctx.$slots, "default")], 2), (openBlock(), createBlock(Teleport, { to: "body" }, [createCommentVNode(" eslint-disable-next-line vue-a11y/mouse-events-have-key-events, vue-a11y/no-static-element-interactions -- 气泡上的鼠标事件仅用于指针移入气泡时保持显示；键盘焦点由触发元素的 focusin / focusout 处理。 "), withDirectives(createElementVNode("div", {
				id: tooltipId,
				ref_key: "bubbleRef",
				ref: bubbleRef,
				class: "astryx-tooltip",
				role: "tooltip",
				"data-placement": unref(position).placement,
				style: normalizeStyle(bubbleStyle.value),
				onMouseenter: cancelHide,
				onMouseleave: scheduleHide
			}, [renderSlot(_ctx.$slots, "content", {}, () => [createTextVNode(toDisplayString(__props.content), 1)])], 44, _hoisted_1), [[vShow, isVisible.value]])]))], 64);
		};
	}
});
//#endregion
//#region components/demos/tooltip/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), { content: "Save your changes" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), { label: "Save" }, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), { label: "Save" })];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/tooltip/basic.vue
var _sfc_setup$4 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/tooltip/basic.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/tooltip/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Tooltip } from '@astryx-vue/core/Tooltip'\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <Tooltip content=\"Save your changes\">\n      <Button label=\"Save\" />\n    </Tooltip>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Tooltip } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Tooltip'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Save your changes\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Save\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/tooltip/controlled.vue?vue&type=script&setup=true&lang.ts
var controlled_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "controlled",
	__ssrInlineRender: true,
	setup(__props) {
		const isOpen = ref(true);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-row" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				content: "Controlled tooltip",
				"is-open": isOpen.value,
				onOpenChange: ($event) => isOpen.value = $event
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), { label: "Hover me" }, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), { label: "Hover me" })];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$1), {
				label: isOpen.value ? "Hide tooltip" : "Show tooltip",
				variant: "ghost",
				onClick: ($event) => isOpen.value = !isOpen.value
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/tooltip/controlled.vue
var _sfc_setup$3 = controlled_vue_vue_type_script_setup_true_lang_default.setup;
controlled_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/tooltip/controlled.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var controlled_default$1 = controlled_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/tooltip/controlled.vue?raw&highlighted
var controlled_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Tooltip } from '@astryx-vue/core/Tooltip'\nimport { ref } from 'vue'\n\nconst isOpen = ref(true)\n<\/script>\n\n<template>\n  <div class=\"input-preview-row\">\n    <Tooltip content=\"Controlled tooltip\" :is-open=\"isOpen\" @open-change=\"isOpen = $event\">\n      <Button label=\"Hover me\" />\n    </Tooltip>\n    <Button :label=\"isOpen ? 'Hide tooltip' : 'Show tooltip'\" variant=\"ghost\" @click=\"isOpen = !isOpen\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Tooltip } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Tooltip'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> isOpen</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-row\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Controlled tooltip\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">is-open</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">open-change</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> $event</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Hover me\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">?</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Hide tooltip'</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> :</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Show tooltip'\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ghost\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> !</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/tooltip/overview.vue?vue&type=script&setup=true&lang.ts
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
						_push(`<span class="astryx-tooltip" style="${ssrRenderStyle({ "position": "relative" })}"${_scopeId}>Save your changes</span>`);
						_push(ssrRenderComponent(unref(_sfc_main), { content: "Save your changes" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), { label: "Save" }, null, _parent, _scopeId));
								else return [createVNode(unref(_sfc_main$1), { label: "Save" })];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode("span", {
						class: "astryx-tooltip",
						style: { "position": "relative" }
					}, "Save your changes"), createVNode(unref(_sfc_main), { content: "Save your changes" }, {
						default: withCtx(() => [createVNode(unref(_sfc_main$1), { label: "Save" })]),
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
//#region components/demos/tooltip/overview.vue
var _sfc_setup$2 = overview_vue_vue_type_script_setup_true_lang_default.setup;
overview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/tooltip/overview.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var overview_default$1 = overview_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/tooltip/overview.vue?raw&highlighted
var overview_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { VStack } from '@astryx-vue/core/Stack'\nimport { Tooltip } from '@astryx-vue/core/Tooltip'\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <VStack :gap=\"2\" align=\"center\">\n      <span class=\"astryx-tooltip\" style=\"position: relative\">Save your changes</span>\n      <Tooltip content=\"Save your changes\">\n        <Button label=\"Save\" />\n      </Tooltip>\n    </VStack>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Tooltip } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Tooltip'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"astryx-tooltip\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> style</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"position: relative\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Save your changes&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Save your changes\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Save\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/tooltip/placements.vue?vue&type=script&setup=true&lang.ts
var placements_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "placements",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				content: "Above",
				placement: "above"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), { label: "Above" }, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), { label: "Above" })];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				content: "Below",
				placement: "below"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), { label: "Below" }, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), { label: "Below" })];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				content: "Start",
				placement: "start"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), { label: "Start" }, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), { label: "Start" })];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				content: "End",
				placement: "end"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), { label: "End" }, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), { label: "End" })];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/tooltip/placements.vue
var _sfc_setup$1 = placements_vue_vue_type_script_setup_true_lang_default.setup;
placements_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/tooltip/placements.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var placements_default$1 = placements_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/tooltip/placements.vue?raw&highlighted
var placements_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { Tooltip } from '@astryx-vue/core/Tooltip'\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <Tooltip content=\"Above\" placement=\"above\">\n      <Button label=\"Above\" />\n    </Tooltip>\n    <Tooltip content=\"Below\" placement=\"below\">\n      <Button label=\"Below\" />\n    </Tooltip>\n    <Tooltip content=\"Start\" placement=\"start\">\n      <Button label=\"Start\" />\n    </Tooltip>\n    <Tooltip content=\"End\" placement=\"end\">\n      <Button label=\"End\" />\n    </Tooltip>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Tooltip } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Tooltip'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Above\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> placement</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"above\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Above\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Below\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> placement</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"below\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Below\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Start\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> placement</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"End\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> placement</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"end\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"End\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/tooltip/text.vue?vue&type=script&setup=true&lang.ts
var text_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "text",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}><p> Your balance is `);
			_push(ssrRenderComponent(unref(_sfc_main), { content: "Available funds, updated every minute" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` available `);
					else return [createTextVNode(" available ")];
				}),
				_: 1
			}, _parent));
			_push(` for withdrawal. </p></div>`);
		};
	}
});
//#endregion
//#region components/demos/tooltip/text.vue
var _sfc_setup = text_vue_vue_type_script_setup_true_lang_default.setup;
text_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/tooltip/text.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var text_default$1 = text_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/tooltip/text.vue?raw&highlighted
var text_default = {
	"source": "<script setup lang=\"ts\">\nimport { Tooltip } from '@astryx-vue/core/Tooltip'\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <p>\n      Your balance is\n      <Tooltip content=\"Available funds, updated every minute\">\n        available\n      </Tooltip>\n      for withdrawal.\n    </p>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Tooltip } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Tooltip'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Your balance is</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Available funds, updated every minute\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        available</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tooltip</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      for withdrawal.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/tooltip/index.ts
var options = { className: "input-preview-host" };
var tooltipBasic = defineDemo(basic_default$1, basic_default, options);
var tooltipPlacements = defineDemo(placements_default$1, placements_default, options);
var tooltipText = defineDemo(text_default$1, text_default, options);
var tooltipControlled = defineDemo(controlled_default$1, controlled_default, options);
var tooltipOverview = defineDemo(overview_default$1, overview_default, options);
//#endregion
export { tooltipText as a, tooltipPlacements as i, tooltipControlled as n, tooltipOverview as r, tooltipBasic as t };
