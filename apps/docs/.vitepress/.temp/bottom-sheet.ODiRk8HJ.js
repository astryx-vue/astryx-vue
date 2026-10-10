import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$2 } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { t as _sfc_main$3 } from "./Heading-Dugosn6j.Cm6J24eA.js";
import { t as _sfc_main$4 } from "./Text-CKd7e3gK.CukfIJwc.js";
import { r as _sfc_main$2$2, t as _sfc_main$5 } from "./Stack-iv52y_Jv.C5zk9p8n.js";
import { n as _sfc_main$1$6, t as _sfc_main$7 } from "./ListItem-pGxvn6QJ.Do9DWm4p.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeModels, mergeProps, nextTick, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, onUpdated, openBlock, ref, renderList, renderSlot, toValue, unref, useAttrs, useModel, useSSRContext, useTemplateRef, watch, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region ../../packages/core/dist/BottomSheet-CF91Vs3y.js
/** Scrim opacity at the peek stop: dimmed, never clear, because the sheet stays modal. */
var MIN_PEEK_SCRIM_OPACITY = .3;
var SNAP_POINT_PATTERN = /^(\d+(?:\.\d+)?|\.\d+)(px|%)$/i;
function parseSnapPoint(point, viewportPx) {
	if (typeof point === "number") return Number.isFinite(point) && point > 0 && point <= 1 ? point * viewportPx : null;
	const match = SNAP_POINT_PATTERN.exec(point.trim());
	if (match === null) return null;
	const value = Number.parseFloat(match[1]);
	if (!(value > 0)) return null;
	return match[2].toLowerCase() === "%" ? value / 100 * viewportPx : value;
}
/** Resolves snap points to candidate visible heights in px, dropping unusable ones. */
function resolveSnapPoints(points, viewportPx) {
	const heights = [];
	for (const point of points) {
		const height = parseSnapPoint(point, viewportPx);
		if (height !== null) heights.push(height);
	}
	return heights;
}
/**
* Resting offsets from fully open, ascending and de-duplicated. `0` is always
* the first stop; only heights shorter than the sheet become collapsed stops;
* offsets closer than `dedupPx` collapse to the taller one.
*/
function computeDetentOffsets(sheetHeight, detentHeights, dedupPx = 48) {
	const ascending = [0, ...detentHeights.filter((height) => height > 0 && height < sheetHeight).map((height) => sheetHeight - height)].sort((a, b) => a - b);
	const deduped = [];
	for (const offset of ascending) {
		const last = deduped[deduped.length - 1];
		if (last === void 0 || offset - last >= dedupPx) deduped.push(offset);
	}
	return deduped;
}
/** Nearest value in `offsets` to `value`; `offsets` must not be empty. */
function nearestOffset(value, offsets) {
	return offsets.reduce((best, offset) => Math.abs(offset - value) < Math.abs(best - value) ? offset : best, offsets[0]);
}
/**
* The peek stop's offset, or `null` when this sheet has no peek. A peek is the
* shortest stop and a sliver: a sheet that keeps the full layout height and
* slides below the viewport instead of reflowing its content into a sliver.
*/
function peekOffsetFor(offsets, visibleSheetHeight) {
	if (offsets.length < 2 || visibleSheetHeight <= 0) return null;
	const shortest = offsets[offsets.length - 1];
	return visibleSheetHeight - shortest <= .25 * visibleSheetHeight ? shortest : null;
}
/**
* Scrim opacity (1 = fully opaque) for a drag or settle `offset`. It stays
* opaque down to the shortest working stop and only thins past it, onto a peek
* or out through the dismissal overshoot.
*/
function scrimOpacityForOffset(offset, offsets, dismissOffset, peekOffset) {
	const hasPeek = peekOffset !== null;
	const fadeStart = hasPeek ? offsets[offsets.length - 2] : offsets[offsets.length - 1];
	const fadeEnd = hasPeek ? peekOffset : dismissOffset;
	const floor = hasPeek ? MIN_PEEK_SCRIM_OPACITY : 0;
	if (offset <= fadeStart) return 1;
	if (offset >= fadeEnd) return floor;
	return 1 - (1 - floor) * ((offset - fadeStart) / (fadeEnd - fadeStart));
}
/**
* Settle target for a released drag, restricted to the drag direction so a
* committed drag never snaps back past where it started. `dir`: 1 = dragged
* down, -1 = up, 0 = neither.
*/
function resolveSettleOffset(value, offsets, dir, baseOffset) {
	let candidates = offsets;
	if (dir > 0) {
		const downward = offsets.filter((offset) => offset >= baseOffset);
		if (downward.length > 0) candidates = downward;
	} else if (dir < 0) {
		const upward = offsets.filter((offset) => offset <= baseOffset);
		if (upward.length > 0) candidates = upward;
	}
	return nearestOffset(value, candidates);
}
/** The visible height of the sheet at a resting `offset`. */
function visibleHeightForOffset(sheetHeight, offset, offscreenBlockEndInset) {
	return Math.max(0, sheetHeight - offscreenBlockEndInset - offset);
}
/** A throw this fast, over at least `FLICK_MIN_DISTANCE`, dismisses or expands outright. */
var FLICK_VELOCITY = 1.2;
var FLICK_MIN_DISTANCE = 48;
/** Below the shortest stop, dragging past it by this share of its height dismisses. */
var DISMISS_OVERSHOOT_RATIO = .4;
/** Within this many px of a stop the live drag eases toward it. */
var MAGNET_RANGE = 40;
/** Rubber-band factor and ceiling for dragging above the fully open position. */
var OVERSCROLL_RESISTANCE = .35;
var OVERSCROLL_MAX = 48;
/** How far a finger on the body must pull before it becomes a sheet drag. */
var DRAG_PROMOTION_SLOP = 8;
var VELOCITY_WINDOW_MS = 100;
var BACKSTOP_BUFFER_MS = 50;
function parseTransitionTime(value) {
	const normalized = value.trim();
	if (!/^-?(?:\d+|\d*\.\d+)(?:ms|s)$/.test(normalized)) return null;
	const time = Number.parseFloat(normalized);
	return normalized.endsWith("ms") ? time : time * 1e3;
}
/** Longest transition duration + delay that applies to `property`, in ms. */
function transitionMsFor(element, property) {
	const style = getComputedStyle(element);
	const properties = (style.transitionProperty || "").split(",").map((value) => value.trim());
	const durations = (style.transitionDuration || "").split(",").map(parseTransitionTime);
	const delays = (style.transitionDelay || "").split(",").map((value) => parseTransitionTime(value) ?? 0);
	return properties.reduce((longest, name, index) => {
		if (name !== property && name !== "all") return longest;
		const duration = durations[index % durations.length];
		if (duration == null) return longest;
		return Math.max(longest, duration + (delays[index % delays.length] ?? 0));
	}, 0);
}
/**
* Calls `complete` when `element` finishes transitioning `property`: on the
* matching `transitionend`/`transitioncancel`, or on a timer backstop so a
* missed event can never strand the caller. Without a resolved duration — the
* case in a stylesheet-free test environment — it completes immediately.
*/
function waitForTransition(element, property, complete) {
	if (element == null) {
		complete();
		return () => {};
	}
	let done = false;
	let timer = null;
	let onTransitionEnd = () => {};
	const finish = () => {
		if (done) return;
		done = true;
		if (timer != null) clearTimeout(timer);
		element.removeEventListener("transitionend", onTransitionEnd);
		element.removeEventListener("transitioncancel", onTransitionEnd);
		complete();
	};
	onTransitionEnd = (event) => {
		if (event.target === element && event.propertyName === property) finish();
	};
	const duration = transitionMsFor(element, property);
	if (duration <= 0) {
		finish();
		return () => {};
	}
	element.addEventListener("transitionend", onTransitionEnd);
	element.addEventListener("transitioncancel", onTransitionEnd);
	timer = setTimeout(finish, duration + BACKSTOP_BUFFER_MS);
	return () => {
		if (timer != null) clearTimeout(timer);
		element.removeEventListener("transitionend", onTransitionEnd);
		element.removeEventListener("transitioncancel", onTransitionEnd);
	};
}
function magnetize(value, targets) {
	if (targets.length === 0) return value;
	let nearest = targets[0];
	for (const target of targets) if (Math.abs(target - value) < Math.abs(nearest - value)) nearest = target;
	const distance = Math.abs(value - nearest);
	if (distance >= MAGNET_RANGE) return value;
	const t = distance / MAGNET_RANGE;
	return value + (nearest - value) * (1 - t * t);
}
function renderedBlockEndPadding(element) {
	const value = Number.parseFloat(getComputedStyle(element).paddingBlockEnd);
	return Number.isFinite(value) ? value : 0;
}
/** How much further the body could scroll on its own, ignoring the inset this hook adds. */
function naturalEndGapFor(body) {
	if (!body) return 0;
	const inset = renderedBlockEndPadding(body);
	return Math.max(0, body.scrollHeight - body.clientHeight - inset) - body.scrollTop;
}
function hapticTick() {
	if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
	if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
	navigator.vibrate(8);
}
/** Drag, snap, and settle behavior of the sheet panel. */
function useSheetGestures(options) {
	const { panel, body, isOpen, canDismiss, getSnapHeights, onScrimOpacity, onSnap, onDismiss } = options;
	const isDragging = ref(false);
	const isReconciling = ref(false);
	const isOverflowing = ref(false);
	const dragOffset = ref(0);
	const settledOffset = ref(0);
	const settledLayoutOffset = ref(0);
	const scrollPreservationInset = ref(0);
	const scrimOpacity = ref(1);
	const sheetHeight = ref(0);
	let dragState = null;
	let pendingBody = null;
	let reconcileToken = 0;
	let observer = null;
	const activeOffset = computed(() => isDragging.value ? dragOffset.value : settledOffset.value);
	function measureNaturalHeight() {
		const element = panel.value;
		if (!element) return 0;
		const inlineHeight = element.style.height;
		if (inlineHeight === "") return element.getBoundingClientRect().height;
		element.style.height = "";
		const height = element.getBoundingClientRect().height;
		element.style.height = inlineHeight;
		return height;
	}
	function resolveDetents() {
		const measured = measureNaturalHeight();
		if (measured > 0) sheetHeight.value = measured;
		const height = measured > 0 ? measured : sheetHeight.value;
		const visible = visibleHeightForOffset(height, 0, 48);
		const offsets = computeDetentOffsets(visible, getSnapHeights());
		return {
			height,
			offsets,
			peekOffset: peekOffsetFor(offsets, visible)
		};
	}
	function dismissOffsetFor(detents) {
		const maxOffset = detents.offsets[detents.offsets.length - 1] ?? 0;
		return maxOffset + visibleHeightForOffset(detents.height, maxOffset, 48) * DISMISS_OVERSHOOT_RATIO;
	}
	async function reconcileLayout(targetLayoutOffset) {
		const token = ++reconcileToken;
		isReconciling.value = true;
		await nextTick();
		if (token !== reconcileToken) return;
		settledLayoutOffset.value = targetLayoutOffset;
		await nextTick();
		if (token !== reconcileToken) return;
		isReconciling.value = false;
		scrollPreservationInset.value = 0;
	}
	function settleAt(target, fromOffset, detents) {
		const targetLayoutOffset = target === detents.peekOffset ? 0 : target;
		const dismissOffset = dismissOffsetFor(detents);
		settledOffset.value = target;
		scrollPreservationInset.value = Math.max(0, fromOffset - targetLayoutOffset - naturalEndGapFor(body.value));
		scrimOpacity.value = scrimOpacityForOffset(target, detents.offsets, dismissOffset, detents.peekOffset);
		onScrimOpacity(scrimOpacity.value);
		onSnap(visibleHeightForOffset(detents.height, target, 48));
		if (target !== fromOffset) hapticTick();
		if (targetLayoutOffset === settledLayoutOffset.value && !isReconciling.value) return;
		reconcileLayout(targetLayoutOffset);
	}
	function dismissOrSettleShortest(fromOffset, detents) {
		if (canDismiss.value) {
			settledOffset.value = fromOffset;
			dragOffset.value = fromOffset;
			scrimOpacity.value = 1;
			onScrimOpacity(1);
			onDismiss();
			return;
		}
		settleAt(detents.offsets[detents.offsets.length - 1] ?? 0, fromOffset, detents);
	}
	function velocityFor(state) {
		const first = state.samples.filter((sample) => state.lastT - sample.t <= VELOCITY_WINDOW_MS)[0] ?? {
			y: state.startY,
			t: state.startT
		};
		const elapsed = state.lastT - first.t;
		return elapsed > 0 ? (state.lastY - first.y) / elapsed : 0;
	}
	function updateDrag(clientY, timeStamp) {
		const state = dragState;
		if (!state) return;
		const delta = clientY - state.startY;
		state.lastY = clientY;
		state.lastT = timeStamp;
		state.samples.push({
			y: clientY,
			t: timeStamp
		});
		state.travel = Math.max(state.travel, Math.abs(delta));
		state.dir = delta === 0 ? 0 : Math.sign(delta);
		let offset = state.baseOffset + delta;
		if (offset < 0) offset = -Math.min(-offset * OVERSCROLL_RESISTANCE, OVERSCROLL_MAX);
		state.rawOffset = offset;
		dragOffset.value = magnetize(offset, state.offsets);
		scrimOpacity.value = scrimOpacityForOffset(offset, state.offsets, dismissOffsetFor(state), state.peekOffset);
		onScrimOpacity(scrimOpacity.value);
	}
	function beginDrag(pointerId, clientY, timeStamp) {
		dragState = {
			...resolveDetents(),
			pointerId,
			startY: clientY,
			startT: timeStamp,
			lastY: clientY,
			lastT: timeStamp,
			samples: [{
				y: clientY,
				t: timeStamp
			}],
			baseOffset: settledOffset.value,
			baseLayoutOffset: settledLayoutOffset.value,
			rawOffset: settledOffset.value,
			dir: 0,
			travel: 0
		};
		dragOffset.value = settledOffset.value;
		isDragging.value = true;
	}
	function endDrag() {
		const state = dragState;
		dragState = null;
		detachPointerListeners();
		if (!state) return;
		isDragging.value = false;
		const velocity = velocityFor(state);
		const isFlick = Math.abs(velocity) > FLICK_VELOCITY && state.travel > FLICK_MIN_DISTANCE;
		if (state.dir > 0 && isFlick) {
			dismissOrSettleShortest(state.baseOffset, state);
			return;
		}
		if (state.dir < 0 && isFlick) {
			settleAt(0, state.baseOffset, state);
			return;
		}
		if (state.rawOffset > dismissOffsetFor(state)) {
			dismissOrSettleShortest(state.baseOffset, state);
			return;
		}
		settleAt(resolveSettleOffset(state.rawOffset, state.offsets, state.dir, state.baseOffset), state.baseOffset, state);
	}
	function cancelDrag() {
		const state = dragState;
		pendingBody = null;
		dragState = null;
		detachPointerListeners();
		if (!state) return;
		isDragging.value = false;
		dragOffset.value = state.baseOffset;
		settledOffset.value = state.baseOffset;
		scrimOpacity.value = scrimOpacityForOffset(state.baseOffset, state.offsets, dismissOffsetFor(state), state.peekOffset);
		onScrimOpacity(scrimOpacity.value);
	}
	function onPointerMove(event) {
		if (dragState != null) {
			if (dragState.pointerId !== event.pointerId) return;
			if (event.cancelable) event.preventDefault();
			updateDrag(event.clientY, event.timeStamp);
			return;
		}
		const pending = pendingBody;
		if (pending == null || pending.pointerId !== event.pointerId) return;
		const delta = event.clientY - pending.startY;
		if (Math.abs(delta) < DRAG_PROMOTION_SLOP) return;
		const pullingDown = delta > 0 && pending.atTop;
		const pullingUp = delta < 0 && pending.atBottom && activeOffset.value > 0;
		if (!pullingDown && !pullingUp) {
			pendingBody = null;
			detachPointerListeners();
			return;
		}
		pendingBody = null;
		beginDrag(pending.pointerId, pending.startY, event.timeStamp);
		if (event.cancelable) event.preventDefault();
		updateDrag(event.clientY, event.timeStamp);
	}
	function onPointerUp(event) {
		if (dragState != null && dragState.pointerId !== event.pointerId) return;
		pendingBody = null;
		if (dragState == null) {
			detachPointerListeners();
			return;
		}
		endDrag();
	}
	function onPointerCancel(event) {
		if (dragState != null && dragState.pointerId !== event.pointerId) return;
		cancelDrag();
	}
	function attachPointerListeners() {
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
		window.addEventListener("pointercancel", onPointerCancel);
	}
	function detachPointerListeners() {
		window.removeEventListener("pointermove", onPointerMove);
		window.removeEventListener("pointerup", onPointerUp);
		window.removeEventListener("pointercancel", onPointerCancel);
	}
	function onHandlePointerDown(event) {
		if (event.button != null && event.button !== 0) return;
		attachPointerListeners();
		beginDrag(event.pointerId, event.clientY, event.timeStamp);
		if (event.cancelable) event.preventDefault();
	}
	function onBodyPointerDown(event) {
		if (event.pointerType === "touch") return;
		if (event.button != null && event.button !== 0) return;
		const element = body.value;
		if (!element) return;
		pendingBody = {
			pointerId: event.pointerId,
			startY: event.clientY,
			atTop: element.scrollTop <= 0,
			atBottom: element.scrollTop + element.clientHeight >= element.scrollHeight - 1
		};
		attachPointerListeners();
	}
	let touchArming = null;
	function onTouchStart(event) {
		const touch = event.changedTouches[0];
		const element = body.value;
		if (!touch || !element) {
			touchArming = null;
			return;
		}
		touchArming = {
			identifier: touch.identifier,
			startY: touch.clientY,
			atTop: element.scrollTop <= 0,
			atBottom: element.scrollTop + element.clientHeight >= element.scrollHeight - 1
		};
	}
	function onTouchMove(event) {
		const element = body.value;
		if (dragState != null) {
			const touch = Array.from(event.changedTouches).find((item) => item.identifier === dragState?.pointerId);
			if (!touch) return;
			if (event.cancelable) event.preventDefault();
			updateDrag(touch.clientY, event.timeStamp);
			return;
		}
		const arming = touchArming;
		if (arming == null || !element) return;
		const touch = Array.from(event.changedTouches).find((item) => item.identifier === arming.identifier);
		if (!touch) return;
		const delta = touch.clientY - arming.startY;
		if (Math.abs(delta) < DRAG_PROMOTION_SLOP) return;
		const pullingDown = delta > 0 && arming.atTop;
		const pullingUp = delta < 0 && arming.atBottom && activeOffset.value > 0;
		if (!pullingDown && !pullingUp) {
			touchArming = null;
			return;
		}
		touchArming = null;
		if (event.cancelable) event.preventDefault();
		beginDrag(arming.identifier, arming.startY, event.timeStamp);
		updateDrag(touch.clientY, event.timeStamp);
	}
	function onTouchEnd(event) {
		const arming = touchArming;
		if (arming != null && Array.from(event.changedTouches).some((item) => item.identifier === arming.identifier)) touchArming = null;
		if (dragState != null && Array.from(event.changedTouches).some((item) => item.identifier === dragState?.pointerId)) endDrag();
	}
	function updateOverflow() {
		const element = body.value;
		isOverflowing.value = element != null && (element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1);
	}
	function recordSheetHeight() {
		if (isDragging.value || settledLayoutOffset.value > 0 || isReconciling.value) return;
		const height = panel.value?.getBoundingClientRect().height ?? 0;
		if (height > 0) sheetHeight.value = height;
	}
	watch(panel, (element) => {
		observer?.disconnect();
		observer = null;
		if (!element || typeof ResizeObserver === "undefined") return;
		observer = new ResizeObserver(() => {
			recordSheetHeight();
			updateOverflow();
		});
		observer.observe(element);
		recordSheetHeight();
	}, { immediate: true });
	watch(body, (element, previous) => {
		if (previous) {
			previous.removeEventListener("touchstart", onTouchStart);
			previous.removeEventListener("touchmove", onTouchMove);
			previous.removeEventListener("touchend", onTouchEnd);
			previous.removeEventListener("touchcancel", onTouchEnd);
		}
		if (!element) return;
		element.addEventListener("touchstart", onTouchStart, { passive: true });
		element.addEventListener("touchmove", onTouchMove, { passive: false });
		element.addEventListener("touchend", onTouchEnd);
		element.addEventListener("touchcancel", onTouchEnd);
		updateOverflow();
	}, { immediate: true });
	watch(isOpen, (open) => {
		++reconcileToken;
		cancelDrag();
		isReconciling.value = false;
		scrollPreservationInset.value = 0;
		if (!open) {
			dragState = null;
			pendingBody = null;
			touchArming = null;
			return;
		}
		dragOffset.value = 0;
		settledOffset.value = 0;
		settledLayoutOffset.value = 0;
		scrimOpacity.value = 1;
		nextTick(recordSheetHeight);
	});
	watch(canDismiss, (allowed) => {
		if (!allowed) cancelDrag();
	});
	const onWindowBlur = () => cancelDrag();
	if (typeof window !== "undefined") window.addEventListener("blur", onWindowBlur);
	onBeforeUnmount(() => {
		detachPointerListeners();
		observer?.disconnect();
		observer = null;
		if (typeof window !== "undefined") window.removeEventListener("blur", onWindowBlur);
	});
	return {
		isDragging,
		isReconciling,
		isOverflowing,
		panelTransform: computed(() => {
			const layoutOffset = isDragging.value ? dragOffset.value < settledOffset.value ? 0 : settledLayoutOffset.value : settledLayoutOffset.value;
			const translation = activeOffset.value - layoutOffset;
			return translation !== 0 ? `translateY(${translation}px)` : void 0;
		}),
		panelHeight: computed(() => {
			const layoutOffset = isDragging.value ? dragOffset.value < settledOffset.value ? 0 : settledLayoutOffset.value : settledLayoutOffset.value;
			if (layoutOffset <= 0 || sheetHeight.value <= 0) return void 0;
			return `${Math.max(0, sheetHeight.value - layoutOffset)}px`;
		}),
		scrollPreservationInset,
		scrimOpacity,
		onHandlePointerDown,
		onBodyPointerDown,
		updateOverflow
	};
}
var _hoisted_1$1 = [
	"data-state",
	"data-height",
	"data-dragging",
	"data-reconciling"
];
var _hoisted_2$1 = [
	"data-keyboard",
	"tabindex",
	"role",
	"aria-label"
];
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "AstryxBottomSheetPanel",
	__name: "BottomSheetPanel",
	props: {
		state: {},
		label: {},
		height: { default: "capped" },
		padding: { default: void 0 },
		snapPoints: { default: void 0 },
		isSwipeDismissAllowed: {
			type: Boolean,
			default: true
		}
	},
	emits: [
		"dismiss",
		"scrimOpacity",
		"motionStart",
		"motionComplete",
		"snap"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const HEIGHT_BUDGETS = {
			hug: "92dvh",
			capped: "62dvh",
			tall: "92dvh"
		};
		const panel = useTemplateRef("panel");
		const body = useTemplateRef("body");
		const isInteractive = computed(() => props.state === "open");
		const heightKind = computed(() => {
			const height = props.height;
			return height === "hug" || height === "capped" || height === "tall" ? height : "custom";
		});
		const budget = computed(() => {
			const height = props.height;
			if (typeof height === "string" && height in HEIGHT_BUDGETS) return HEIGHT_BUDGETS[height];
			return typeof height === "number" ? `${height}px` : height;
		});
		const gestures = useSheetGestures({
			panel,
			body,
			isOpen: isInteractive,
			canDismiss: computed(() => props.isSwipeDismissAllowed),
			getSnapHeights: () => {
				const points = props.snapPoints;
				if (!points?.length || typeof window === "undefined") return [];
				return resolveSnapPoints(points, window.innerHeight);
			},
			onScrimOpacity: (opacity) => emit("scrimOpacity", opacity),
			onSnap: (visibleHeight) => emit("snap", visibleHeight),
			onDismiss: () => emit("dismiss")
		});
		const contentStyle = computed(() => {
			if (props.padding == null) return void 0;
			return { "--_sheet-padding": `var(--astryx-spacing-${String(props.padding).replace(".", "-")})` };
		});
		const panelStyle = computed(() => {
			const style = { "--_sheet-budget": budget.value };
			if (isInteractive.value) {
				style.transform = gestures.panelTransform.value;
				style.height = gestures.panelHeight.value;
			} else if (props.state === "exiting") style.height = gestures.panelHeight.value;
			return style;
		});
		const bodyStyle = computed(() => {
			const inset = gestures.scrollPreservationInset.value;
			return inset > 0 ? { paddingBlockEnd: `${inset}px` } : void 0;
		});
		const overflowTabStop = computed(() => isInteractive.value && gestures.isOverflowing.value);
		let cancelMotionWait = null;
		function waitForMotion(motion) {
			cancelMotionWait?.();
			emit("motionStart", motion);
			cancelMotionWait = waitForTransition(panel.value, "transform", () => {
				cancelMotionWait = null;
				emit("motionComplete", motion);
			});
		}
		watch(() => props.state, (state) => {
			if (state === "open" || state === "exiting") waitForMotion(state === "open" ? "entering" : "exiting");
			else cancelMotionWait?.();
		}, { flush: "post" });
		onMounted(() => {
			gestures.updateOverflow();
		});
		onUpdated(() => {
			gestures.updateOverflow();
		});
		__expose({
			element: computed(() => panel.value ?? null),
			focus: (options) => panel.value?.focus(options),
			blur: () => panel.value?.blur()
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "panel",
				ref: panel,
				class: "astryx-bottom-sheet",
				"data-state": __props.state,
				"data-height": heightKind.value,
				"data-dragging": unref(gestures).isDragging.value || void 0,
				"data-reconciling": unref(gestures).isReconciling.value || void 0,
				style: normalizeStyle(panelStyle.value),
				tabindex: "-1"
			}, [createElementVNode("div", {
				class: "astryx-bottom-sheet__handle",
				"aria-hidden": "true",
				onPointerdown: _cache[0] || (_cache[0] = (...args) => unref(gestures).onHandlePointerDown && unref(gestures).onHandlePointerDown(...args))
			}, [..._cache[2] || (_cache[2] = [createElementVNode("div", { class: "astryx-bottom-sheet__handle-pill" }, null, -1)])], 32), createElementVNode("div", {
				ref_key: "body",
				ref: body,
				class: "astryx-bottom-sheet__body",
				"data-keyboard": __props.height === "tall" ? "tall" : void 0,
				tabindex: overflowTabStop.value ? 0 : void 0,
				role: overflowTabStop.value ? "group" : void 0,
				"aria-label": overflowTabStop.value ? __props.label : void 0,
				style: normalizeStyle(bodyStyle.value),
				onPointerdown: _cache[1] || (_cache[1] = (...args) => unref(gestures).onBodyPointerDown && unref(gestures).onBodyPointerDown(...args))
			}, [createElementVNode("div", {
				class: "astryx-bottom-sheet__content",
				style: normalizeStyle(contentStyle.value)
			}, [renderSlot(_ctx.$slots, "default")], 4)], 44, _hoisted_2$1)], 12, _hoisted_1$1);
		};
	}
});
var _hoisted_1 = {
	key: 0,
	class: "astryx-bottom-sheet-inline"
};
var _hoisted_2 = {
	key: 0,
	class: "astryx-bottom-sheet__positioner astryx-bottom-sheet__positioner--inline"
};
var _hoisted_3 = [
	"aria-label",
	"aria-labelledby",
	"aria-modal",
	"aria-hidden",
	"role",
	"inert"
];
var _hoisted_4 = { class: "astryx-bottom-sheet__positioner" };
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxBottomSheet",
	inheritAttrs: false,
	__name: "BottomSheet",
	props: /*@__PURE__*/ mergeModels({
		isOpen: { type: Boolean },
		label: {},
		isInline: {
			type: Boolean,
			default: false
		},
		height: { default: "capped" },
		snapPoints: { default: void 0 },
		padding: { default: void 0 },
		purpose: { default: "info" },
		hasScrim: {
			type: Boolean,
			default: true
		},
		finalFocusRef: { default: null }
	}, {
		"isOpen": {
			type: Boolean,
			default: false
		},
		"isOpenModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels([
		"openChange",
		"update:isOpen",
		"motionStart",
		"motionComplete",
		"snap"
	], ["update:isOpen"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const isOpen = useModel(__props, "isOpen");
		const attrs = useAttrs();
		const dialog = useTemplateRef("dialog");
		const panel = useTemplateRef("panel");
		const isPresented = ref(false);
		const scrimOpacity = ref(1);
		const panelState = computed(() => {
			if (isOpen.value) return "open";
			if (props.isInline) return "hidden";
			return isPresented.value ? "exiting" : "hidden";
		});
		const isDismissible = computed(() => props.purpose === "info");
		const isSwipeDismissAllowed = computed(() => props.purpose === "info" && !props.isInline);
		const dialogStyle = computed(() => ({ "--_sheet-scrim-opacity": String(scrimOpacity.value) }));
		/** The dialog carries the accessible name; the panel keeps every other attribute. */
		const dialogLabel = computed(() => {
			if (attrs["aria-labelledby"] != null) return void 0;
			return attrs["aria-label"] ?? props.label;
		});
		const labelledBy = computed(() => attrs["aria-labelledby"]);
		function panelAttrs() {
			const { "aria-label": _label, "aria-labelledby": _labelledBy, ...rest } = attrs;
			return rest;
		}
		let triggerElement = null;
		let previousBodyOverflow = null;
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
		function panelElement() {
			return panel.value?.element ?? null;
		}
		/** Presenting a sheet must not scroll the page to reveal what it just focused. */
		function focusPanel() {
			const element = panelElement();
			if (!element) return;
			const active = document.activeElement;
			if (active != null && element.contains(active)) return;
			const autofocus = element.querySelector("[data-autofocus]");
			if (autofocus != null) autofocus.focus({ preventScroll: true });
			else if (props.hasScrim) element.focus({ preventScroll: true });
		}
		function openSheet() {
			if (props.isInline) return;
			const dialogElement = dialog.value;
			if (!dialogElement) return;
			isPresented.value = true;
			if (!dialogElement.open) {
				if (props.hasScrim) {
					triggerElement = document.activeElement;
					dialogElement.showModal();
				} else dialogElement.show();
			}
			if (props.hasScrim) lockScroll();
			focusPanel();
		}
		function closeSheet() {
			dialog.value?.close();
			unlockScroll();
			isPresented.value = false;
			const target = toValue(props.finalFocusRef) ?? triggerElement;
			triggerElement = null;
			if (target?.isConnected) target.focus();
		}
		function requestClose() {
			isOpen.value = false;
			emit("openChange", false);
		}
		function dismissOnEscape() {
			if (props.purpose === "required") return;
			requestClose();
		}
		function onKeydown(event) {
			if (event.key !== "Escape") return;
			event.preventDefault();
			if (event.isComposing || event.keyCode === 229) return;
			dismissOnEscape();
		}
		function onCancel(event) {
			event.preventDefault();
			dismissOnEscape();
		}
		function onDialogClick(event) {
			if (event.target !== event.currentTarget) return;
			if (props.hasScrim && isDismissible.value) requestClose();
		}
		function onPanelMotionComplete(motion) {
			emit("motionComplete", motion);
			if (motion === "exiting") closeSheet();
		}
		watch(isOpen, (open) => {
			if (open) openSheet();
		}, { flush: "post" });
		onMounted(() => {
			if (isOpen.value) openSheet();
		});
		onBeforeUnmount(() => {
			unlockScroll();
		});
		__expose({
			element: computed(() => panelElement()),
			focus: (options) => panelElement()?.focus(options),
			blur: () => panelElement()?.blur()
		});
		return (_ctx, _cache) => {
			return __props.isInline ? (openBlock(), createElementBlock("div", _hoisted_1, [isOpen.value ? (openBlock(), createElementBlock("div", _hoisted_2, [createVNode(_sfc_main$1, mergeProps({
				ref_key: "panel",
				ref: panel
			}, panelAttrs(), {
				state: panelState.value,
				label: __props.label,
				height: __props.height,
				padding: __props.padding,
				"snap-points": __props.snapPoints,
				"is-swipe-dismiss-allowed": false,
				onSnap: _cache[0] || (_cache[0] = ($event) => emit("snap", $event))
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"state",
				"label",
				"height",
				"padding",
				"snap-points"
			])])) : createCommentVNode("v-if", true)])) : (openBlock(), createElementBlock("dialog", {
				key: 1,
				ref_key: "dialog",
				ref: dialog,
				class: normalizeClass(["astryx-bottom-sheet-dialog", {
					"astryx-bottom-sheet-dialog--scrim": __props.hasScrim,
					"astryx-bottom-sheet-dialog--closing": !isOpen.value && isPresented.value
				}]),
				"aria-label": dialogLabel.value,
				"aria-labelledby": labelledBy.value,
				"aria-modal": __props.hasScrim && isOpen.value ? "true" : void 0,
				"aria-hidden": !isOpen.value && isPresented.value ? "true" : void 0,
				role: __props.purpose === "required" ? "alertdialog" : void 0,
				inert: !isOpen.value && isPresented.value ? true : void 0,
				style: normalizeStyle(dialogStyle.value),
				onCancel,
				onClick: onDialogClick,
				onKeydown
			}, [createElementVNode("div", _hoisted_4, [createVNode(_sfc_main$1, mergeProps({
				ref_key: "panel",
				ref: panel
			}, panelAttrs(), {
				state: panelState.value,
				label: __props.label,
				height: __props.height,
				padding: __props.padding,
				"snap-points": __props.snapPoints,
				"is-swipe-dismiss-allowed": isSwipeDismissAllowed.value,
				onDismiss: requestClose,
				onScrimOpacity: _cache[1] || (_cache[1] = ($event) => scrimOpacity.value = $event),
				onSnap: _cache[2] || (_cache[2] = ($event) => emit("snap", $event)),
				onMotionStart: _cache[3] || (_cache[3] = ($event) => emit("motionStart", $event)),
				onMotionComplete: onPanelMotionComplete
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"state",
				"label",
				"height",
				"padding",
				"snap-points",
				"is-swipe-dismiss-allowed"
			])]), _cache[4] || (_cache[4] = createElementVNode("div", {
				class: "astryx-bottom-sheet__edge-tint",
				"aria-hidden": "true"
			}, null, -1))], 46, _hoisted_3));
		};
	}
});
//#endregion
//#region components/demos/bottom-sheet/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		const isOpen = ref(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "bottom-sheet-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$2), {
				label: "Open filters",
				variant: "secondary",
				onClick: ($event) => isOpen.value = true
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				"is-open": isOpen.value,
				"onUpdate:isOpen": ($event) => isOpen.value = $event,
				height: "hug",
				label: "Filters",
				onOpenChange: ($event) => isOpen.value = $event
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$5), { gap: 3 }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(ssrRenderComponent(unref(_sfc_main$3), { level: 3 }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Filters `);
										else return [createTextVNode(" Filters ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(unref(_sfc_main$4), {
									type: "body",
									color: "secondary"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Narrow the list by price, availability, and delivery window, then apply the result. `);
										else return [createTextVNode(" Narrow the list by price, availability, and delivery window, then apply the result. ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(unref(_sfc_main$2$2), {
									gap: 2,
									justify: "end"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(ssrRenderComponent(unref(_sfc_main$2), {
												label: "Reset",
												variant: "secondary",
												onClick: ($event) => isOpen.value = false
											}, null, _parent, _scopeId));
											_push(ssrRenderComponent(unref(_sfc_main$2), {
												label: "Apply",
												variant: "primary",
												onClick: ($event) => isOpen.value = false
											}, null, _parent, _scopeId));
										} else return [createVNode(unref(_sfc_main$2), {
											label: "Reset",
											variant: "secondary",
											onClick: ($event) => isOpen.value = false
										}, null, 8, ["onClick"]), createVNode(unref(_sfc_main$2), {
											label: "Apply",
											variant: "primary",
											onClick: ($event) => isOpen.value = false
										}, null, 8, ["onClick"])];
									}),
									_: 1
								}, _parent, _scopeId));
							} else return [
								createVNode(unref(_sfc_main$3), { level: 3 }, {
									default: withCtx(() => [createTextVNode(" Filters ")]),
									_: 1
								}),
								createVNode(unref(_sfc_main$4), {
									type: "body",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Narrow the list by price, availability, and delivery window, then apply the result. ")]),
									_: 1
								}),
								createVNode(unref(_sfc_main$2$2), {
									gap: 2,
									justify: "end"
								}, {
									default: withCtx(() => [createVNode(unref(_sfc_main$2), {
										label: "Reset",
										variant: "secondary",
										onClick: ($event) => isOpen.value = false
									}, null, 8, ["onClick"]), createVNode(unref(_sfc_main$2), {
										label: "Apply",
										variant: "primary",
										onClick: ($event) => isOpen.value = false
									}, null, 8, ["onClick"])]),
									_: 1
								})
							];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$5), { gap: 3 }, {
						default: withCtx(() => [
							createVNode(unref(_sfc_main$3), { level: 3 }, {
								default: withCtx(() => [createTextVNode(" Filters ")]),
								_: 1
							}),
							createVNode(unref(_sfc_main$4), {
								type: "body",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Narrow the list by price, availability, and delivery window, then apply the result. ")]),
								_: 1
							}),
							createVNode(unref(_sfc_main$2$2), {
								gap: 2,
								justify: "end"
							}, {
								default: withCtx(() => [createVNode(unref(_sfc_main$2), {
									label: "Reset",
									variant: "secondary",
									onClick: ($event) => isOpen.value = false
								}, null, 8, ["onClick"]), createVNode(unref(_sfc_main$2), {
									label: "Apply",
									variant: "primary",
									onClick: ($event) => isOpen.value = false
								}, null, 8, ["onClick"])]),
								_: 1
							})
						]),
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
//#region components/demos/bottom-sheet/basic.vue
var _sfc_setup$3 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/bottom-sheet/basic.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/bottom-sheet/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { BottomSheet } from '@astryx-vue/core/BottomSheet'\nimport { Button } from '@astryx-vue/core/Button'\nimport { Heading } from '@astryx-vue/core/Heading'\nimport { HStack, VStack } from '@astryx-vue/core/Stack'\nimport { Text } from '@astryx-vue/core/Text'\nimport { ref } from 'vue'\n\nconst isOpen = ref(false)\n<\/script>\n\n<template>\n  <div class=\"bottom-sheet-preview\">\n    <Button label=\"Open filters\" variant=\"secondary\" @click=\"isOpen = true\" />\n    <BottomSheet\n      v-model:is-open=\"isOpen\"\n      height=\"hug\"\n      label=\"Filters\"\n      @open-change=\"isOpen = $event\"\n    >\n      <VStack :gap=\"3\">\n        <Heading :level=\"3\">\n          Filters\n        </Heading>\n        <Text type=\"body\" color=\"secondary\">\n          Narrow the list by price, availability, and delivery window, then apply\n          the result.\n        </Text>\n        <HStack :gap=\"2\" justify=\"end\">\n          <Button label=\"Reset\" variant=\"secondary\" @click=\"isOpen = false\" />\n          <Button label=\"Apply\" variant=\"primary\" @click=\"isOpen = false\" />\n        </HStack>\n      </VStack>\n    </BottomSheet>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { BottomSheet } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/BottomSheet'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Heading } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Heading'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HStack, VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> isOpen</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"bottom-sheet-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Open filters\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> true</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BottomSheet</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">is-open</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"hug\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Filters\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">open-change</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> $event</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Heading</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">level</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Filters</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Heading</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"body\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Narrow the list by price, availability, and delivery window, then apply</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          the result.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> justify</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"end\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Reset\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> false</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Apply\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"primary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> false</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BottomSheet</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/bottom-sheet/overview.vue?vue&type=script&setup=true&lang.ts
var overview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "overview",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "bottom-sheet-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				"is-inline": "",
				"is-open": "",
				height: "hug",
				label: "Filters"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$5), { gap: 3 }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(ssrRenderComponent(unref(_sfc_main$3), { level: 3 }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Filters `);
										else return [createTextVNode(" Filters ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(unref(_sfc_main$4), {
									type: "body",
									color: "secondary"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Narrow the list by price, availability, and delivery window, then apply the result. `);
										else return [createTextVNode(" Narrow the list by price, availability, and delivery window, then apply the result. ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(unref(_sfc_main$2$2), {
									gap: 2,
									justify: "end"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(ssrRenderComponent(unref(_sfc_main$2), {
												label: "Reset",
												variant: "secondary"
											}, null, _parent, _scopeId));
											_push(ssrRenderComponent(unref(_sfc_main$2), {
												label: "Apply",
												variant: "primary"
											}, null, _parent, _scopeId));
										} else return [createVNode(unref(_sfc_main$2), {
											label: "Reset",
											variant: "secondary"
										}), createVNode(unref(_sfc_main$2), {
											label: "Apply",
											variant: "primary"
										})];
									}),
									_: 1
								}, _parent, _scopeId));
							} else return [
								createVNode(unref(_sfc_main$3), { level: 3 }, {
									default: withCtx(() => [createTextVNode(" Filters ")]),
									_: 1
								}),
								createVNode(unref(_sfc_main$4), {
									type: "body",
									color: "secondary"
								}, {
									default: withCtx(() => [createTextVNode(" Narrow the list by price, availability, and delivery window, then apply the result. ")]),
									_: 1
								}),
								createVNode(unref(_sfc_main$2$2), {
									gap: 2,
									justify: "end"
								}, {
									default: withCtx(() => [createVNode(unref(_sfc_main$2), {
										label: "Reset",
										variant: "secondary"
									}), createVNode(unref(_sfc_main$2), {
										label: "Apply",
										variant: "primary"
									})]),
									_: 1
								})
							];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$5), { gap: 3 }, {
						default: withCtx(() => [
							createVNode(unref(_sfc_main$3), { level: 3 }, {
								default: withCtx(() => [createTextVNode(" Filters ")]),
								_: 1
							}),
							createVNode(unref(_sfc_main$4), {
								type: "body",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Narrow the list by price, availability, and delivery window, then apply the result. ")]),
								_: 1
							}),
							createVNode(unref(_sfc_main$2$2), {
								gap: 2,
								justify: "end"
							}, {
								default: withCtx(() => [createVNode(unref(_sfc_main$2), {
									label: "Reset",
									variant: "secondary"
								}), createVNode(unref(_sfc_main$2), {
									label: "Apply",
									variant: "primary"
								})]),
								_: 1
							})
						]),
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
//#region components/demos/bottom-sheet/overview.vue
var _sfc_setup$2 = overview_vue_vue_type_script_setup_true_lang_default.setup;
overview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/bottom-sheet/overview.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var overview_default$1 = overview_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/bottom-sheet/overview.vue?raw&highlighted
var overview_default = {
	"source": "<script setup lang=\"ts\">\nimport { BottomSheet } from '@astryx-vue/core/BottomSheet'\nimport { Button } from '@astryx-vue/core/Button'\nimport { Heading } from '@astryx-vue/core/Heading'\nimport { HStack, VStack } from '@astryx-vue/core/Stack'\nimport { Text } from '@astryx-vue/core/Text'\n<\/script>\n\n<template>\n  <div class=\"bottom-sheet-preview\">\n    <BottomSheet is-inline is-open height=\"hug\" label=\"Filters\">\n      <VStack :gap=\"3\">\n        <Heading :level=\"3\">\n          Filters\n        </Heading>\n        <Text type=\"body\" color=\"secondary\">\n          Narrow the list by price, availability, and delivery window, then apply\n          the result.\n        </Text>\n        <HStack :gap=\"2\" justify=\"end\">\n          <Button label=\"Reset\" variant=\"secondary\" />\n          <Button label=\"Apply\" variant=\"primary\" />\n        </HStack>\n      </VStack>\n    </BottomSheet>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { BottomSheet } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/BottomSheet'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Heading } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Heading'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { HStack, VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"bottom-sheet-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BottomSheet</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-inline</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-open</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"hug\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Filters\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Heading</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">level</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Filters</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Heading</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"body\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Narrow the list by price, availability, and delivery window, then apply</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          the result.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> justify</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"end\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Reset\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Apply\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"primary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">HStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BottomSheet</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/bottom-sheet/snap.vue?vue&type=script&setup=true&lang.ts
var snap_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "snap",
	__ssrInlineRender: true,
	setup(__props) {
		const isOpen = ref(false);
		const stops = [
			{
				name: "Centraal Station",
				detail: "Platform 4 · every 10 minutes"
			},
			{
				name: "Museumkwartier",
				detail: "Tram 5 · 8 minutes away"
			},
			{
				name: "Westerpark",
				detail: "Bus 21 · 14 minutes away"
			},
			{
				name: "Oostpoort",
				detail: "Metro 51 · 22 minutes away"
			},
			{
				name: "Zuidas",
				detail: "Train · 31 minutes away"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "bottom-sheet-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$2), {
				label: "Show route",
				variant: "secondary",
				onClick: ($event) => isOpen.value = true
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				"is-open": isOpen.value,
				"onUpdate:isOpen": ($event) => isOpen.value = $event,
				"snap-points": [.45],
				height: "tall",
				label: "Route",
				onOpenChange: ($event) => isOpen.value = $event
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$4), {
							type: "body",
							color: "secondary"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Drag the handle down to rest the sheet at half the screen, or up to fill it again. `);
								else return [createTextVNode(" Drag the handle down to rest the sheet at half the screen, or up to fill it again. ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1$6), { header: "Stops" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<!--[-->`);
									ssrRenderList(stops, (stop) => {
										_push(ssrRenderComponent(unref(_sfc_main$7), {
											key: stop.name,
											label: stop.name,
											description: stop.detail
										}, null, _parent, _scopeId));
									});
									_push(`<!--]-->`);
								} else return [(openBlock(), createBlock(Fragment, null, renderList(stops, (stop) => {
									return createVNode(unref(_sfc_main$7), {
										key: stop.name,
										label: stop.name,
										description: stop.detail
									}, null, 8, ["label", "description"]);
								}), 64))];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode(unref(_sfc_main$4), {
						type: "body",
						color: "secondary"
					}, {
						default: withCtx(() => [createTextVNode(" Drag the handle down to rest the sheet at half the screen, or up to fill it again. ")]),
						_: 1
					}), createVNode(unref(_sfc_main$1$6), { header: "Stops" }, {
						default: withCtx(() => [(openBlock(), createBlock(Fragment, null, renderList(stops, (stop) => {
							return createVNode(unref(_sfc_main$7), {
								key: stop.name,
								label: stop.name,
								description: stop.detail
							}, null, 8, ["label", "description"]);
						}), 64))]),
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
//#region components/demos/bottom-sheet/snap.vue
var _sfc_setup$1 = snap_vue_vue_type_script_setup_true_lang_default.setup;
snap_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/bottom-sheet/snap.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var snap_default$1 = snap_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/bottom-sheet/snap.vue?raw&highlighted
var snap_default = {
	"source": "<script setup lang=\"ts\">\nimport { BottomSheet } from '@astryx-vue/core/BottomSheet'\nimport { Button } from '@astryx-vue/core/Button'\nimport { List, ListItem } from '@astryx-vue/core/List'\nimport { Text } from '@astryx-vue/core/Text'\nimport { ref } from 'vue'\n\nconst isOpen = ref(false)\n\nconst stops = [\n  { name: 'Centraal Station', detail: 'Platform 4 · every 10 minutes' },\n  { name: 'Museumkwartier', detail: 'Tram 5 · 8 minutes away' },\n  { name: 'Westerpark', detail: 'Bus 21 · 14 minutes away' },\n  { name: 'Oostpoort', detail: 'Metro 51 · 22 minutes away' },\n  { name: 'Zuidas', detail: 'Train · 31 minutes away' },\n]\n<\/script>\n\n<template>\n  <div class=\"bottom-sheet-preview\">\n    <Button label=\"Show route\" variant=\"secondary\" @click=\"isOpen = true\" />\n    <BottomSheet\n      v-model:is-open=\"isOpen\"\n      :snap-points=\"[0.45]\"\n      height=\"tall\"\n      label=\"Route\"\n      @open-change=\"isOpen = $event\"\n    >\n      <Text type=\"body\" color=\"secondary\">\n        Drag the handle down to rest the sheet at half the screen, or up to fill\n        it again.\n      </Text>\n      <List header=\"Stops\">\n        <ListItem\n          v-for=\"stop in stops\"\n          :key=\"stop.name\"\n          :label=\"stop.name\"\n          :description=\"stop.detail\"\n        />\n      </List>\n    </BottomSheet>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { BottomSheet } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/BottomSheet'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { List, ListItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/List'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> isOpen</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> stops</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Centraal Station'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Platform 4 · every 10 minutes'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Museumkwartier'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Tram 5 · 8 minutes away'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Westerpark'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Bus 21 · 14 minutes away'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Oostpoort'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Metro 51 · 22 minutes away'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Zuidas'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Train · 31 minutes away'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"bottom-sheet-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Show route\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> true</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BottomSheet</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">is-open</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">snap-points</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">0.45</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"tall\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Route\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">open-change</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> $event</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"body\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        Drag the handle down to rest the sheet at half the screen, or up to fill</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        it again.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> header</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Stops\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">          v-for</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">stop </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">in</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> stops</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">key</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">stop.name</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">stop.name</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">stop.detail</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BottomSheet</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/bottom-sheet/tall.vue?vue&type=script&setup=true&lang.ts
var tall_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "tall",
	__ssrInlineRender: true,
	setup(__props) {
		const isOpen = ref(false);
		const places = [
			{
				name: "Koffiehuis De Hoek",
				detail: "120 m · open until 18:00"
			},
			{
				name: "Bakkerij Van Dijk",
				detail: "260 m · sourdough and rye"
			},
			{
				name: "Markt aan het Water",
				detail: "400 m · Tue to Sat"
			},
			{
				name: "Stadsbibliotheek",
				detail: "650 m · quiet reading room"
			},
			{
				name: "Fietsenwinkel Centrum",
				detail: "800 m · repairs same day"
			},
			{
				name: "Parkeergarage Oost",
				detail: "1.1 km · 24 hours"
			},
			{
				name: "Zwembad De Golf",
				detail: "1.4 km · lanes before 9:00"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "bottom-sheet-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$2), {
				label: "Show nearby places",
				variant: "secondary",
				onClick: ($event) => isOpen.value = true
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				"is-open": isOpen.value,
				"onUpdate:isOpen": ($event) => isOpen.value = $event,
				height: "tall",
				label: "Nearby places",
				onOpenChange: ($event) => isOpen.value = $event
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$4), {
							type: "body",
							color: "secondary"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` The sheet scrolls its own content, so the list keeps its length and the handle stays reachable. `);
								else return [createTextVNode(" The sheet scrolls its own content, so the list keeps its length and the handle stays reachable. ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1$6), { header: "Nearby" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<!--[-->`);
									ssrRenderList(places, (place) => {
										_push(ssrRenderComponent(unref(_sfc_main$7), {
											key: place.name,
											label: place.name,
											description: place.detail
										}, null, _parent, _scopeId));
									});
									_push(`<!--]-->`);
								} else return [(openBlock(), createBlock(Fragment, null, renderList(places, (place) => {
									return createVNode(unref(_sfc_main$7), {
										key: place.name,
										label: place.name,
										description: place.detail
									}, null, 8, ["label", "description"]);
								}), 64))];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode(unref(_sfc_main$4), {
						type: "body",
						color: "secondary"
					}, {
						default: withCtx(() => [createTextVNode(" The sheet scrolls its own content, so the list keeps its length and the handle stays reachable. ")]),
						_: 1
					}), createVNode(unref(_sfc_main$1$6), { header: "Nearby" }, {
						default: withCtx(() => [(openBlock(), createBlock(Fragment, null, renderList(places, (place) => {
							return createVNode(unref(_sfc_main$7), {
								key: place.name,
								label: place.name,
								description: place.detail
							}, null, 8, ["label", "description"]);
						}), 64))]),
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
//#region components/demos/bottom-sheet/tall.vue
var _sfc_setup = tall_vue_vue_type_script_setup_true_lang_default.setup;
tall_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/bottom-sheet/tall.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var tall_default$1 = tall_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/bottom-sheet/tall.vue?raw&highlighted
var tall_default = {
	"source": "<script setup lang=\"ts\">\nimport { BottomSheet } from '@astryx-vue/core/BottomSheet'\nimport { Button } from '@astryx-vue/core/Button'\nimport { List, ListItem } from '@astryx-vue/core/List'\nimport { Text } from '@astryx-vue/core/Text'\nimport { ref } from 'vue'\n\nconst isOpen = ref(false)\n\nconst places = [\n  { name: 'Koffiehuis De Hoek', detail: '120 m · open until 18:00' },\n  { name: 'Bakkerij Van Dijk', detail: '260 m · sourdough and rye' },\n  { name: 'Markt aan het Water', detail: '400 m · Tue to Sat' },\n  { name: 'Stadsbibliotheek', detail: '650 m · quiet reading room' },\n  { name: 'Fietsenwinkel Centrum', detail: '800 m · repairs same day' },\n  { name: 'Parkeergarage Oost', detail: '1.1 km · 24 hours' },\n  { name: 'Zwembad De Golf', detail: '1.4 km · lanes before 9:00' },\n]\n<\/script>\n\n<template>\n  <div class=\"bottom-sheet-preview\">\n    <Button label=\"Show nearby places\" variant=\"secondary\" @click=\"isOpen = true\" />\n    <BottomSheet\n      v-model:is-open=\"isOpen\"\n      height=\"tall\"\n      label=\"Nearby places\"\n      @open-change=\"isOpen = $event\"\n    >\n      <Text type=\"body\" color=\"secondary\">\n        The sheet scrolls its own content, so the list keeps its length and the\n        handle stays reachable.\n      </Text>\n      <List header=\"Nearby\">\n        <ListItem\n          v-for=\"place in places\"\n          :key=\"place.name\"\n          :label=\"place.name\"\n          :description=\"place.detail\"\n        />\n      </List>\n    </BottomSheet>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { BottomSheet } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/BottomSheet'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { List, ListItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/List'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> isOpen</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> places</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Koffiehuis De Hoek'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'120 m · open until 18:00'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Bakkerij Van Dijk'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'260 m · sourdough and rye'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Markt aan het Water'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'400 m · Tue to Sat'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Stadsbibliotheek'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'650 m · quiet reading room'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Fietsenwinkel Centrum'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'800 m · repairs same day'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Parkeergarage Oost'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'1.1 km · 24 hours'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { name: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Zwembad De Golf'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, detail: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'1.4 km · lanes before 9:00'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"bottom-sheet-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Show nearby places\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> true</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BottomSheet</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">is-open</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"tall\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Nearby places\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">open-change</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">isOpen </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> $event</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"body\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        The sheet scrolls its own content, so the list keeps its length and the</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        handle stays reachable.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> header</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Nearby\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">          v-for</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">place </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">in</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> places</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">key</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">place.name</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">place.name</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">place.detail</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">BottomSheet</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/bottom-sheet/index.ts
var options = { className: "bottom-sheet-preview" };
var bottomSheetOverview = defineDemo(overview_default$1, overview_default, options);
var bottomSheetBasic = defineDemo(basic_default$1, basic_default, options);
var bottomSheetTall = defineDemo(tall_default$1, tall_default, options);
var bottomSheetSnap = defineDemo(snap_default$1, snap_default, options);
//#endregion
export { bottomSheetTall as i, bottomSheetOverview as n, bottomSheetSnap as r, bottomSheetBasic as t };
