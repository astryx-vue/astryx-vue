import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$1 } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { r as isFocusable } from "./focus-CpficIgf.CTu7RTTj.js";
import { t as _sfc_main$2 } from "./Text-CKd7e3gK.CukfIJwc.js";
import { n as _sfc_main$1$1 } from "./Avatar-CEU50QJE.BuB-Q2bY.js";
import { r as _sfc_main$2$1, t as _sfc_main$3 } from "./Stack-iv52y_Jv.C5zk9p8n.js";
import { t as usePositionedLayer } from "./usePositionedLayer-C1NBOsVT.CqLwBJaO.js";
import { t as _sfc_main$4 } from "./Link-CprjOuTI.Dzy3pVDJ.js";
import { Fragment, Teleport, Transition, computed, createBlock, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeProps, normalizeStyle, onBeforeUnmount, onMounted, onUpdated, openBlock, ref, renderSlot, toDisplayString, unref, useId, useSSRContext, vShow, watch, withCtx, withDirectives } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region ../../packages/core/dist/HoverCard-EhbWaGOW.js
var _hoisted_1 = [
	"role",
	"aria-label",
	"data-placement"
];
var _hoisted_2 = { class: "astryx-hover-card__content" };
var GAP = 4;
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxHoverCard",
	inheritAttrs: false,
	__name: "HoverCard",
	props: {
		content: { default: "" },
		placement: { default: "above" },
		alignment: { default: "center" },
		delay: { default: 300 },
		hideDelay: { default: 200 },
		focusTrigger: { default: "auto" },
		touchTrigger: { default: "auto" },
		isEnabled: {
			type: Boolean,
			default: true
		},
		label: { default: void 0 },
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
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const TOUCH_POINTER_TYPES = /* @__PURE__ */ new Set(["touch", "pen"]);
		const EXPANDABLE_ROLES = /* @__PURE__ */ new Set([
			"application",
			"button",
			"checkbox",
			"columnheader",
			"combobox",
			"gridcell",
			"link",
			"listbox",
			"menuitem",
			"menuitemcheckbox",
			"menuitemradio",
			"row",
			"rowheader",
			"switch",
			"tab",
			"treeitem"
		]);
		const BUTTON_INPUT_TYPES = /* @__PURE__ */ new Set([
			"button",
			"submit",
			"reset",
			"image"
		]);
		const ACTION_ROLES = /* @__PURE__ */ new Set([
			"button",
			"checkbox",
			"combobox",
			"link",
			"menuitem",
			"menuitemcheckbox",
			"menuitemradio",
			"option",
			"radio",
			"searchbox",
			"slider",
			"spinbutton",
			"switch",
			"tab",
			"textbox"
		]);
		function supportsAriaExpanded(element) {
			const explicit = element.getAttribute("role")?.trim().split(/\s+/)[0];
			if (explicit) return EXPANDABLE_ROLES.has(explicit);
			switch (element.tagName) {
				case "BUTTON":
				case "SUMMARY": return true;
				case "A":
				case "AREA": return element.hasAttribute("href");
				case "INPUT": return BUTTON_INPUT_TYPES.has(element.type?.toLowerCase());
				case "SELECT": return true;
				default: return false;
			}
		}
		function isEditable(element) {
			if (element.isContentEditable === true) return true;
			const attribute = element.getAttribute("contenteditable");
			return attribute != null && attribute !== "false";
		}
		function isActionTrigger(element) {
			const role = element.getAttribute("role");
			if (role != null && role !== "") return ACTION_ROLES.has(role);
			switch (element.tagName) {
				case "BUTTON":
				case "INPUT":
				case "LABEL":
				case "SELECT":
				case "SUMMARY":
				case "TEXTAREA": return true;
				case "A":
				case "AREA": return element.hasAttribute("href");
				default: return isEditable(element);
			}
		}
		function mergeIds(...ids) {
			const kept = ids.filter(Boolean);
			return kept.length > 0 ? kept.join(" ") : void 0;
		}
		let lastModality = "keyboard";
		function onModalityPointerDown() {
			lastModality = "pointer";
		}
		function onModalityKeyDown(event) {
			if (event.metaKey || event.altKey || event.ctrlKey) return;
			lastModality = "keyboard";
		}
		const cardId = `astryx-hover-card-${useId()}`;
		const wrapperRef = ref(null);
		const surfaceRef = ref(null);
		const triggerRef = ref(null);
		const isVisible = ref(false);
		const isTextTrigger = ref(false);
		const isControlled = computed(() => props.isOpen !== void 0);
		const isDialog = computed(() => props.label != null && props.label !== "");
		const showIndication = computed(() => props.hasHoverIndication === true || props.hasHoverIndication === "auto" && isTextTrigger.value);
		const { position, detach: detachPosition } = usePositionedLayer({
			anchor: triggerRef,
			layer: surfaceRef,
			isOpen: isVisible,
			placement: computed(() => props.placement),
			alignment: computed(() => props.alignment),
			gap: GAP
		});
		const surfaceStyle = computed(() => ({
			top: `${position.value.top}px`,
			left: `${position.value.left}px`
		}));
		const element = computed(() => surfaceRef.value);
		let trigger = null;
		let describedByBefore = null;
		let haspopupBefore = null;
		let controlsBefore = null;
		let expandedBefore = null;
		let canExpand = false;
		let isHoveringContent = false;
		let isTouchPointer = false;
		let isEscapeDismissing = false;
		let showTimer;
		let hideTimer;
		function clearTimers() {
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
			showTimer = void 0;
			hideTimer = void 0;
		}
		function setOpen(next) {
			if (isVisible.value === next) return;
			isVisible.value = next;
			emit("openChange", next);
		}
		function showNow() {
			clearTimers();
			if (!props.isEnabled) return;
			setOpen(true);
		}
		function hideNow() {
			clearTimers();
			isHoveringContent = false;
			if (isControlled.value) return;
			setOpen(false);
		}
		function scheduleShow() {
			if (!props.isEnabled || isControlled.value) return;
			clearTimers();
			showTimer = setTimeout(() => {
				showTimer = void 0;
				setOpen(true);
			}, props.delay);
		}
		function scheduleHide() {
			if (isControlled.value) return;
			clearTimers();
			hideTimer = setTimeout(() => {
				hideTimer = void 0;
				if (!isHoveringContent) setOpen(false);
			}, props.hideDelay);
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
		function onPointerDown(event) {
			const isTouch = TOUCH_POINTER_TYPES.has(event.pointerType);
			isTouchPointer = isTouch;
			if (!isTouch || isControlled.value) return;
			if ((props.touchTrigger === "auto" ? trigger != null && isActionTrigger(trigger) ? "none" : "tap" : props.touchTrigger) === "none" || !props.isEnabled) {
				hideNow();
				return;
			}
			if (isVisible.value) hideNow();
			else showNow();
		}
		function onFocusIn() {
			if (!props.isEnabled) return;
			if (isTouchPointer && lastModality === "pointer") return;
			if (isEscapeDismissing) {
				isEscapeDismissing = false;
				return;
			}
			showNow();
		}
		function onFocusOut(event) {
			const related = event.relatedTarget;
			if (related && surfaceRef.value?.contains(related)) return;
			scheduleHide();
		}
		function onContentMouseEnter() {
			if (isTouchPointer) return;
			isHoveringContent = true;
			clearTimers();
		}
		function onContentMouseLeave() {
			if (isTouchPointer) return;
			isHoveringContent = false;
			scheduleHide();
		}
		function onContentFocusOut(event) {
			const related = event.relatedTarget;
			if (related && surfaceRef.value?.contains(related)) return;
			if (related && triggerRef.value?.contains(related)) return;
			scheduleHide();
		}
		function onDocumentKeydown(event) {
			if (event.key !== "Escape" || !isVisible.value) return;
			clearTimers();
			isHoveringContent = false;
			if (isControlled.value) {
				emit("openChange", false);
				return;
			}
			const hadFocus = surfaceRef.value?.contains(document.activeElement) ?? false;
			setOpen(false);
			if (hadFocus && triggerRef.value) {
				isEscapeDismissing = true;
				triggerRef.value.focus();
			}
		}
		function onDocumentPointerDown(event) {
			if (!TOUCH_POINTER_TYPES.has(event.pointerType) || !isVisible.value || isControlled.value) return;
			const target = event.target;
			if (triggerRef.value?.contains(target) || surfaceRef.value?.contains(target)) return;
			hideNow();
		}
		function applyTriggerAttributes() {
			const active = triggerRef.value;
			if (!active) return;
			if (isDialog.value) {
				active.setAttribute("aria-haspopup", "dialog");
				if (isVisible.value) active.setAttribute("aria-controls", mergeIds(controlsBefore, cardId) ?? "");
				else if (controlsBefore) active.setAttribute("aria-controls", controlsBefore);
				else active.removeAttribute("aria-controls");
				if (canExpand) active.setAttribute("aria-expanded", String(isVisible.value));
				else if (expandedBefore) active.setAttribute("aria-expanded", expandedBefore);
				else active.removeAttribute("aria-expanded");
				return;
			}
			active.setAttribute("aria-describedby", mergeIds(describedByBefore, cardId) ?? "");
		}
		function restoreTriggerAttributes() {
			const active = triggerRef.value;
			if (!active) return;
			if (describedByBefore) active.setAttribute("aria-describedby", describedByBefore);
			else active.removeAttribute("aria-describedby");
			if (haspopupBefore) active.setAttribute("aria-haspopup", haspopupBefore);
			else active.removeAttribute("aria-haspopup");
			if (controlsBefore) active.setAttribute("aria-controls", controlsBefore);
			else active.removeAttribute("aria-controls");
			if (expandedBefore) active.setAttribute("aria-expanded", expandedBefore);
			else active.removeAttribute("aria-expanded");
		}
		function shouldListenFocus(target) {
			return props.focusTrigger === "always" || props.focusTrigger === "auto" && isFocusable(target);
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
			describedByBefore = next.getAttribute("aria-describedby");
			haspopupBefore = next.getAttribute("aria-haspopup");
			controlsBefore = next.getAttribute("aria-controls");
			expandedBefore = next.getAttribute("aria-expanded");
			canExpand = supportsAriaExpanded(next);
			next.addEventListener("pointerenter", onPointerEnter);
			next.addEventListener("mouseenter", onMouseEnter);
			next.addEventListener("mouseleave", onMouseLeave);
			next.addEventListener("pointerdown", onPointerDown);
			if (shouldListenFocus(next)) {
				next.addEventListener("focusin", onFocusIn);
				next.addEventListener("focusout", onFocusOut);
			}
			applyTriggerAttributes();
		}
		function unbindTrigger() {
			if (!trigger) return;
			trigger.removeEventListener("pointerenter", onPointerEnter);
			trigger.removeEventListener("mouseenter", onMouseEnter);
			trigger.removeEventListener("mouseleave", onMouseLeave);
			trigger.removeEventListener("pointerdown", onPointerDown);
			trigger.removeEventListener("focusin", onFocusIn);
			trigger.removeEventListener("focusout", onFocusOut);
			restoreTriggerAttributes();
			trigger = null;
			triggerRef.value = null;
			describedByBefore = null;
			haspopupBefore = null;
			controlsBefore = null;
			expandedBefore = null;
			canExpand = false;
		}
		function show() {
			showNow();
		}
		function hide() {
			clearTimers();
			isHoveringContent = false;
			setOpen(false);
		}
		__expose({
			element,
			show,
			hide
		});
		watch(isVisible, (visible) => {
			applyTriggerAttributes();
			if (visible) {
				document.addEventListener("keydown", onDocumentKeydown);
				document.addEventListener("pointerdown", onDocumentPointerDown, true);
				return;
			}
			document.removeEventListener("keydown", onDocumentKeydown);
			document.removeEventListener("pointerdown", onDocumentPointerDown, true);
		});
		watch(() => props.isOpen, (open) => {
			clearTimers();
			if (open === void 0) return;
			setOpen(open);
		});
		watch(() => props.isEnabled, (enabled) => {
			if (!enabled) hideNow();
		});
		onMounted(() => {
			document.addEventListener("pointerdown", onModalityPointerDown, {
				capture: true,
				passive: true
			});
			document.addEventListener("keydown", onModalityKeyDown, {
				capture: true,
				passive: true
			});
			bindTrigger();
			if (props.isOpen !== void 0) isVisible.value = props.isOpen;
			else if (props.isDefaultOpen) setOpen(true);
		});
		onUpdated(bindTrigger);
		onBeforeUnmount(() => {
			clearTimers();
			unbindTrigger();
			detachPosition();
			document.removeEventListener("pointerdown", onModalityPointerDown, true);
			document.removeEventListener("keydown", onModalityKeyDown, true);
			document.removeEventListener("keydown", onDocumentKeydown);
			document.removeEventListener("pointerdown", onDocumentPointerDown, true);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("span", mergeProps({
				ref_key: "wrapperRef",
				ref: wrapperRef
			}, _ctx.$attrs, { class: ["astryx-hover-card__trigger", {
				"astryx-hover-card__trigger--text": isTextTrigger.value,
				"astryx-hover-card__trigger--indicated": isTextTrigger.value && showIndication.value
			}] }), [renderSlot(_ctx.$slots, "default")], 16), (openBlock(), createBlock(Teleport, { to: "body" }, [createVNode(Transition, {
				name: "astryx-hover-card",
				persisted: ""
			}, {
				default: withCtx(() => [withDirectives(createElementVNode("div", {
					id: cardId,
					ref_key: "surfaceRef",
					ref: surfaceRef,
					class: "astryx-hover-card",
					role: isDialog.value ? "dialog" : "group",
					"aria-label": isDialog.value ? __props.label : void 0,
					"data-placement": unref(position).placement,
					style: normalizeStyle(surfaceStyle.value),
					onMouseenter: onContentMouseEnter,
					onMouseleave: onContentMouseLeave,
					onFocusout: onContentFocusOut
				}, [createElementVNode("div", _hoisted_2, [renderSlot(_ctx.$slots, "content", {}, () => [createTextVNode(toDisplayString(__props.content), 1)])])], 44, _hoisted_1), [[vShow, isVisible.value]])]),
				_: 3
			})]))], 64);
		};
	}
});
//#endregion
//#region components/demos/hover-card/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "hover-card-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$2), null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main), {
							delay: 150,
							"hide-delay": 250,
							label: "@dana"
						}, {
							content: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(_sfc_main$3), { gap: 3 }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(ssrRenderComponent(unref(_sfc_main$2$1), {
												align: "start",
												gap: 3
											}, {
												default: withCtx((_, _push, _parent, _scopeId) => {
													if (_push) {
														_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Dana Whitfield" }, null, _parent, _scopeId));
														_push(ssrRenderComponent(unref(_sfc_main$3), { gap: 1 }, {
															default: withCtx((_, _push, _parent, _scopeId) => {
																if (_push) {
																	_push(ssrRenderComponent(unref(_sfc_main$2), { weight: "medium" }, {
																		default: withCtx((_, _push, _parent, _scopeId) => {
																			if (_push) _push(` Dana Whitfield `);
																			else return [createTextVNode(" Dana Whitfield ")];
																		}),
																		_: 1
																	}, _parent, _scopeId));
																	_push(ssrRenderComponent(unref(_sfc_main$2), {
																		type: "supporting",
																		color: "secondary"
																	}, {
																		default: withCtx((_, _push, _parent, _scopeId) => {
																			if (_push) _push(` @dana `);
																			else return [createTextVNode(" @dana ")];
																		}),
																		_: 1
																	}, _parent, _scopeId));
																} else return [createVNode(unref(_sfc_main$2), { weight: "medium" }, {
																	default: withCtx(() => [createTextVNode(" Dana Whitfield ")]),
																	_: 1
																}), createVNode(unref(_sfc_main$2), {
																	type: "supporting",
																	color: "secondary"
																}, {
																	default: withCtx(() => [createTextVNode(" @dana ")]),
																	_: 1
																})];
															}),
															_: 1
														}, _parent, _scopeId));
													} else return [createVNode(unref(_sfc_main$1$1), { name: "Dana Whitfield" }), createVNode(unref(_sfc_main$3), { gap: 1 }, {
														default: withCtx(() => [createVNode(unref(_sfc_main$2), { weight: "medium" }, {
															default: withCtx(() => [createTextVNode(" Dana Whitfield ")]),
															_: 1
														}), createVNode(unref(_sfc_main$2), {
															type: "supporting",
															color: "secondary"
														}, {
															default: withCtx(() => [createTextVNode(" @dana ")]),
															_: 1
														})]),
														_: 1
													})];
												}),
												_: 1
											}, _parent, _scopeId));
											_push(ssrRenderComponent(unref(_sfc_main$2), { color: "secondary" }, {
												default: withCtx((_, _push, _parent, _scopeId) => {
													if (_push) _push(` Porting a design system to Vue, one component at a time. `);
													else return [createTextVNode(" Porting a design system to Vue, one component at a time. ")];
												}),
												_: 1
											}, _parent, _scopeId));
											_push(ssrRenderComponent(unref(_sfc_main$2$1), { gap: 2 }, {
												default: withCtx((_, _push, _parent, _scopeId) => {
													if (_push) {
														_push(ssrRenderComponent(unref(_sfc_main$1), {
															label: "Follow",
															size: "sm",
															variant: "primary"
														}, null, _parent, _scopeId));
														_push(ssrRenderComponent(unref(_sfc_main$1), {
															label: "Message",
															size: "sm",
															variant: "secondary"
														}, null, _parent, _scopeId));
													} else return [createVNode(unref(_sfc_main$1), {
														label: "Follow",
														size: "sm",
														variant: "primary"
													}), createVNode(unref(_sfc_main$1), {
														label: "Message",
														size: "sm",
														variant: "secondary"
													})];
												}),
												_: 1
											}, _parent, _scopeId));
										} else return [
											createVNode(unref(_sfc_main$2$1), {
												align: "start",
												gap: 3
											}, {
												default: withCtx(() => [createVNode(unref(_sfc_main$1$1), { name: "Dana Whitfield" }), createVNode(unref(_sfc_main$3), { gap: 1 }, {
													default: withCtx(() => [createVNode(unref(_sfc_main$2), { weight: "medium" }, {
														default: withCtx(() => [createTextVNode(" Dana Whitfield ")]),
														_: 1
													}), createVNode(unref(_sfc_main$2), {
														type: "supporting",
														color: "secondary"
													}, {
														default: withCtx(() => [createTextVNode(" @dana ")]),
														_: 1
													})]),
													_: 1
												})]),
												_: 1
											}),
											createVNode(unref(_sfc_main$2), { color: "secondary" }, {
												default: withCtx(() => [createTextVNode(" Porting a design system to Vue, one component at a time. ")]),
												_: 1
											}),
											createVNode(unref(_sfc_main$2$1), { gap: 2 }, {
												default: withCtx(() => [createVNode(unref(_sfc_main$1), {
													label: "Follow",
													size: "sm",
													variant: "primary"
												}), createVNode(unref(_sfc_main$1), {
													label: "Message",
													size: "sm",
													variant: "secondary"
												})]),
												_: 1
											})
										];
									}),
									_: 1
								}, _parent, _scopeId));
								else return [createVNode(unref(_sfc_main$3), { gap: 3 }, {
									default: withCtx(() => [
										createVNode(unref(_sfc_main$2$1), {
											align: "start",
											gap: 3
										}, {
											default: withCtx(() => [createVNode(unref(_sfc_main$1$1), { name: "Dana Whitfield" }), createVNode(unref(_sfc_main$3), { gap: 1 }, {
												default: withCtx(() => [createVNode(unref(_sfc_main$2), { weight: "medium" }, {
													default: withCtx(() => [createTextVNode(" Dana Whitfield ")]),
													_: 1
												}), createVNode(unref(_sfc_main$2), {
													type: "supporting",
													color: "secondary"
												}, {
													default: withCtx(() => [createTextVNode(" @dana ")]),
													_: 1
												})]),
												_: 1
											})]),
											_: 1
										}),
										createVNode(unref(_sfc_main$2), { color: "secondary" }, {
											default: withCtx(() => [createTextVNode(" Porting a design system to Vue, one component at a time. ")]),
											_: 1
										}),
										createVNode(unref(_sfc_main$2$1), { gap: 2 }, {
											default: withCtx(() => [createVNode(unref(_sfc_main$1), {
												label: "Follow",
												size: "sm",
												variant: "primary"
											}), createVNode(unref(_sfc_main$1), {
												label: "Message",
												size: "sm",
												variant: "secondary"
											})]),
											_: 1
										})
									]),
									_: 1
								})];
							}),
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(_sfc_main$4), { href: "#" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` @dana `);
										else return [createTextVNode(" @dana ")];
									}),
									_: 1
								}, _parent, _scopeId));
								else return [createVNode(unref(_sfc_main$4), { href: "#" }, {
									default: withCtx(() => [createTextVNode(" @dana ")]),
									_: 1
								})];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(` shared a preview of the new card layout. `);
					} else return [createVNode(unref(_sfc_main), {
						delay: 150,
						"hide-delay": 250,
						label: "@dana"
					}, {
						content: withCtx(() => [createVNode(unref(_sfc_main$3), { gap: 3 }, {
							default: withCtx(() => [
								createVNode(unref(_sfc_main$2$1), {
									align: "start",
									gap: 3
								}, {
									default: withCtx(() => [createVNode(unref(_sfc_main$1$1), { name: "Dana Whitfield" }), createVNode(unref(_sfc_main$3), { gap: 1 }, {
										default: withCtx(() => [createVNode(unref(_sfc_main$2), { weight: "medium" }, {
											default: withCtx(() => [createTextVNode(" Dana Whitfield ")]),
											_: 1
										}), createVNode(unref(_sfc_main$2), {
											type: "supporting",
											color: "secondary"
										}, {
											default: withCtx(() => [createTextVNode(" @dana ")]),
											_: 1
										})]),
										_: 1
									})]),
									_: 1
								}),
								createVNode(unref(_sfc_main$2), { color: "secondary" }, {
									default: withCtx(() => [createTextVNode(" Porting a design system to Vue, one component at a time. ")]),
									_: 1
								}),
								createVNode(unref(_sfc_main$2$1), { gap: 2 }, {
									default: withCtx(() => [createVNode(unref(_sfc_main$1), {
										label: "Follow",
										size: "sm",
										variant: "primary"
									}), createVNode(unref(_sfc_main$1), {
										label: "Message",
										size: "sm",
										variant: "secondary"
									})]),
									_: 1
								})
							]),
							_: 1
						})]),
						default: withCtx(() => [createVNode(unref(_sfc_main$4), { href: "#" }, {
							default: withCtx(() => [createTextVNode(" @dana ")]),
							_: 1
						})]),
						_: 1
					}), createTextVNode(" shared a preview of the new card layout. ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/hover-card/basic.vue
var _sfc_setup$3 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/hover-card/basic.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/hover-card/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Avatar } from '@astryx-vue/core/Avatar'\nimport { Button } from '@astryx-vue/core/Button'\nimport { HoverCard } from '@astryx-vue/core/HoverCard'\nimport { Link } from '@astryx-vue/core/Link'\nimport { HStack, VStack } from '@astryx-vue/core/Stack'\nimport { Text } from '@astryx-vue/core/Text'\n<\/script>\n\n<template>\n  <div class=\"hover-card-preview\">\n    <Text>\n      <HoverCard :delay=\"150\" :hide-delay=\"250\" label=\"@dana\">\n        <Link href=\"#\">\n          @dana\n        </Link>\n        <template #content>\n          <VStack :gap=\"3\">\n            <HStack align=\"start\" :gap=\"3\">\n              <Avatar name=\"Dana Whitfield\" />\n              <VStack :gap=\"1\">\n                <Text weight=\"medium\">\n                  Dana Whitfield\n                </Text>\n                <Text type=\"supporting\" color=\"secondary\">\n                  @dana\n                </Text>\n              </VStack>\n            </HStack>\n            <Text color=\"secondary\">\n              Porting a design system to Vue, one component at a time.\n            </Text>\n            <HStack :gap=\"2\">\n              <Button label=\"Follow\" size=\"sm\" variant=\"primary\" />\n              <Button label=\"Message\" size=\"sm\" variant=\"secondary\" />\n            </HStack>\n          </VStack>\n        </template>\n      </HoverCard>\n      shared a preview of the new card layout.\n    </Text>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Avatar } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Avatar'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HoverCard } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/HoverCard'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Link } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Link'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HStack, VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"hover-card-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HoverCard</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">delay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">150</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">hide-delay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">250</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"@dana\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> href</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"#\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          @dana</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Link</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Dana Whitfield\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">1</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">                &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> weight</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"medium\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">                  Dana Whitfield</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">                &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">                &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">                  @dana</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">                &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              Porting a design system to Vue, one component at a time.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Follow\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"primary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Message\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HoverCard</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      shared a preview of the new card layout.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/hover-card/controlled.vue?vue&type=script&setup=true&lang.ts
var controlled_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "controlled",
	__ssrInlineRender: true,
	setup(__props) {
		const isOpen = ref(true);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "hover-card-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$2$1), {
				align: "center",
				gap: 3
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main), {
							label: "Pinned details",
							"is-open": isOpen.value,
							onOpenChange: ($event) => isOpen.value = $event
						}, {
							content: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), { type: "supporting" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` A controlled card ignores hover and focus. It stays open until isOpen changes, and pressing Escape only asks for that change. `);
										else return [createTextVNode(" A controlled card ignores hover and focus. It stays open until isOpen changes, and pressing Escape only asks for that change. ")];
									}),
									_: 1
								}, _parent, _scopeId));
								else return [createVNode(unref(_sfc_main$2), { type: "supporting" }, {
									default: withCtx(() => [createTextVNode(" A controlled card ignores hover and focus. It stays open until isOpen changes, and pressing Escape only asks for that change. ")]),
									_: 1
								})];
							}),
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Pinned details `);
								else return [createTextVNode(" Pinned details ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), {
							label: isOpen.value ? "Close card" : "Open card",
							variant: "secondary",
							onClick: ($event) => isOpen.value = !isOpen.value
						}, null, _parent, _scopeId));
					} else return [createVNode(unref(_sfc_main), {
						label: "Pinned details",
						"is-open": isOpen.value,
						onOpenChange: ($event) => isOpen.value = $event
					}, {
						content: withCtx(() => [createVNode(unref(_sfc_main$2), { type: "supporting" }, {
							default: withCtx(() => [createTextVNode(" A controlled card ignores hover and focus. It stays open until isOpen changes, and pressing Escape only asks for that change. ")]),
							_: 1
						})]),
						default: withCtx(() => [createTextVNode(" Pinned details ")]),
						_: 1
					}, 8, ["is-open", "onOpenChange"]), createVNode(unref(_sfc_main$1), {
						label: isOpen.value ? "Close card" : "Open card",
						variant: "secondary",
						onClick: ($event) => isOpen.value = !isOpen.value
					}, null, 8, ["label", "onClick"])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/hover-card/controlled.vue
var _sfc_setup$2 = controlled_vue_vue_type_script_setup_true_lang_default.setup;
controlled_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/hover-card/controlled.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var controlled_default$1 = controlled_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/hover-card/controlled.vue?raw&highlighted
var controlled_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { HoverCard } from '@astryx-vue/core/HoverCard'\nimport { HStack } from '@astryx-vue/core/Stack'\nimport { Text } from '@astryx-vue/core/Text'\nimport { ref } from 'vue'\n\nconst isOpen = ref(true)\n<\/script>\n\n<template>\n  <div class=\"hover-card-preview\">\n    <HStack align=\"center\" :gap=\"3\">\n      <HoverCard label=\"Pinned details\" :is-open=\"isOpen\" @open-change=\"isOpen = $event\">\n        Pinned details\n        <template #content>\n          <Text type=\"supporting\">\n            A controlled card ignores hover and focus. It stays open until isOpen changes, and pressing Escape only asks for that change.\n          </Text>\n        </template>\n      </HoverCard>\n      <Button :label=\"isOpen ? 'Close card' : 'Open card'\" variant=\"secondary\" @click=\"isOpen = !isOpen\" />\n    </HStack>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HoverCard } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/HoverCard'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> isOpen</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"hover-card-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"center\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HoverCard</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Pinned details\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">is-open</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">open-change</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> $event</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        Pinned details</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            A controlled card ignores hover and focus. It stays open until isOpen changes, and pressing Escape only asks for that change.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HoverCard</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">?</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Close card'</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> :</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Open card'\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> !</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/hover-card/overview.vue?vue&type=script&setup=true&lang.ts
var overview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "overview",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "hover-card-preview" }, _attrs))}><div class="astryx-hover-card hover-card-preview__surface"><div class="astryx-hover-card__content">`);
			_push(ssrRenderComponent(unref(_sfc_main$2$1), {
				align: "start",
				gap: 3
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Dana Whitfield" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$3), { gap: 1 }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(unref(_sfc_main$2), { weight: "medium" }, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Dana Whitfield `);
											else return [createTextVNode(" Dana Whitfield ")];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(unref(_sfc_main$2), {
										type: "supporting",
										color: "secondary"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Design systems engineer `);
											else return [createTextVNode(" Design systems engineer ")];
										}),
										_: 1
									}, _parent, _scopeId));
								} else return [createVNode(unref(_sfc_main$2), { weight: "medium" }, {
									default: withCtx(() => [createTextVNode(" Dana Whitfield ")]),
									_: 1
								}), createVNode(unref(_sfc_main$2), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Design systems engineer ")]),
									_: 1
								})];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode(unref(_sfc_main$1$1), { name: "Dana Whitfield" }), createVNode(unref(_sfc_main$3), { gap: 1 }, {
						default: withCtx(() => [createVNode(unref(_sfc_main$2), { weight: "medium" }, {
							default: withCtx(() => [createTextVNode(" Dana Whitfield ")]),
							_: 1
						}), createVNode(unref(_sfc_main$2), {
							type: "supporting",
							color: "secondary"
						}, {
							default: withCtx(() => [createTextVNode(" Design systems engineer ")]),
							_: 1
						})]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				delay: 150,
				label: "Dana Whitfield"
			}, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$2$1), {
						align: "start",
						gap: 3
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(ssrRenderComponent(unref(_sfc_main$1$1), { name: "Dana Whitfield" }, null, _parent, _scopeId));
								_push(ssrRenderComponent(unref(_sfc_main$3), { gap: 1 }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(ssrRenderComponent(unref(_sfc_main$2), { weight: "medium" }, {
												default: withCtx((_, _push, _parent, _scopeId) => {
													if (_push) _push(` Dana Whitfield `);
													else return [createTextVNode(" Dana Whitfield ")];
												}),
												_: 1
											}, _parent, _scopeId));
											_push(ssrRenderComponent(unref(_sfc_main$2), {
												type: "supporting",
												color: "secondary"
											}, {
												default: withCtx((_, _push, _parent, _scopeId) => {
													if (_push) _push(` Design systems engineer `);
													else return [createTextVNode(" Design systems engineer ")];
												}),
												_: 1
											}, _parent, _scopeId));
										} else return [createVNode(unref(_sfc_main$2), { weight: "medium" }, {
											default: withCtx(() => [createTextVNode(" Dana Whitfield ")]),
											_: 1
										}), createVNode(unref(_sfc_main$2), {
											type: "supporting",
											color: "secondary"
										}, {
											default: withCtx(() => [createTextVNode(" Design systems engineer ")]),
											_: 1
										})];
									}),
									_: 1
								}, _parent, _scopeId));
							} else return [createVNode(unref(_sfc_main$1$1), { name: "Dana Whitfield" }), createVNode(unref(_sfc_main$3), { gap: 1 }, {
								default: withCtx(() => [createVNode(unref(_sfc_main$2), { weight: "medium" }, {
									default: withCtx(() => [createTextVNode(" Dana Whitfield ")]),
									_: 1
								}), createVNode(unref(_sfc_main$2), {
									type: "supporting",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Design systems engineer ")]),
									_: 1
								})]),
								_: 1
							})];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$2$1), {
						align: "start",
						gap: 3
					}, {
						default: withCtx(() => [createVNode(unref(_sfc_main$1$1), { name: "Dana Whitfield" }), createVNode(unref(_sfc_main$3), { gap: 1 }, {
							default: withCtx(() => [createVNode(unref(_sfc_main$2), { weight: "medium" }, {
								default: withCtx(() => [createTextVNode(" Dana Whitfield ")]),
								_: 1
							}), createVNode(unref(_sfc_main$2), {
								type: "supporting",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Design systems engineer ")]),
								_: 1
							})]),
							_: 1
						})]),
						_: 1
					})];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Dana Whitfield `);
					else return [createTextVNode(" Dana Whitfield ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/hover-card/overview.vue
var _sfc_setup$1 = overview_vue_vue_type_script_setup_true_lang_default.setup;
overview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/hover-card/overview.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var overview_default$1 = overview_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/hover-card/overview.vue?raw&highlighted
var overview_default = {
	"source": "<script setup lang=\"ts\">\nimport { Avatar } from '@astryx-vue/core/Avatar'\nimport { HoverCard } from '@astryx-vue/core/HoverCard'\nimport { HStack, VStack } from '@astryx-vue/core/Stack'\nimport { Text } from '@astryx-vue/core/Text'\n<\/script>\n\n<template>\n  <div class=\"hover-card-preview\">\n    <div class=\"astryx-hover-card hover-card-preview__surface\">\n      <div class=\"astryx-hover-card__content\">\n        <HStack align=\"start\" :gap=\"3\">\n          <Avatar name=\"Dana Whitfield\" />\n          <VStack :gap=\"1\">\n            <Text weight=\"medium\">\n              Dana Whitfield\n            </Text>\n            <Text type=\"supporting\" color=\"secondary\">\n              Design systems engineer\n            </Text>\n          </VStack>\n        </HStack>\n      </div>\n    </div>\n    <HoverCard :delay=\"150\" label=\"Dana Whitfield\">\n      Dana Whitfield\n      <template #content>\n        <HStack align=\"start\" :gap=\"3\">\n          <Avatar name=\"Dana Whitfield\" />\n          <VStack :gap=\"1\">\n            <Text weight=\"medium\">\n              Dana Whitfield\n            </Text>\n            <Text type=\"supporting\" color=\"secondary\">\n              Design systems engineer\n            </Text>\n          </VStack>\n        </HStack>\n      </template>\n    </HoverCard>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Avatar } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Avatar'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HoverCard } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/HoverCard'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HStack, VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"hover-card-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"astryx-hover-card hover-card-preview__surface\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"astryx-hover-card__content\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Dana Whitfield\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">1</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> weight</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"medium\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              Dana Whitfield</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              Design systems engineer</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HoverCard</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">delay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">150</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Dana Whitfield\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Dana Whitfield</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Avatar</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Dana Whitfield\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">1</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> weight</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"medium\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              Dana Whitfield</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">              Design systems engineer</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HoverCard</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/hover-card/placements.vue?vue&type=script&setup=true&lang.ts
var placements_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "placements",
	__ssrInlineRender: true,
	setup(__props) {
		const placements = [
			{
				placement: "above",
				label: "Placement above"
			},
			{
				placement: "below",
				label: "Placement below"
			},
			{
				placement: "start",
				label: "Placement start"
			},
			{
				placement: "end",
				label: "Placement end"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "hover-card-preview" }, _attrs))}><div class="hover-card-preview__placements"><!--[-->`);
			ssrRenderList(placements, (item) => {
				_push(ssrRenderComponent(unref(_sfc_main), {
					key: item.placement,
					delay: 100,
					label: item.label,
					placement: item.placement
				}, {
					content: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), { type: "supporting" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` This card prefers the ${ssrInterpolate(item.placement)} side of its trigger and flips when there is no room. `);
								else return [createTextVNode(" This card prefers the " + toDisplayString(item.placement) + " side of its trigger and flips when there is no room. ", 1)];
							}),
							_: 2
						}, _parent, _scopeId));
						else return [createVNode(unref(_sfc_main$2), { type: "supporting" }, {
							default: withCtx(() => [createTextVNode(" This card prefers the " + toDisplayString(item.placement) + " side of its trigger and flips when there is no room. ", 1)]),
							_: 2
						}, 1024)];
					}),
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(item.label)} `);
						else return [createTextVNode(toDisplayString(item.label) + " ", 1)];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div></div>`);
		};
	}
});
//#endregion
//#region components/demos/hover-card/placements.vue
var _sfc_setup = placements_vue_vue_type_script_setup_true_lang_default.setup;
placements_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/hover-card/placements.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var placements_default$1 = placements_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/hover-card/placements.vue?raw&highlighted
var placements_default = {
	"source": "<script setup lang=\"ts\">\nimport type { HoverCardPlacement } from '@astryx-vue/core/HoverCard'\nimport { HoverCard } from '@astryx-vue/core/HoverCard'\nimport { Text } from '@astryx-vue/core/Text'\n\nconst placements: { placement: HoverCardPlacement, label: string }[] = [\n  { placement: 'above', label: 'Placement above' },\n  { placement: 'below', label: 'Placement below' },\n  { placement: 'start', label: 'Placement start' },\n  { placement: 'end', label: 'Placement end' },\n]\n<\/script>\n\n<template>\n  <div class=\"hover-card-preview\">\n    <div class=\"hover-card-preview__placements\">\n      <HoverCard\n        v-for=\"item in placements\"\n        :key=\"item.placement\"\n        :delay=\"100\"\n        :label=\"item.label\"\n        :placement=\"item.placement\"\n      >\n        {{ item.label }}\n        <template #content>\n          <Text type=\"supporting\">\n            This card prefers the {{ item.placement }} side of its trigger and flips when there is no room.\n          </Text>\n        </template>\n      </HoverCard>\n    </div>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HoverCardPlacement } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/HoverCard'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HoverCard } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/HoverCard'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> placements</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { </span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">placement</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> HoverCardPlacement</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">label</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> string</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { placement: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'above'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Placement above'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { placement: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'below'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Placement below'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { placement: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'start'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Placement start'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { placement: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'end'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Placement end'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"hover-card-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"hover-card-preview__placements\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HoverCard</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">        v-for</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">item </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">in</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> placements</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">key</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">item.placement</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">delay</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">100</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">item.label</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">placement</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">item.placement</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        {{ item.label }}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"supporting\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            This card prefers the {{ item.placement }} side of its trigger and flips when there is no room.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HoverCard</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/hover-card/index.ts
var options = { className: "hover-card-preview" };
var hoverCardOverview = defineDemo(overview_default$1, overview_default, options);
var hoverCardBasic = defineDemo(basic_default$1, basic_default, options);
var hoverCardPlacements = defineDemo(placements_default$1, placements_default, options);
var hoverCardControlled = defineDemo(controlled_default$1, controlled_default, options);
//#endregion
export { hoverCardPlacements as i, hoverCardControlled as n, hoverCardOverview as r, hoverCardBasic as t };
