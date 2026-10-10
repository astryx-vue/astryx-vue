import { t as _sfc_main$2 } from "./VisuallyHidden-C7NN3VEP.DAKckTtZ.js";
import { n as _sfc_main$3, t as invokeNativeEventHandler } from "./eventHandlers-DUXzBWZy.C50IdnRl.js";
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, inject, mergeProps, onScopeDispose, openBlock, renderSlot, resolveDynamicComponent, shallowRef, toDisplayString, toRaw, unref, useAttrs, useId, useSlots, useTemplateRef, watch, withCtx } from "vue";
//#region ../../packages/core/dist/context-4PuqD1Ic.js
var buttonGroupContextKey = Symbol("astryx-button-group");
//#endregion
//#region ../../packages/core/dist/Button-DrqeomlE.js
var _hoisted_1$1 = ["aria-label"];
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "ButtonSpinner",
	__name: "ButtonSpinner",
	props: { label: {} },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				class: "astryx-spinner astryx-button__spinner",
				role: "status",
				"aria-label": __props.label
			}, null, 8, _hoisted_1$1);
		};
	}
});
function useButtonAction({ clickAction, emitClick, isDisabled, isInterruptible, isLoading }) {
	const pendingCount = shallowRef(0);
	const isPending = computed(() => pendingCount.value > 0);
	function finishAction() {
		pendingCount.value = Math.max(0, pendingCount.value - 1);
	}
	function handleClick(event) {
		if (isDisabled.value || (isLoading.value || isPending.value) && !isInterruptible.value) {
			event.preventDefault();
			return;
		}
		emitClick(event);
		const action = clickAction();
		if (action == null || event.defaultPrevented) return;
		pendingCount.value += 1;
		try {
			const result = action(event);
			if (result == null) {
				finishAction();
				return;
			}
			return Promise.resolve(result).finally(finishAction);
		} catch (error) {
			finishAction();
			throw error;
		}
	}
	return {
		handleClick,
		isPending
	};
}
var HIDE_DELAY = 100;
var SHOW_DELAY = 200;
function useButtonTooltip(isEnabled) {
	const isOpen = shallowRef(false);
	let showTimer;
	let hideTimer;
	function clearShowTimer() {
		if (showTimer != null) clearTimeout(showTimer);
		showTimer = void 0;
	}
	function clearHideTimer() {
		if (hideTimer != null) clearTimeout(hideTimer);
		hideTimer = void 0;
	}
	function hideImmediately() {
		clearShowTimer();
		clearHideTimer();
		isOpen.value = false;
	}
	function showImmediately() {
		if (!isEnabled.value) return;
		clearShowTimer();
		clearHideTimer();
		isOpen.value = true;
	}
	function onPointerEnter() {
		if (!isEnabled.value) return;
		clearShowTimer();
		clearHideTimer();
		showTimer = setTimeout(showImmediately, SHOW_DELAY);
	}
	function onPointerLeave() {
		clearShowTimer();
		clearHideTimer();
		hideTimer = setTimeout(hideImmediately, HIDE_DELAY);
	}
	function onFocus(event) {
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		let isFocusVisible = true;
		try {
			isFocusVisible = target.matches(":focus-visible");
		} catch {}
		if (isFocusVisible) showImmediately();
	}
	function onTooltipPointerEnter() {
		if (!isEnabled.value) return;
		clearHideTimer();
		isOpen.value = true;
	}
	watch(isEnabled, (enabled) => {
		if (!enabled) hideImmediately();
	});
	onScopeDispose(() => {
		clearShowTimer();
		clearHideTimer();
	});
	return {
		hideImmediately,
		isOpen,
		onBlur: onPointerLeave,
		onFocus,
		onPointerDown: hideImmediately,
		onPointerEnter,
		onPointerLeave,
		onTooltipPointerEnter,
		onTooltipPointerLeave: onPointerLeave
	};
}
var _hoisted_1 = {
	key: 0,
	class: "astryx-button__spinner-overlay",
	"aria-hidden": "true"
};
var _hoisted_2 = ["aria-hidden"];
var _hoisted_3 = {
	key: 0,
	class: "astryx-button__icon",
	"aria-hidden": "true"
};
var _hoisted_4 = {
	key: 1,
	class: "astryx-button__label"
};
var _hoisted_5 = {
	key: 2,
	class: "astryx-button__end",
	"aria-hidden": "true"
};
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxButton",
	inheritAttrs: false,
	__name: "Button",
	props: {
		as: {},
		clickAction: {},
		elevation: { default: "none" },
		form: {},
		href: {},
		isDisabled: {
			type: Boolean,
			default: false
		},
		isIconOnly: {
			type: Boolean,
			default: false
		},
		isInterruptible: {
			type: Boolean,
			default: false
		},
		isLoading: {
			type: Boolean,
			default: false
		},
		label: {},
		loadingLabel: { default: "Loading" },
		name: {},
		rel: {},
		size: {},
		target: {},
		tooltip: {},
		type: { default: "button" },
		value: {},
		variant: { default: "secondary" },
		width: {}
	},
	emits: ["click"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const attrs = useAttrs();
		const slots = useSlots();
		const group = inject(buttonGroupContextKey, null);
		const renderedRoot = useTemplateRef("root");
		const tooltipId = `astryx-button-tooltip-${useId()}`;
		const effectiveSize = computed(() => props.size ?? group?.size.value ?? "md");
		const isGroupDisabled = computed(() => group?.isDisabled.value ?? false);
		const isLocallyDisabled = computed(() => props.isDisabled || isGroupDisabled.value);
		const action = useButtonAction({
			clickAction: () => props.clickAction,
			emitClick: (event) => emit("click", event),
			isDisabled: isLocallyDisabled,
			isInterruptible: computed(() => props.isInterruptible),
			isLoading: computed(() => props.isLoading)
		});
		const isLoadingState = computed(() => props.isLoading || action.isPending.value);
		const delaySpinner = computed(() => action.isPending.value || props.isInterruptible);
		const isDisabledState = computed(() => isLocallyDisabled.value || isLoadingState.value && !props.isInterruptible);
		const hasTooltip = computed(() => (props.tooltip?.trim().length ?? 0) > 0);
		const useAriaDisabled = computed(() => hasTooltip.value && isDisabledState.value);
		const renderAsLink = computed(() => props.href != null && !isDisabledState.value);
		const rootComponent = computed(() => renderAsLink.value ? props.as == null ? "a" : toRaw(props.as) : "button");
		const isCustomLink = computed(() => renderAsLink.value && rootComponent.value !== "a");
		const nativeDisabled = computed(() => !renderAsLink.value && !useAriaDisabled.value && isDisabledState.value);
		const element = computed(() => {
			const root = renderedRoot.value;
			if (typeof HTMLElement === "undefined" || root == null) return null;
			if (root instanceof HTMLElement) return root;
			return root.$el instanceof HTMLElement ? root.$el : null;
		});
		const buttonTooltip = useButtonTooltip(hasTooltip);
		const rootClass = computed(() => [
			"astryx-button",
			props.variant,
			effectiveSize.value,
			attrs.class
		]);
		const rootStyle = computed(() => {
			const buttonStyle = {};
			if (props.width != null) buttonStyle["--astryx-button-width"] = typeof props.width === "number" ? `${props.width}px` : props.width;
			return [attrs.style, buttonStyle];
		});
		const ariaLabel = computed(() => {
			if (props.isIconOnly || isLoadingState.value || slots.default != null) return props.label || void 0;
			return attrs["aria-label"];
		});
		const ariaDescribedBy = computed(() => {
			const consumerDescription = attrs["aria-describedby"];
			const descriptions = [typeof consumerDescription === "string" ? consumerDescription : void 0, hasTooltip.value ? tooltipId : void 0].filter(Boolean);
			return descriptions.length > 0 ? descriptions.join(" ") : void 0;
		});
		const controlledAttrs = /* @__PURE__ */ new Set([
			"aria-busy",
			"aria-describedby",
			"aria-disabled",
			"aria-label",
			"class",
			"disabled",
			"onClick",
			"onKeyDown",
			"onKeydown",
			"style"
		]);
		function getForwardedAttrs() {
			return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)));
		}
		function handleRootClick(event) {
			return action.handleClick(event);
		}
		function handleRootKeydown(event) {
			if (event.key === "Escape") buttonTooltip.hideImmediately();
			if (useAriaDisabled.value && (event.key === "Enter" || event.key === " ")) {
				event.preventDefault();
				return;
			}
			invokeNativeEventHandler(attrs.onKeydown ?? attrs.onKeyDown, event);
		}
		__expose({ element });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(rootComponent.value), mergeProps({ ref: "root" }, getForwardedAttrs(), {
				"aria-busy": isLoadingState.value || void 0,
				"aria-describedby": ariaDescribedBy.value,
				"aria-disabled": useAriaDisabled.value || void 0,
				"aria-label": ariaLabel.value,
				class: rootClass.value,
				"data-astryx-edge-comp": __props.variant === "ghost" ? "" : void 0,
				"data-delay-spinner": isLoadingState.value && delaySpinner.value || void 0,
				"data-elevation": unref(group) == null ? __props.elevation : "none",
				"data-icon-only": __props.isIconOnly || void 0,
				"data-size": effectiveSize.value,
				"data-variant": __props.variant,
				disabled: nativeDisabled.value || void 0,
				form: renderAsLink.value ? void 0 : __props.form,
				href: renderAsLink.value ? __props.href : void 0,
				name: renderAsLink.value ? void 0 : __props.name,
				rel: renderAsLink.value ? __props.rel : void 0,
				style: rootStyle.value,
				target: renderAsLink.value ? __props.target : void 0,
				to: isCustomLink.value ? __props.href : void 0,
				type: renderAsLink.value ? void 0 : __props.type,
				value: renderAsLink.value ? void 0 : __props.value,
				onBlur: unref(buttonTooltip).onBlur,
				onClick: handleRootClick,
				onFocus: unref(buttonTooltip).onFocus,
				onKeydown: handleRootKeydown,
				onPointerdown: unref(buttonTooltip).onPointerDown,
				onPointerenter: unref(buttonTooltip).onPointerEnter,
				onPointerleave: unref(buttonTooltip).onPointerLeave
			}), {
				default: withCtx(() => [
					isLoadingState.value ? (openBlock(), createElementBlock("span", _hoisted_1, [createVNode(_sfc_main$1, { label: __props.loadingLabel }, null, 8, ["label"])])) : createCommentVNode("v-if", true),
					createElementVNode("span", {
						class: "astryx-button__content",
						"aria-hidden": isLoadingState.value || void 0
					}, [
						_ctx.$slots.icon ? (openBlock(), createElementBlock("span", _hoisted_3, [renderSlot(_ctx.$slots, "icon")])) : createCommentVNode("v-if", true),
						!__props.isIconOnly ? (openBlock(), createElementBlock("span", _hoisted_4, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(__props.label), 1)])])) : createCommentVNode("v-if", true),
						!__props.isIconOnly && _ctx.$slots.end ? (openBlock(), createElementBlock("span", _hoisted_5, [renderSlot(_ctx.$slots, "end")])) : createCommentVNode("v-if", true)
					], 8, _hoisted_2),
					createVNode(_sfc_main$2, {
						role: "status",
						"aria-live": "polite"
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(isLoadingState.value ? __props.loadingLabel : ""), 1)]),
						_: 1
					}),
					hasTooltip.value ? (openBlock(), createBlock(_sfc_main$3, {
						key: 1,
						id: tooltipId,
						anchor: element.value,
						open: unref(buttonTooltip).isOpen.value,
						text: __props.tooltip ?? "",
						onPointerEnter: unref(buttonTooltip).onTooltipPointerEnter,
						onPointerLeave: unref(buttonTooltip).onTooltipPointerLeave
					}, null, 8, [
						"anchor",
						"open",
						"text",
						"onPointerEnter",
						"onPointerLeave"
					])) : createCommentVNode("v-if", true)
				]),
				_: 3
			}, 16, [
				"aria-busy",
				"aria-describedby",
				"aria-disabled",
				"aria-label",
				"class",
				"data-astryx-edge-comp",
				"data-delay-spinner",
				"data-elevation",
				"data-icon-only",
				"data-size",
				"data-variant",
				"disabled",
				"form",
				"href",
				"name",
				"rel",
				"style",
				"target",
				"to",
				"type",
				"value",
				"onBlur",
				"onFocus",
				"onPointerdown",
				"onPointerenter",
				"onPointerleave"
			]);
		};
	}
});
//#endregion
export { buttonGroupContextKey as i, _sfc_main$1 as n, useButtonTooltip as r, _sfc_main as t };
