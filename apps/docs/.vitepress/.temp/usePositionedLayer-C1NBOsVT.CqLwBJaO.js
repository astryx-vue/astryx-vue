import { nextTick, ref, watch } from "vue";
//#region ../../packages/core/dist/usePositionedLayer-C1NBOsVT.js
var VIEWPORT_MARGIN = 8;
function alignOnAxis(start, size, own, alignment) {
	if (alignment === "start") return start;
	if (alignment === "end") return start + size - own;
	return start + (size - own) / 2;
}
function clamp(value, min, max) {
	return Math.max(min, Math.min(value, max));
}
/**
* 计算浮层相对锚点的位置。空间不足时翻转到相反方向，最终位置保持在视口内。
*/
function computeLayerPosition(anchor, layer, viewport, placement, alignment, gap) {
	let resolved = placement;
	if (resolved === "above" && anchor.top - gap - layer.height < 0) resolved = "below";
	else if (resolved === "below" && anchor.bottom + gap + layer.height > viewport.height) resolved = "above";
	else if (resolved === "start" && anchor.left - gap - layer.width < 0) resolved = "end";
	else if (resolved === "end" && anchor.right + gap + layer.width > viewport.width) resolved = "start";
	let top;
	let left;
	if (resolved === "above" || resolved === "below") {
		top = resolved === "above" ? anchor.top - gap - layer.height : anchor.bottom + gap;
		left = alignOnAxis(anchor.left, anchor.width, layer.width, alignment);
	} else {
		left = resolved === "start" ? anchor.left - gap - layer.width : anchor.right + gap;
		top = alignOnAxis(anchor.top, anchor.height, layer.height, alignment);
	}
	if (!isAnchorInViewport(anchor, viewport)) return {
		top,
		left,
		placement: resolved
	};
	return {
		top: clamp(top, VIEWPORT_MARGIN, viewport.height - layer.height - VIEWPORT_MARGIN),
		left: clamp(left, VIEWPORT_MARGIN, viewport.width - layer.width - VIEWPORT_MARGIN),
		placement: resolved
	};
}
function isAnchorInViewport(anchor, viewport) {
	return anchor.right > 0 && anchor.bottom > 0 && anchor.left < viewport.width && anchor.top < viewport.height;
}
var GEOMETRY_POLL_INTERVAL = 100;
function usePositionedLayer(options) {
	const { anchor, layer, isOpen, placement, alignment, gap } = options;
	const position = ref({
		top: 0,
		left: 0,
		placement: placement.value
	});
	function update() {
		const anchorEl = anchor.value;
		const layerEl = layer.value;
		if (!anchorEl || !layerEl || !isOpen.value) return;
		position.value = computeLayerPosition(anchorEl.getBoundingClientRect(), {
			width: layerEl.offsetWidth,
			height: layerEl.offsetHeight
		}, {
			width: window.innerWidth,
			height: window.innerHeight
		}, placement.value, alignment.value, gap);
	}
	let pollId;
	function geometryKey() {
		const a = anchor.value?.getBoundingClientRect();
		const l = layer.value;
		return [
			a?.top,
			a?.left,
			a?.width,
			a?.height,
			l?.offsetWidth,
			l?.offsetHeight
		].join(",");
	}
	function watchGeometry() {
		let lastKey = "";
		pollId = setInterval(() => {
			const key = geometryKey();
			if (key !== lastKey) {
				lastKey = key;
				update();
			}
		}, GEOMETRY_POLL_INTERVAL);
	}
	function attach() {
		window.addEventListener("scroll", update, true);
		window.addEventListener("resize", update);
		watchGeometry();
	}
	function detach() {
		window.removeEventListener("scroll", update, true);
		window.removeEventListener("resize", update);
		clearInterval(pollId);
		pollId = void 0;
	}
	watch(isOpen, (open) => {
		if (open) {
			attach();
			nextTick(update);
		} else detach();
	});
	watch([placement, alignment], update);
	return {
		position,
		update,
		detach
	};
}
//#endregion
export { usePositionedLayer as t };
