import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { n as _sfc_main$2, t as invokeNativeEventHandler } from "./eventHandlers-DUXzBWZy.C50IdnRl.js";
import { t as _sfc_main$3 } from "./Text-CKd7e3gK.CukfIJwc.js";
import { t as _sfc_main$4 } from "./Stack-iv52y_Jv.C5zk9p8n.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, inject, mergeModels, mergeProps, onBeforeUnmount, onMounted, onScopeDispose, onUpdated, openBlock, provide, ref, renderSlot, shallowRef, toDisplayString, unref, useAttrs, useId, useModel, useSSRContext, useTemplateRef, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/SegmentedControl-ChHmFrrC.js
var segmentedControlContextKey = Symbol("astryx-segmented-control");
var _hoisted_1$1 = [
	"aria-describedby",
	"aria-disabled",
	"aria-label",
	"data-disabled",
	"data-disabled-message",
	"data-layout",
	"data-size"
];
var ITEM_SELECTOR = "[role=\"radio\"]";
var TOOLTIP_SHOW_DELAY = 200;
var TOOLTIP_HIDE_DELAY = 100;
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "AstryxSegmentedControl",
	inheritAttrs: false,
	__name: "SegmentedControl",
	props: /*@__PURE__*/ mergeModels({
		label: {},
		size: { default: "md" },
		layout: { default: "hug" },
		isDisabled: {
			type: Boolean,
			default: false
		},
		disabledMessage: {}
	}, {
		"modelValue": { required: true },
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["update:modelValue", "change"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		const attrs = useAttrs();
		const root = useTemplateRef("root");
		const tooltipId = `astryx-segmented-control-${useId()}-tooltip`;
		__expose({ element: computed(() => root.value ?? null) });
		const showsDisabledMessage = computed(() => props.isDisabled && !!props.disabledMessage?.trim());
		function select(value) {
			if (props.isDisabled || value === model.value) return;
			model.value = value;
			emit("change", value);
		}
		provide(segmentedControlContextKey, {
			value: computed(() => model.value),
			size: computed(() => props.size),
			layout: computed(() => props.layout),
			isDisabled: computed(() => props.isDisabled),
			hasDisabledMessage: showsDisabledMessage,
			select
		});
		function getItems() {
			const element = root.value;
			return element == null ? [] : Array.from(element.querySelectorAll(ITEM_SELECTOR));
		}
		function isItemDisabled(item) {
			return item.getAttribute("aria-disabled") === "true" || item.disabled === true || item.hasAttribute("disabled");
		}
		function setTabIndex(item, value) {
			if (item.getAttribute("tabindex") !== String(value)) item.setAttribute("tabindex", String(value));
		}
		/**
		* Keep exactly one enabled segment tabbable. The segment that already carries
		* the tab stop keeps it; when the selected value matches no segment (or the
		* matching one is disabled) the first enabled segment is promoted instead.
		*/
		function syncTabStops() {
			const items = getItems();
			if (items.length === 0) return;
			const enabled = items.filter((item) => !isItemDisabled(item));
			if (enabled.length === 0) return;
			const tabbable = enabled.find((item) => item.getAttribute("tabindex") === "0") ?? enabled[0];
			for (const item of items) setTabIndex(item, item === tabbable ? 0 : -1);
		}
		onMounted(syncTabStops);
		onUpdated(syncTabStops);
		function isRtl() {
			const element = root.value;
			return element != null && typeof window !== "undefined" && window.getComputedStyle(element).direction === "rtl";
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
		function focusIndex(items, index) {
			const target = items[index];
			if (target == null) return;
			for (const item of items) setTabIndex(item, item === target ? 0 : -1);
			target.focus();
		}
		function handleKeydown(event) {
			invokeNativeEventHandler(attrs.onKeydown ?? attrs.onKeyDown, event);
			if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
			const items = getItems();
			if (items.length === 0) return;
			const rtl = (event.key === "ArrowRight" || event.key === "ArrowLeft") && isRtl();
			const nextKey = rtl ? "ArrowLeft" : "ArrowRight";
			const previousKey = rtl ? "ArrowRight" : "ArrowLeft";
			const active = typeof document === "undefined" ? null : document.activeElement;
			const currentIndex = items.findIndex((item) => item === active || item.contains(active));
			let targetIndex = -1;
			if (event.key === nextKey) targetIndex = findEnabledIndex(items, currentIndex === -1 ? 0 : currentIndex + 1, 1, true);
			else if (event.key === previousKey) targetIndex = findEnabledIndex(items, currentIndex === -1 ? items.length - 1 : currentIndex - 1, -1, true);
			else if (event.key === "Home") targetIndex = findEnabledIndex(items, 0, 1, false);
			else if (event.key === "End") targetIndex = findEnabledIndex(items, items.length - 1, -1, false);
			else return;
			event.preventDefault();
			if (targetIndex !== -1 && targetIndex !== currentIndex) focusIndex(items, targetIndex);
		}
		onMounted(() => root.value?.addEventListener("keydown", handleKeydown));
		onBeforeUnmount(() => root.value?.removeEventListener("keydown", handleKeydown));
		function matchesFocusVisible(element) {
			try {
				return element.matches(":focus-visible");
			} catch {
				return false;
			}
		}
		function handleFocusIn(event) {
			invokeNativeEventHandler(attrs.onFocusin ?? attrs.onFocusIn, event);
			if (event.defaultPrevented) return;
			syncTabStops();
			if (showsDisabledMessage.value) {
				const target = event.target;
				if (target instanceof HTMLElement && matchesFocusVisible(target)) showTooltip();
			}
			if (props.isDisabled) return;
			if (!event.currentTarget?.contains(event.relatedTarget)) return;
			const focused = event.target?.closest("[role=\"radio\"][data-value]");
			if (focused == null || focused.getAttribute("aria-disabled") === "true") return;
			const next = focused.dataset.value;
			if (next != null) select(next);
		}
		const isTooltipOpen = shallowRef(false);
		let showTimer;
		let hideTimer;
		function clearTimers() {
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
			showTimer = void 0;
			hideTimer = void 0;
		}
		function showTooltip() {
			if (!showsDisabledMessage.value) return;
			clearTimers();
			isTooltipOpen.value = true;
		}
		function hideTooltip() {
			clearTimers();
			isTooltipOpen.value = false;
		}
		function scheduleShowTooltip() {
			if (!showsDisabledMessage.value) return;
			clearTimers();
			showTimer = setTimeout(showTooltip, TOOLTIP_SHOW_DELAY);
		}
		function scheduleHideTooltip() {
			if (!showsDisabledMessage.value) return;
			clearTimers();
			hideTimer = setTimeout(hideTooltip, TOOLTIP_HIDE_DELAY);
		}
		onScopeDispose(clearTimers);
		const controlledAttrs = /* @__PURE__ */ new Set([
			"aria-describedby",
			"aria-disabled",
			"aria-label",
			"class",
			"onFocusIn",
			"onFocusin",
			"onKeyDown",
			"onKeydown",
			"role",
			"style"
		]);
		const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key))));
		const rootClass = computed(() => ["astryx-segmented-control", attrs.class]);
		const rootStyle = computed(() => attrs.style);
		const describedBy = computed(() => [attrs["aria-describedby"], showsDisabledMessage.value ? tooltipId : void 0].filter(Boolean).join(" ") || void 0);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("div", mergeProps({
				ref_key: "root",
				ref: root
			}, forwardedAttrs.value, {
				"aria-describedby": describedBy.value,
				"aria-disabled": __props.isDisabled || void 0,
				"aria-label": __props.label,
				class: rootClass.value,
				"data-disabled": __props.isDisabled || void 0,
				"data-disabled-message": showsDisabledMessage.value || void 0,
				"data-layout": __props.layout,
				"data-size": __props.size,
				style: rootStyle.value,
				role: "radiogroup",
				onFocusin: handleFocusIn,
				onFocusout: scheduleHideTooltip,
				onPointerenter: scheduleShowTooltip,
				onPointerleave: scheduleHideTooltip
			}), [renderSlot(_ctx.$slots, "default")], 16, _hoisted_1$1), showsDisabledMessage.value ? (openBlock(), createBlock(_sfc_main$2, {
				key: 0,
				id: tooltipId,
				anchor: root.value,
				open: isTooltipOpen.value,
				text: __props.disabledMessage ?? "",
				onPointerEnter: clearTimers,
				onPointerLeave: scheduleHideTooltip
			}, null, 8, [
				"anchor",
				"open",
				"text"
			])) : createCommentVNode("v-if", true)], 64);
		};
	}
});
var _hoisted_1 = [
	"aria-checked",
	"aria-disabled",
	"aria-label",
	"data-icon-only",
	"data-selected",
	"data-size",
	"data-value",
	"tabindex"
];
var _hoisted_2 = {
	key: 0,
	class: "astryx-segmented-control-item__icon",
	"aria-hidden": "true"
};
var _hoisted_3 = {
	key: 1,
	class: "astryx-segmented-control-item__label"
};
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxSegmentedControlItem",
	inheritAttrs: false,
	__name: "SegmentedControlItem",
	props: {
		value: {},
		label: {},
		isLabelHidden: {
			type: Boolean,
			default: false
		},
		isDisabled: {
			type: Boolean,
			default: false
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const attrs = useAttrs();
		const context = inject(segmentedControlContextKey, null);
		const root = useTemplateRef("root");
		__expose({ element: computed(() => root.value ?? null) });
		const size = computed(() => context?.size.value ?? "md");
		const isSelected = computed(() => context != null && context.value.value === props.value);
		const isDisabled = computed(() => props.isDisabled || (context?.isDisabled.value ?? false));
		const keepsSelectedFocusable = computed(() => isSelected.value && (context?.hasDisabledMessage.value ?? false) && !props.isDisabled);
		const iconOnly = computed(() => props.isLabelHidden);
		const tabIndex = computed(() => {
			if (context == null) return props.isDisabled ? -1 : 0;
			return isSelected.value && !isDisabled.value || keepsSelectedFocusable.value ? 0 : -1;
		});
		function handleClick(event) {
			invokeNativeEventHandler(attrs.onClick, event);
			if (event.defaultPrevented || isDisabled.value) return;
			context?.select(props.value);
		}
		const controlledAttrs = /* @__PURE__ */ new Set([
			"aria-checked",
			"aria-disabled",
			"aria-label",
			"class",
			"data-value",
			"onClick",
			"role",
			"style",
			"tabindex",
			"type"
		]);
		const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key))));
		const rootClass = computed(() => ["astryx-segmented-control-item", attrs.class]);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", mergeProps({
				ref_key: "root",
				ref: root
			}, forwardedAttrs.value, {
				"aria-checked": isSelected.value,
				"aria-disabled": isDisabled.value || void 0,
				"aria-label": __props.isLabelHidden ? __props.label : void 0,
				class: rootClass.value,
				"data-icon-only": iconOnly.value || void 0,
				"data-selected": isSelected.value || void 0,
				"data-size": size.value,
				"data-value": __props.value,
				style: unref(attrs).style,
				tabindex: tabIndex.value,
				role: "radio",
				type: "button",
				onClick: handleClick
			}), [_ctx.$slots.icon ? (openBlock(), createElementBlock("span", _hoisted_2, [renderSlot(_ctx.$slots, "icon")])) : createCommentVNode("v-if", true), !__props.isLabelHidden ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(__props.label), 1)) : createCommentVNode("v-if", true)], 16, _hoisted_1);
		};
	}
});
//#endregion
//#region components/demos/segmented-control/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		const SUMMARY = {
			overview: "Four projects, two of them due this week.",
			activity: "Eighteen updates since Monday.",
			members: "Twelve members, three invites still pending."
		};
		const view = ref("overview");
		const summary = computed(() => SUMMARY[view.value] ?? "");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "segmented-control-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$4), {
				class: "segmented-control-preview__panel",
				gap: 3,
				align: "start"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1), {
							modelValue: view.value,
							"onUpdate:modelValue": ($event) => view.value = $event,
							label: "Workspace view"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(unref(_sfc_main), {
										label: "Overview",
										value: "overview"
									}, null, _parent, _scopeId));
									_push(ssrRenderComponent(unref(_sfc_main), {
										label: "Activity",
										value: "activity"
									}, null, _parent, _scopeId));
									_push(ssrRenderComponent(unref(_sfc_main), {
										label: "Members",
										value: "members"
									}, null, _parent, _scopeId));
								} else return [
									createVNode(unref(_sfc_main), {
										label: "Overview",
										value: "overview"
									}),
									createVNode(unref(_sfc_main), {
										label: "Activity",
										value: "activity"
									}),
									createVNode(unref(_sfc_main), {
										label: "Members",
										value: "members"
									})
								];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$3), {
							type: "body",
							color: "secondary"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(summary.value)}`);
								else return [createTextVNode(toDisplayString(summary.value), 1)];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode(unref(_sfc_main$1), {
						modelValue: view.value,
						"onUpdate:modelValue": ($event) => view.value = $event,
						label: "Workspace view"
					}, {
						default: withCtx(() => [
							createVNode(unref(_sfc_main), {
								label: "Overview",
								value: "overview"
							}),
							createVNode(unref(_sfc_main), {
								label: "Activity",
								value: "activity"
							}),
							createVNode(unref(_sfc_main), {
								label: "Members",
								value: "members"
							})
						]),
						_: 1
					}, 8, ["modelValue", "onUpdate:modelValue"]), createVNode(unref(_sfc_main$3), {
						type: "body",
						color: "secondary"
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(summary.value), 1)]),
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
//#region components/demos/segmented-control/basic.vue
var _sfc_setup$3 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/segmented-control/basic.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/segmented-control/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'\nimport { VStack } from '@astryx-vue/core/Stack'\nimport { Text } from '@astryx-vue/core/Text'\nimport { computed, ref } from 'vue'\n\nconst SUMMARY: Record<string, string> = {\n  overview: 'Four projects, two of them due this week.',\n  activity: 'Eighteen updates since Monday.',\n  members: 'Twelve members, three invites still pending.',\n}\n\nconst view = ref('overview')\nconst summary = computed(() => SUMMARY[view.value] ?? '')\n<\/script>\n\n<template>\n  <div class=\"segmented-control-preview\">\n    <VStack class=\"segmented-control-preview__panel\" :gap=\"3\" align=\"start\">\n      <SegmentedControl v-model=\"view\" label=\"Workspace view\">\n        <SegmentedControlItem label=\"Overview\" value=\"overview\" />\n        <SegmentedControlItem label=\"Activity\" value=\"activity\" />\n        <SegmentedControlItem label=\"Members\" value=\"members\" />\n      </SegmentedControl>\n      <Text type=\"body\" color=\"secondary\">\n        {{ summary }}\n      </Text>\n    </VStack>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { SegmentedControl, SegmentedControlItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/SegmentedControl'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { computed, ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> SUMMARY</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> Record</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">string</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">string</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">> </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  overview: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Four projects, two of them due this week.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  activity: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Eighteen updates since Monday.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  members: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Twelve members, three invites still pending.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> view</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'overview'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> summary</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> computed</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(() </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> SUMMARY</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[view.value] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">??</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> ''</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"segmented-control-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"segmented-control-preview__panel\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">view</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Workspace view\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Overview\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Activity\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"activity\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Members\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"members\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"body\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        {{ summary }}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/segmented-control/icons.vue?vue&type=script&setup=true&lang.ts
var icons_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "icons",
	__ssrInlineRender: true,
	setup(__props) {
		const withLabels = ref("grid");
		const iconOnly = ref("grid");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "segmented-control-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$4), {
				class: "segmented-control-preview__rows",
				gap: 5,
				align: "start"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(unref(_sfc_main$3), {
										type: "supporting",
										color: "secondary"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Icon with a label `);
											else return [createTextVNode(" Icon with a label ")];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(unref(_sfc_main$1), {
										modelValue: withLabels.value,
										"onUpdate:modelValue": ($event) => withLabels.value = $event,
										label: "Layout"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Grid",
													value: "grid"
												}, {
													icon: withCtx((_, _push, _parent, _scopeId) => {
														if (_push) _push(`<span class="css-icon i-carbon-grid"${_scopeId}></span>`);
														else return [createVNode("span", { class: "css-icon i-carbon-grid" })];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Board",
													value: "board"
												}, {
													icon: withCtx((_, _push, _parent, _scopeId) => {
														if (_push) _push(`<span class="css-icon i-carbon-column"${_scopeId}></span>`);
														else return [createVNode("span", { class: "css-icon i-carbon-column" })];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "List",
													value: "list"
												}, {
													icon: withCtx((_, _push, _parent, _scopeId) => {
														if (_push) _push(`<span class="css-icon i-carbon-list"${_scopeId}></span>`);
														else return [createVNode("span", { class: "css-icon i-carbon-list" })];
													}),
													_: 1
												}, _parent, _scopeId));
											} else return [
												createVNode(unref(_sfc_main), {
													label: "Grid",
													value: "grid"
												}, {
													icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-grid" })]),
													_: 1
												}),
												createVNode(unref(_sfc_main), {
													label: "Board",
													value: "board"
												}, {
													icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-column" })]),
													_: 1
												}),
												createVNode(unref(_sfc_main), {
													label: "List",
													value: "list"
												}, {
													icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-list" })]),
													_: 1
												})
											];
										}),
										_: 1
									}, _parent, _scopeId));
								} else return [createVNode(unref(_sfc_main$3), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Icon with a label ")]),
									_: 1
								}), createVNode(unref(_sfc_main$1), {
									modelValue: withLabels.value,
									"onUpdate:modelValue": ($event) => withLabels.value = $event,
									label: "Layout"
								}, {
									default: withCtx(() => [
										createVNode(unref(_sfc_main), {
											label: "Grid",
											value: "grid"
										}, {
											icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-grid" })]),
											_: 1
										}),
										createVNode(unref(_sfc_main), {
											label: "Board",
											value: "board"
										}, {
											icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-column" })]),
											_: 1
										}),
										createVNode(unref(_sfc_main), {
											label: "List",
											value: "list"
										}, {
											icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-list" })]),
											_: 1
										})
									]),
									_: 1
								}, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(unref(_sfc_main$3), {
										type: "supporting",
										color: "secondary"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Icon only `);
											else return [createTextVNode(" Icon only ")];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(unref(_sfc_main$1), {
										modelValue: iconOnly.value,
										"onUpdate:modelValue": ($event) => iconOnly.value = $event,
										label: "Layout"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(ssrRenderComponent(unref(_sfc_main), {
													"is-label-hidden": "",
													label: "Grid",
													value: "grid"
												}, {
													icon: withCtx((_, _push, _parent, _scopeId) => {
														if (_push) _push(`<span class="css-icon i-carbon-grid"${_scopeId}></span>`);
														else return [createVNode("span", { class: "css-icon i-carbon-grid" })];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													"is-label-hidden": "",
													label: "Board",
													value: "board"
												}, {
													icon: withCtx((_, _push, _parent, _scopeId) => {
														if (_push) _push(`<span class="css-icon i-carbon-column"${_scopeId}></span>`);
														else return [createVNode("span", { class: "css-icon i-carbon-column" })];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													"is-label-hidden": "",
													label: "List",
													value: "list"
												}, {
													icon: withCtx((_, _push, _parent, _scopeId) => {
														if (_push) _push(`<span class="css-icon i-carbon-list"${_scopeId}></span>`);
														else return [createVNode("span", { class: "css-icon i-carbon-list" })];
													}),
													_: 1
												}, _parent, _scopeId));
											} else return [
												createVNode(unref(_sfc_main), {
													"is-label-hidden": "",
													label: "Grid",
													value: "grid"
												}, {
													icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-grid" })]),
													_: 1
												}),
												createVNode(unref(_sfc_main), {
													"is-label-hidden": "",
													label: "Board",
													value: "board"
												}, {
													icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-column" })]),
													_: 1
												}),
												createVNode(unref(_sfc_main), {
													"is-label-hidden": "",
													label: "List",
													value: "list"
												}, {
													icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-list" })]),
													_: 1
												})
											];
										}),
										_: 1
									}, _parent, _scopeId));
								} else return [createVNode(unref(_sfc_main$3), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Icon only ")]),
									_: 1
								}), createVNode(unref(_sfc_main$1), {
									modelValue: iconOnly.value,
									"onUpdate:modelValue": ($event) => iconOnly.value = $event,
									label: "Layout"
								}, {
									default: withCtx(() => [
										createVNode(unref(_sfc_main), {
											"is-label-hidden": "",
											label: "Grid",
											value: "grid"
										}, {
											icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-grid" })]),
											_: 1
										}),
										createVNode(unref(_sfc_main), {
											"is-label-hidden": "",
											label: "Board",
											value: "board"
										}, {
											icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-column" })]),
											_: 1
										}),
										createVNode(unref(_sfc_main), {
											"is-label-hidden": "",
											label: "List",
											value: "list"
										}, {
											icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-list" })]),
											_: 1
										})
									]),
									_: 1
								}, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode(unref(_sfc_main$4), {
						gap: 2,
						align: "start"
					}, {
						default: withCtx(() => [createVNode(unref(_sfc_main$3), {
							type: "supporting",
							color: "secondary"
						}, {
							default: withCtx(() => [createTextVNode(" Icon with a label ")]),
							_: 1
						}), createVNode(unref(_sfc_main$1), {
							modelValue: withLabels.value,
							"onUpdate:modelValue": ($event) => withLabels.value = $event,
							label: "Layout"
						}, {
							default: withCtx(() => [
								createVNode(unref(_sfc_main), {
									label: "Grid",
									value: "grid"
								}, {
									icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-grid" })]),
									_: 1
								}),
								createVNode(unref(_sfc_main), {
									label: "Board",
									value: "board"
								}, {
									icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-column" })]),
									_: 1
								}),
								createVNode(unref(_sfc_main), {
									label: "List",
									value: "list"
								}, {
									icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-list" })]),
									_: 1
								})
							]),
							_: 1
						}, 8, ["modelValue", "onUpdate:modelValue"])]),
						_: 1
					}), createVNode(unref(_sfc_main$4), {
						gap: 2,
						align: "start"
					}, {
						default: withCtx(() => [createVNode(unref(_sfc_main$3), {
							type: "supporting",
							color: "secondary"
						}, {
							default: withCtx(() => [createTextVNode(" Icon only ")]),
							_: 1
						}), createVNode(unref(_sfc_main$1), {
							modelValue: iconOnly.value,
							"onUpdate:modelValue": ($event) => iconOnly.value = $event,
							label: "Layout"
						}, {
							default: withCtx(() => [
								createVNode(unref(_sfc_main), {
									"is-label-hidden": "",
									label: "Grid",
									value: "grid"
								}, {
									icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-grid" })]),
									_: 1
								}),
								createVNode(unref(_sfc_main), {
									"is-label-hidden": "",
									label: "Board",
									value: "board"
								}, {
									icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-column" })]),
									_: 1
								}),
								createVNode(unref(_sfc_main), {
									"is-label-hidden": "",
									label: "List",
									value: "list"
								}, {
									icon: withCtx(() => [createVNode("span", { class: "css-icon i-carbon-list" })]),
									_: 1
								})
							]),
							_: 1
						}, 8, ["modelValue", "onUpdate:modelValue"])]),
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
//#region components/demos/segmented-control/icons.vue
var _sfc_setup$2 = icons_vue_vue_type_script_setup_true_lang_default.setup;
icons_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/segmented-control/icons.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var icons_default$1 = icons_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/segmented-control/icons.vue?raw&highlighted
var icons_default = {
	"source": "<script setup lang=\"ts\">\nimport { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'\nimport { VStack } from '@astryx-vue/core/Stack'\nimport { Text } from '@astryx-vue/core/Text'\nimport { ref } from 'vue'\n\nconst withLabels = ref('grid')\nconst iconOnly = ref('grid')\n<\/script>\n\n<template>\n  <div class=\"segmented-control-preview\">\n    <VStack class=\"segmented-control-preview__rows\" :gap=\"5\" align=\"start\">\n      <VStack :gap=\"2\" align=\"start\">\n        <Text type=\"supporting\" color=\"secondary\">\n          Icon with a label\n        </Text>\n        <SegmentedControl v-model=\"withLabels\" label=\"Layout\">\n          <SegmentedControlItem label=\"Grid\" value=\"grid\">\n            <template #icon>\n              <span class=\"css-icon i-carbon-grid\" />\n            </template>\n          </SegmentedControlItem>\n          <SegmentedControlItem label=\"Board\" value=\"board\">\n            <template #icon>\n              <span class=\"css-icon i-carbon-column\" />\n            </template>\n          </SegmentedControlItem>\n          <SegmentedControlItem label=\"List\" value=\"list\">\n            <template #icon>\n              <span class=\"css-icon i-carbon-list\" />\n            </template>\n          </SegmentedControlItem>\n        </SegmentedControl>\n      </VStack>\n\n      <VStack :gap=\"2\" align=\"start\">\n        <Text type=\"supporting\" color=\"secondary\">\n          Icon only\n        </Text>\n        <SegmentedControl v-model=\"iconOnly\" label=\"Layout\">\n          <SegmentedControlItem is-label-hidden label=\"Grid\" value=\"grid\">\n            <template #icon>\n              <span class=\"css-icon i-carbon-grid\" />\n            </template>\n          </SegmentedControlItem>\n          <SegmentedControlItem is-label-hidden label=\"Board\" value=\"board\">\n            <template #icon>\n              <span class=\"css-icon i-carbon-column\" />\n            </template>\n          </SegmentedControlItem>\n          <SegmentedControlItem is-label-hidden label=\"List\" value=\"list\">\n            <template #icon>\n              <span class=\"css-icon i-carbon-list\" />\n            </template>\n          </SegmentedControlItem>\n        </SegmentedControl>\n      </VStack>\n    </VStack>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { SegmentedControl, SegmentedControlItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/SegmentedControl'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> withLabels</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'grid'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> iconOnly</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'grid'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"segmented-control-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"segmented-control-preview__rows\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">5</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Icon with a label</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">withLabels</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Layout\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Grid\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon i-carbon-grid\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Board\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"board\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon i-carbon-column\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"List\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon i-carbon-list\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Icon only</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">iconOnly</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Layout\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-label-hidden</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Grid\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon i-carbon-grid\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-label-hidden</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Board\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"board\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon i-carbon-column\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-label-hidden</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"List\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon i-carbon-list\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/segmented-control/sizes.vue?vue&type=script&setup=true&lang.ts
var sizes_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "sizes",
	__ssrInlineRender: true,
	setup(__props) {
		const small = ref("day");
		const medium = ref("day");
		const large = ref("day");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "segmented-control-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$4), {
				class: "segmented-control-preview__rows",
				gap: 5,
				align: "start"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(unref(_sfc_main$3), {
										type: "supporting",
										color: "secondary"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Small `);
											else return [createTextVNode(" Small ")];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(unref(_sfc_main$1), {
										modelValue: small.value,
										"onUpdate:modelValue": ($event) => small.value = $event,
										label: "Range",
										size: "sm"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Day",
													value: "day"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Week",
													value: "week"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Month",
													value: "month"
												}, null, _parent, _scopeId));
											} else return [
												createVNode(unref(_sfc_main), {
													label: "Day",
													value: "day"
												}),
												createVNode(unref(_sfc_main), {
													label: "Week",
													value: "week"
												}),
												createVNode(unref(_sfc_main), {
													label: "Month",
													value: "month"
												})
											];
										}),
										_: 1
									}, _parent, _scopeId));
								} else return [createVNode(unref(_sfc_main$3), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Small ")]),
									_: 1
								}), createVNode(unref(_sfc_main$1), {
									modelValue: small.value,
									"onUpdate:modelValue": ($event) => small.value = $event,
									label: "Range",
									size: "sm"
								}, {
									default: withCtx(() => [
										createVNode(unref(_sfc_main), {
											label: "Day",
											value: "day"
										}),
										createVNode(unref(_sfc_main), {
											label: "Week",
											value: "week"
										}),
										createVNode(unref(_sfc_main), {
											label: "Month",
											value: "month"
										})
									]),
									_: 1
								}, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(unref(_sfc_main$3), {
										type: "supporting",
										color: "secondary"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Medium `);
											else return [createTextVNode(" Medium ")];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(unref(_sfc_main$1), {
										modelValue: medium.value,
										"onUpdate:modelValue": ($event) => medium.value = $event,
										label: "Range",
										size: "md"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Day",
													value: "day"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Week",
													value: "week"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Month",
													value: "month"
												}, null, _parent, _scopeId));
											} else return [
												createVNode(unref(_sfc_main), {
													label: "Day",
													value: "day"
												}),
												createVNode(unref(_sfc_main), {
													label: "Week",
													value: "week"
												}),
												createVNode(unref(_sfc_main), {
													label: "Month",
													value: "month"
												})
											];
										}),
										_: 1
									}, _parent, _scopeId));
								} else return [createVNode(unref(_sfc_main$3), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Medium ")]),
									_: 1
								}), createVNode(unref(_sfc_main$1), {
									modelValue: medium.value,
									"onUpdate:modelValue": ($event) => medium.value = $event,
									label: "Range",
									size: "md"
								}, {
									default: withCtx(() => [
										createVNode(unref(_sfc_main), {
											label: "Day",
											value: "day"
										}),
										createVNode(unref(_sfc_main), {
											label: "Week",
											value: "week"
										}),
										createVNode(unref(_sfc_main), {
											label: "Month",
											value: "month"
										})
									]),
									_: 1
								}, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(unref(_sfc_main$3), {
										type: "supporting",
										color: "secondary"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Large `);
											else return [createTextVNode(" Large ")];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(unref(_sfc_main$1), {
										modelValue: large.value,
										"onUpdate:modelValue": ($event) => large.value = $event,
										label: "Range",
										size: "lg"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Day",
													value: "day"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Week",
													value: "week"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Month",
													value: "month"
												}, null, _parent, _scopeId));
											} else return [
												createVNode(unref(_sfc_main), {
													label: "Day",
													value: "day"
												}),
												createVNode(unref(_sfc_main), {
													label: "Week",
													value: "week"
												}),
												createVNode(unref(_sfc_main), {
													label: "Month",
													value: "month"
												})
											];
										}),
										_: 1
									}, _parent, _scopeId));
								} else return [createVNode(unref(_sfc_main$3), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Large ")]),
									_: 1
								}), createVNode(unref(_sfc_main$1), {
									modelValue: large.value,
									"onUpdate:modelValue": ($event) => large.value = $event,
									label: "Range",
									size: "lg"
								}, {
									default: withCtx(() => [
										createVNode(unref(_sfc_main), {
											label: "Day",
											value: "day"
										}),
										createVNode(unref(_sfc_main), {
											label: "Week",
											value: "week"
										}),
										createVNode(unref(_sfc_main), {
											label: "Month",
											value: "month"
										})
									]),
									_: 1
								}, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx(() => [createVNode(unref(_sfc_main$3), {
								type: "supporting",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Small ")]),
								_: 1
							}), createVNode(unref(_sfc_main$1), {
								modelValue: small.value,
								"onUpdate:modelValue": ($event) => small.value = $event,
								label: "Range",
								size: "sm"
							}, {
								default: withCtx(() => [
									createVNode(unref(_sfc_main), {
										label: "Day",
										value: "day"
									}),
									createVNode(unref(_sfc_main), {
										label: "Week",
										value: "week"
									}),
									createVNode(unref(_sfc_main), {
										label: "Month",
										value: "month"
									})
								]),
								_: 1
							}, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						}),
						createVNode(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx(() => [createVNode(unref(_sfc_main$3), {
								type: "supporting",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Medium ")]),
								_: 1
							}), createVNode(unref(_sfc_main$1), {
								modelValue: medium.value,
								"onUpdate:modelValue": ($event) => medium.value = $event,
								label: "Range",
								size: "md"
							}, {
								default: withCtx(() => [
									createVNode(unref(_sfc_main), {
										label: "Day",
										value: "day"
									}),
									createVNode(unref(_sfc_main), {
										label: "Week",
										value: "week"
									}),
									createVNode(unref(_sfc_main), {
										label: "Month",
										value: "month"
									})
								]),
								_: 1
							}, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						}),
						createVNode(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx(() => [createVNode(unref(_sfc_main$3), {
								type: "supporting",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Large ")]),
								_: 1
							}), createVNode(unref(_sfc_main$1), {
								modelValue: large.value,
								"onUpdate:modelValue": ($event) => large.value = $event,
								label: "Range",
								size: "lg"
							}, {
								default: withCtx(() => [
									createVNode(unref(_sfc_main), {
										label: "Day",
										value: "day"
									}),
									createVNode(unref(_sfc_main), {
										label: "Week",
										value: "week"
									}),
									createVNode(unref(_sfc_main), {
										label: "Month",
										value: "month"
									})
								]),
								_: 1
							}, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						})
					];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/segmented-control/sizes.vue
var _sfc_setup$1 = sizes_vue_vue_type_script_setup_true_lang_default.setup;
sizes_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/segmented-control/sizes.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var sizes_default$1 = sizes_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/segmented-control/sizes.vue?raw&highlighted
var sizes_default = {
	"source": "<script setup lang=\"ts\">\nimport { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'\nimport { VStack } from '@astryx-vue/core/Stack'\nimport { Text } from '@astryx-vue/core/Text'\nimport { ref } from 'vue'\n\nconst small = ref('day')\nconst medium = ref('day')\nconst large = ref('day')\n<\/script>\n\n<template>\n  <div class=\"segmented-control-preview\">\n    <VStack class=\"segmented-control-preview__rows\" :gap=\"5\" align=\"start\">\n      <VStack :gap=\"2\" align=\"start\">\n        <Text type=\"supporting\" color=\"secondary\">\n          Small\n        </Text>\n        <SegmentedControl v-model=\"small\" label=\"Range\" size=\"sm\">\n          <SegmentedControlItem label=\"Day\" value=\"day\" />\n          <SegmentedControlItem label=\"Week\" value=\"week\" />\n          <SegmentedControlItem label=\"Month\" value=\"month\" />\n        </SegmentedControl>\n      </VStack>\n\n      <VStack :gap=\"2\" align=\"start\">\n        <Text type=\"supporting\" color=\"secondary\">\n          Medium\n        </Text>\n        <SegmentedControl v-model=\"medium\" label=\"Range\" size=\"md\">\n          <SegmentedControlItem label=\"Day\" value=\"day\" />\n          <SegmentedControlItem label=\"Week\" value=\"week\" />\n          <SegmentedControlItem label=\"Month\" value=\"month\" />\n        </SegmentedControl>\n      </VStack>\n\n      <VStack :gap=\"2\" align=\"start\">\n        <Text type=\"supporting\" color=\"secondary\">\n          Large\n        </Text>\n        <SegmentedControl v-model=\"large\" label=\"Range\" size=\"lg\">\n          <SegmentedControlItem label=\"Day\" value=\"day\" />\n          <SegmentedControlItem label=\"Week\" value=\"week\" />\n          <SegmentedControlItem label=\"Month\" value=\"month\" />\n        </SegmentedControl>\n      </VStack>\n    </VStack>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { SegmentedControl, SegmentedControlItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/SegmentedControl'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> small</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'day'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> medium</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'day'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> large</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'day'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"segmented-control-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"segmented-control-preview__rows\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">5</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Small</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">small</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Range\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Day\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"day\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Week\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"week\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Month\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"month\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Medium</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">medium</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Range\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"md\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Day\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"day\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Week\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"week\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Month\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"month\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Large</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">large</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Range\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"lg\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Day\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"day\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Week\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"week\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Month\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"month\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/segmented-control/states.vue?vue&type=script&setup=true&lang.ts
var states_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "states",
	__ssrInlineRender: true,
	setup(__props) {
		const partial = ref("draft");
		const disabled = ref("published");
		const fill = ref("week");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "segmented-control-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$4), {
				class: "segmented-control-preview__rows",
				gap: 5,
				align: "start"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(unref(_sfc_main$3), {
										type: "supporting",
										color: "secondary"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` One segment disabled `);
											else return [createTextVNode(" One segment disabled ")];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(unref(_sfc_main$1), {
										modelValue: partial.value,
										"onUpdate:modelValue": ($event) => partial.value = $event,
										label: "Visibility"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Draft",
													value: "draft"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													"is-disabled": "",
													label: "Scheduled",
													value: "scheduled"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Published",
													value: "published"
												}, null, _parent, _scopeId));
											} else return [
												createVNode(unref(_sfc_main), {
													label: "Draft",
													value: "draft"
												}),
												createVNode(unref(_sfc_main), {
													"is-disabled": "",
													label: "Scheduled",
													value: "scheduled"
												}),
												createVNode(unref(_sfc_main), {
													label: "Published",
													value: "published"
												})
											];
										}),
										_: 1
									}, _parent, _scopeId));
								} else return [createVNode(unref(_sfc_main$3), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" One segment disabled ")]),
									_: 1
								}), createVNode(unref(_sfc_main$1), {
									modelValue: partial.value,
									"onUpdate:modelValue": ($event) => partial.value = $event,
									label: "Visibility"
								}, {
									default: withCtx(() => [
										createVNode(unref(_sfc_main), {
											label: "Draft",
											value: "draft"
										}),
										createVNode(unref(_sfc_main), {
											"is-disabled": "",
											label: "Scheduled",
											value: "scheduled"
										}),
										createVNode(unref(_sfc_main), {
											label: "Published",
											value: "published"
										})
									]),
									_: 1
								}, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(unref(_sfc_main$3), {
										type: "supporting",
										color: "secondary"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Whole control disabled, with a reason `);
											else return [createTextVNode(" Whole control disabled, with a reason ")];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(unref(_sfc_main$1), {
										modelValue: disabled.value,
										"onUpdate:modelValue": ($event) => disabled.value = $event,
										"disabled-message": "Only workspace owners can change this.",
										"is-disabled": "",
										label: "Visibility"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Draft",
													value: "draft"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Scheduled",
													value: "scheduled"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Published",
													value: "published"
												}, null, _parent, _scopeId));
											} else return [
												createVNode(unref(_sfc_main), {
													label: "Draft",
													value: "draft"
												}),
												createVNode(unref(_sfc_main), {
													label: "Scheduled",
													value: "scheduled"
												}),
												createVNode(unref(_sfc_main), {
													label: "Published",
													value: "published"
												})
											];
										}),
										_: 1
									}, _parent, _scopeId));
								} else return [createVNode(unref(_sfc_main$3), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Whole control disabled, with a reason ")]),
									_: 1
								}), createVNode(unref(_sfc_main$1), {
									modelValue: disabled.value,
									"onUpdate:modelValue": ($event) => disabled.value = $event,
									"disabled-message": "Only workspace owners can change this.",
									"is-disabled": "",
									label: "Visibility"
								}, {
									default: withCtx(() => [
										createVNode(unref(_sfc_main), {
											label: "Draft",
											value: "draft"
										}),
										createVNode(unref(_sfc_main), {
											label: "Scheduled",
											value: "scheduled"
										}),
										createVNode(unref(_sfc_main), {
											label: "Published",
											value: "published"
										})
									]),
									_: 1
								}, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(unref(_sfc_main$3), {
										type: "supporting",
										color: "secondary"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Filling a narrow card `);
											else return [createTextVNode(" Filling a narrow card ")];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(`<div class="segmented-control-preview__frame"${_scopeId}>`);
									_push(ssrRenderComponent(unref(_sfc_main$1), {
										modelValue: fill.value,
										"onUpdate:modelValue": ($event) => fill.value = $event,
										label: "Reporting range",
										layout: "fill"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Day",
													value: "day"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Week",
													value: "week"
												}, null, _parent, _scopeId));
												_push(ssrRenderComponent(unref(_sfc_main), {
													label: "Month",
													value: "month"
												}, null, _parent, _scopeId));
											} else return [
												createVNode(unref(_sfc_main), {
													label: "Day",
													value: "day"
												}),
												createVNode(unref(_sfc_main), {
													label: "Week",
													value: "week"
												}),
												createVNode(unref(_sfc_main), {
													label: "Month",
													value: "month"
												})
											];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(`</div>`);
								} else return [createVNode(unref(_sfc_main$3), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Filling a narrow card ")]),
									_: 1
								}), createVNode("div", { class: "segmented-control-preview__frame" }, [createVNode(unref(_sfc_main$1), {
									modelValue: fill.value,
									"onUpdate:modelValue": ($event) => fill.value = $event,
									label: "Reporting range",
									layout: "fill"
								}, {
									default: withCtx(() => [
										createVNode(unref(_sfc_main), {
											label: "Day",
											value: "day"
										}),
										createVNode(unref(_sfc_main), {
											label: "Week",
											value: "week"
										}),
										createVNode(unref(_sfc_main), {
											label: "Month",
											value: "month"
										})
									]),
									_: 1
								}, 8, ["modelValue", "onUpdate:modelValue"])])];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx(() => [createVNode(unref(_sfc_main$3), {
								type: "supporting",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" One segment disabled ")]),
								_: 1
							}), createVNode(unref(_sfc_main$1), {
								modelValue: partial.value,
								"onUpdate:modelValue": ($event) => partial.value = $event,
								label: "Visibility"
							}, {
								default: withCtx(() => [
									createVNode(unref(_sfc_main), {
										label: "Draft",
										value: "draft"
									}),
									createVNode(unref(_sfc_main), {
										"is-disabled": "",
										label: "Scheduled",
										value: "scheduled"
									}),
									createVNode(unref(_sfc_main), {
										label: "Published",
										value: "published"
									})
								]),
								_: 1
							}, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						}),
						createVNode(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx(() => [createVNode(unref(_sfc_main$3), {
								type: "supporting",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Whole control disabled, with a reason ")]),
								_: 1
							}), createVNode(unref(_sfc_main$1), {
								modelValue: disabled.value,
								"onUpdate:modelValue": ($event) => disabled.value = $event,
								"disabled-message": "Only workspace owners can change this.",
								"is-disabled": "",
								label: "Visibility"
							}, {
								default: withCtx(() => [
									createVNode(unref(_sfc_main), {
										label: "Draft",
										value: "draft"
									}),
									createVNode(unref(_sfc_main), {
										label: "Scheduled",
										value: "scheduled"
									}),
									createVNode(unref(_sfc_main), {
										label: "Published",
										value: "published"
									})
								]),
								_: 1
							}, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						}),
						createVNode(unref(_sfc_main$4), {
							gap: 2,
							align: "start"
						}, {
							default: withCtx(() => [createVNode(unref(_sfc_main$3), {
								type: "supporting",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Filling a narrow card ")]),
								_: 1
							}), createVNode("div", { class: "segmented-control-preview__frame" }, [createVNode(unref(_sfc_main$1), {
								modelValue: fill.value,
								"onUpdate:modelValue": ($event) => fill.value = $event,
								label: "Reporting range",
								layout: "fill"
							}, {
								default: withCtx(() => [
									createVNode(unref(_sfc_main), {
										label: "Day",
										value: "day"
									}),
									createVNode(unref(_sfc_main), {
										label: "Week",
										value: "week"
									}),
									createVNode(unref(_sfc_main), {
										label: "Month",
										value: "month"
									})
								]),
								_: 1
							}, 8, ["modelValue", "onUpdate:modelValue"])])]),
							_: 1
						})
					];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/segmented-control/states.vue
var _sfc_setup = states_vue_vue_type_script_setup_true_lang_default.setup;
states_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/segmented-control/states.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var states_default$1 = states_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/segmented-control/states.vue?raw&highlighted
var states_default = {
	"source": "<script setup lang=\"ts\">\nimport { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'\nimport { VStack } from '@astryx-vue/core/Stack'\nimport { Text } from '@astryx-vue/core/Text'\nimport { ref } from 'vue'\n\nconst partial = ref('draft')\nconst disabled = ref('published')\nconst fill = ref('week')\n<\/script>\n\n<template>\n  <div class=\"segmented-control-preview\">\n    <VStack class=\"segmented-control-preview__rows\" :gap=\"5\" align=\"start\">\n      <VStack :gap=\"2\" align=\"start\">\n        <Text type=\"supporting\" color=\"secondary\">\n          One segment disabled\n        </Text>\n        <SegmentedControl v-model=\"partial\" label=\"Visibility\">\n          <SegmentedControlItem label=\"Draft\" value=\"draft\" />\n          <SegmentedControlItem is-disabled label=\"Scheduled\" value=\"scheduled\" />\n          <SegmentedControlItem label=\"Published\" value=\"published\" />\n        </SegmentedControl>\n      </VStack>\n\n      <VStack :gap=\"2\" align=\"start\">\n        <Text type=\"supporting\" color=\"secondary\">\n          Whole control disabled, with a reason\n        </Text>\n        <SegmentedControl\n          v-model=\"disabled\"\n          disabled-message=\"Only workspace owners can change this.\"\n          is-disabled\n          label=\"Visibility\"\n        >\n          <SegmentedControlItem label=\"Draft\" value=\"draft\" />\n          <SegmentedControlItem label=\"Scheduled\" value=\"scheduled\" />\n          <SegmentedControlItem label=\"Published\" value=\"published\" />\n        </SegmentedControl>\n      </VStack>\n\n      <VStack :gap=\"2\" align=\"start\">\n        <Text type=\"supporting\" color=\"secondary\">\n          Filling a narrow card\n        </Text>\n        <div class=\"segmented-control-preview__frame\">\n          <SegmentedControl v-model=\"fill\" label=\"Reporting range\" layout=\"fill\">\n            <SegmentedControlItem label=\"Day\" value=\"day\" />\n            <SegmentedControlItem label=\"Week\" value=\"week\" />\n            <SegmentedControlItem label=\"Month\" value=\"month\" />\n          </SegmentedControl>\n        </div>\n      </VStack>\n    </VStack>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { SegmentedControl, SegmentedControlItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/SegmentedControl'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> partial</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'draft'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> disabled</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'published'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> fill</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'week'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"segmented-control-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"segmented-control-preview__rows\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">5</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          One segment disabled</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">partial</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Visibility\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Draft\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"draft\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-disabled</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Scheduled\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"scheduled\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Published\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"published\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Whole control disabled, with a reason</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">disabled</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          disabled-message</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Only workspace owners can change this.\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          is-disabled</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Visibility\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Draft\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"draft\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Scheduled\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"scheduled\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Published\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"published\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Filling a narrow card</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"segmented-control-preview__frame\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">fill</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Reporting range\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> layout</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"fill\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Day\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"day\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Week\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"week\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControlItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Month\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"month\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">SegmentedControl</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/segmented-control/index.ts
var options = { className: "segmented-control-preview" };
var segmentedControlBasic = defineDemo(basic_default$1, basic_default, options);
var segmentedControlSizes = defineDemo(sizes_default$1, sizes_default, options);
var segmentedControlIcons = defineDemo(icons_default$1, icons_default, options);
var segmentedControlStates = defineDemo(states_default$1, states_default, options);
//#endregion
export { segmentedControlStates as i, segmentedControlIcons as n, segmentedControlSizes as r, segmentedControlBasic as t };
