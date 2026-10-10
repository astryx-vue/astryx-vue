import { n as getFocusables } from "./focus-CpficIgf.CTu7RTTj.js";
import { Fragment, computed, createCommentVNode, createElementBlock, createElementVNode, defineComponent, mergeProps, normalizeStyle, onBeforeUnmount, onMounted, onScopeDispose, openBlock, provide, ref, renderSlot, useAttrs, useId, useTemplateRef, watch } from "vue";
//#region ../../packages/core/dist/composables-DKsSTAci.js
/**
* 在容器内陷阱键盘焦点，按 Tab 时循环聚焦容器内的可聚焦元素。
* 用于模态对话框、抽屉等需要限制焦点范围的浮层组件。
*/
function useFocusTrap(options) {
	const { container, isEnabled, initialFocus } = options;
	function onKeyDown(event) {
		if (event.key !== "Tab" || !isEnabled.value) return;
		const el = container.value;
		if (!el || !el.contains(event.target)) return;
		const focusables = getFocusables(el);
		if (focusables.length === 0) {
			event.preventDefault();
			return;
		}
		const first = focusables[0];
		const last = focusables[focusables.length - 1];
		const active = document.activeElement;
		if (event.shiftKey && active === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && active === last) {
			event.preventDefault();
			first.focus();
		}
	}
	function update() {}
	function focusFirst() {
		const el = container.value;
		if (!el) return;
		const focusables = getFocusables(el);
		if (focusables.length > 0) focusables[0].focus();
	}
	function focusLast() {
		const el = container.value;
		if (!el) return;
		const focusables = getFocusables(el);
		if (focusables.length > 0) focusables[focusables.length - 1].focus();
	}
	function setup() {
		document.addEventListener("keydown", onKeyDown, true);
	}
	function teardown() {
		document.removeEventListener("keydown", onKeyDown, true);
	}
	watch(isEnabled, (enabled) => {
		if (enabled) {
			setup();
			const target = initialFocus?.();
			if (target) target.focus();
			else focusFirst();
		} else teardown();
	}, { immediate: true });
	onScopeDispose(teardown);
	return {
		update,
		focusFirst,
		focusLast
	};
}
/**
* 在浮层组件打开时保存当前焦点元素，关闭时恢复焦点。
* 用于对话框、抽屉、弹出菜单等浮层组件。
*/
function useRestoreFocus(options) {
	const { isEnabled, shouldRestore } = options;
	let savedElement = null;
	function save() {
		if (!isEnabled.value) return;
		const active = document.activeElement;
		if (active instanceof HTMLElement) savedElement = active;
	}
	function restore() {
		if (!isEnabled.value || !savedElement) return;
		if (savedElement.isConnected && !savedElement.hasAttribute("disabled")) savedElement.focus();
		savedElement = null;
	}
	watch(shouldRestore, (should) => {
		if (should) save();
		else if (isEnabled.value && savedElement) restore();
	});
	onScopeDispose(() => {
		savedElement = null;
	});
	return {
		save,
		restore
	};
}
//#endregion
//#region ../../packages/core/dist/Dialog-DyPGsNoL.js
var DIALOG_CONTEXT_KEY = Symbol("astryx-dialog");
function formatPosition(value) {
	return typeof value === "number" ? `${value}px` : value;
}
/**
* 把 {@link DialogPosition} 映射为 CSS 偏移。未设置的偏移回退为 `auto`。
*/
function resolveDialogPositionOffsets(position) {
	const { top, bottom, start, end } = position;
	return {
		top: top !== void 0 ? formatPosition(top) : "auto",
		bottom: bottom !== void 0 ? formatPosition(bottom) : "auto",
		insetInlineStart: start !== void 0 ? formatPosition(start) : "auto",
		insetInlineEnd: end !== void 0 ? formatPosition(end) : "auto"
	};
}
function formatDialogSize(value) {
	return typeof value === "number" ? `${value}px` : value;
}
var _hoisted_1 = [
	"data-variant",
	"data-padded",
	"aria-labelledby"
];
var _hoisted_2 = [
	"data-variant",
	"data-padded",
	"role",
	"aria-labelledby"
];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxDialog",
	inheritAttrs: false,
	__name: "Dialog",
	props: {
		isOpen: { type: Boolean },
		isInline: {
			type: Boolean,
			default: false
		},
		width: { default: 400 },
		maxHeight: { default: "75vh" },
		position: { default: void 0 },
		variant: { default: "standard" },
		purpose: { default: "info" },
		padding: { default: void 0 }
	},
	emits: ["openChange"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const attrs = useAttrs();
		const titleId = `astryx-dialog-title-${useId()}`;
		const hasTitle = ref(false);
		const isInlineRef = computed(() => props.isInline);
		provide(DIALOG_CONTEXT_KEY, {
			titleId,
			isInline: isInlineRef,
			registerTitle: (isMounted) => {
				hasTitle.value = isMounted;
			}
		});
		const dialogRef = useTemplateRef("dialogRef");
		let triggerElement = null;
		let previousBodyOverflow = null;
		const isFullscreen = computed(() => props.variant === "fullscreen");
		const dialogRole = computed(() => attrs.role ?? (props.purpose === "required" ? "alertdialog" : void 0));
		const rootStyle = computed(() => {
			if (isFullscreen.value) return void 0;
			const style = {
				width: formatDialogSize(props.width),
				maxHeight: formatDialogSize(props.maxHeight)
			};
			if (props.position) {
				const offsets = resolveDialogPositionOffsets(props.position);
				style.margin = "0";
				style.top = offsets.top;
				style.bottom = offsets.bottom;
				style.insetInlineStart = offsets.insetInlineStart;
				style.insetInlineEnd = offsets.insetInlineEnd;
			}
			return style;
		});
		const innerStyle = computed(() => {
			if (props.padding == null) return void 0;
			return { "--_dialog-padding": `var(--astryx-spacing-${paddingToken(props.padding)})` };
		});
		function paddingToken(value) {
			return String(value).replace(".", "-");
		}
		/** 对话框未设置 aria-label 或 aria-labelledby 时，才使用标题作为默认名称。 */
		function resolvedLabelledBy() {
			if (attrs["aria-labelledby"] != null) return attrs["aria-labelledby"];
			if (attrs["aria-label"] != null) return void 0;
			return hasTitle.value ? titleId : void 0;
		}
		function rootAttrs() {
			const { "aria-labelledby": _labelledBy, ...rest } = attrs;
			return rest;
		}
		function getDialogDirection(trigger, distance = 16) {
			const rect = trigger.getBoundingClientRect();
			const dx = rect.left + rect.width / 2 - window.innerWidth / 2;
			const dy = rect.top + rect.height / 2 - window.innerHeight / 2;
			const length = Math.sqrt(dx * dx + dy * dy) || 1;
			return {
				x: Math.round(dx / length * distance),
				y: Math.round(dy / length * distance)
			};
		}
		function applyEntryDirection(dialog) {
			const trigger = triggerElement;
			if (trigger && trigger !== document.body) {
				const direction = getDialogDirection(trigger);
				dialog.style.setProperty("--dialog-dir-x", `${direction.x}px`);
				dialog.style.setProperty("--dialog-dir-y", `${direction.y}px`);
				return;
			}
			dialog.style.setProperty("--dialog-dir-x", "0px");
			dialog.style.setProperty("--dialog-dir-y", "16px");
		}
		function lockScroll() {
			if (previousBodyOverflow !== null) return;
			previousBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
		}
		function unlockScroll() {
			if (previousBodyOverflow === null) return;
			document.body.style.overflow = previousBodyOverflow;
			previousBodyOverflow = null;
		}
		const isDialogOpen = computed(() => {
			if (props.isInline) return false;
			return dialogRef.value?.open ?? false;
		});
		const shouldRestoreFocus = computed(() => isDialogOpen.value);
		useFocusTrap({
			container: dialogRef,
			isEnabled: isDialogOpen,
			initialFocus: () => {
				const dialog = dialogRef.value;
				if (!dialog) return null;
				return dialog.querySelector("[data-autofocus]") ?? dialog.querySelector("[data-dialog-default-focus]") ?? null;
			}
		});
		useRestoreFocus({
			isEnabled: ref(true),
			shouldRestore: shouldRestoreFocus
		});
		function openDialog() {
			if (props.isInline) return;
			const dialog = dialogRef.value;
			if (!dialog || dialog.open) return;
			triggerElement = document.activeElement;
			applyEntryDirection(dialog);
			dialog.showModal();
			lockScroll();
		}
		function closeDialog() {
			if (props.isInline) return;
			const dialog = dialogRef.value;
			if (dialog?.open) dialog.close();
			unlockScroll();
		}
		function onCancel(event) {
			event.preventDefault();
			if (props.purpose !== "required") emit("openChange", false);
		}
		function onBackdropClick(event) {
			if (event.target === event.currentTarget && props.purpose === "info") emit("openChange", false);
		}
		watch(() => props.isOpen, (open) => {
			if (open) openDialog();
			else closeDialog();
		});
		onMounted(() => {
			if (props.isOpen) openDialog();
		});
		onBeforeUnmount(() => {
			unlockScroll();
		});
		return (_ctx, _cache) => {
			return __props.isInline ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [__props.isOpen ? (openBlock(), createElementBlock("div", mergeProps({ key: 0 }, rootAttrs(), {
				class: ["astryx-dialog astryx-dialog--inline", { "astryx-dialog--fullscreen": isFullscreen.value }],
				"data-variant": __props.variant,
				"data-padded": __props.padding == null ? void 0 : "",
				"aria-labelledby": resolvedLabelledBy(),
				style: rootStyle.value
			}), [createElementVNode("div", {
				class: "astryx-dialog__inner",
				style: normalizeStyle(innerStyle.value)
			}, [renderSlot(_ctx.$slots, "default")], 4)], 16, _hoisted_1)) : createCommentVNode("v-if", true)], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createCommentVNode(" eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 遮罩点击只作用于原生 dialog 元素本身；Escape 由原生 cancel 事件处理。 "), createElementVNode("dialog", mergeProps({
				ref_key: "dialogRef",
				ref: dialogRef
			}, rootAttrs(), {
				class: ["astryx-dialog", { "astryx-dialog--fullscreen": isFullscreen.value }],
				"data-variant": __props.variant,
				"data-padded": __props.padding == null ? void 0 : "",
				role: dialogRole.value,
				"aria-modal": "true",
				"aria-labelledby": resolvedLabelledBy(),
				style: rootStyle.value,
				onClick: onBackdropClick,
				onCancel
			}), [createElementVNode("div", {
				class: "astryx-dialog__inner",
				style: normalizeStyle(innerStyle.value)
			}, [renderSlot(_ctx.$slots, "default")], 4)], 16, _hoisted_2)], 2112));
		};
	}
});
//#endregion
export { _sfc_main as n, DIALOG_CONTEXT_KEY as t };
