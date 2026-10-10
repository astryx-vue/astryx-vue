import { Fragment, computed, createElementBlock, defineComponent, mergeProps, onMounted, openBlock, ref, renderList, toDisplayString, unref, useAttrs } from "vue";
//#region ../../packages/core/dist/Kbd-DGEjoy3N.js
var KEY_ALIASES = /* @__PURE__ */ new Map([["esc", "escape"], ["return", "enter"]]);
/**
* Glyphs painted in a key badge. A `Map` keeps an unknown key such as
* `constructor` from resolving to an object prototype member.
*/
var KEY_DISPLAY = /* @__PURE__ */ new Map([
	["ctrl", "⌃"],
	["alt", "⌥"],
	["shift", "⇧"],
	["enter", "↵"],
	["backspace", "⌫"],
	["escape", "Esc"],
	["tab", "⇥"],
	["up", "↑"],
	["down", "↓"],
	["left", "←"],
	["right", "→"],
	["plus", "+"]
]);
/**
* Spoken words for the accessible name. Assistive technology cannot announce
* the glyphs above meaningfully, so the shortcut names the keys instead.
*/
var KEY_LABEL = /* @__PURE__ */ new Map([
	["ctrl", "Control"],
	["alt", "Alt"],
	["shift", "Shift"],
	["enter", "Enter"],
	["backspace", "Backspace"],
	["escape", "Escape"],
	["tab", "Tab"],
	["up", "Up arrow"],
	["down", "Down arrow"],
	["left", "Left arrow"],
	["right", "Right arrow"],
	["plus", "Plus"]
]);
function keyDisplay(name, isApple) {
	if (name === "mod") return isApple ? "⌘" : "Ctrl";
	return KEY_DISPLAY.get(name) ?? name.toUpperCase();
}
function keyLabel(name, isApple) {
	if (name === "mod") return isApple ? "Command" : "Control";
	return KEY_LABEL.get(name) ?? name.toUpperCase();
}
function parseShortcut(keys, isApple) {
	return keys.split("+").map((segment) => {
		const source = segment.trim().toLowerCase();
		const name = KEY_ALIASES.get(source) ?? source;
		return {
			name,
			display: keyDisplay(name, isApple),
			label: keyLabel(name, isApple)
		};
	});
}
/**
* Whether the current platform is macOS or iOS.
*
* Prefers the User-Agent Client Hints API when it names a platform, and falls
* back to `navigator.platform` when it names none. A platform that names
* nothing (`''`, or the spec's `Unknown` sentinel) is treated as no answer
* rather than as a negative one.
*/
function isApplePlatform() {
	if (typeof navigator === "undefined") return false;
	const userAgentData = navigator.userAgentData;
	const named = typeof userAgentData?.platform === "string" ? userAgentData.platform.trim() : "";
	if (named !== "" && named.toLowerCase() !== "unknown") return /mac/i.test(named);
	return /Mac|iPhone|iPad|iPod/.test(navigator.platform ?? "");
}
/**
* Reads the platform on the client only.
*
* The server and the first client render both answer `false`, so a
* server-rendered shortcut hydrates without a mismatch and only then switches
* to the platform-resolved keys.
*/
function useIsApplePlatform() {
	const isApple = ref(false);
	onMounted(() => {
		isApple.value = isApplePlatform();
	});
	return isApple;
}
var _hoisted_1 = ["aria-label"];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxKbd",
	inheritAttrs: false,
	__name: "Kbd",
	props: { keys: {} },
	setup(__props) {
		const props = __props;
		const attrs = useAttrs();
		const isApple = useIsApplePlatform();
		const keys = computed(() => parseShortcut(props.keys, isApple.value));
		const accessibleName = computed(() => keys.value.map((key) => key.label).join(" + "));
		const controlledAttrs = /* @__PURE__ */ new Set([
			"class",
			"style",
			"role",
			"aria-label"
		]);
		const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key))));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", mergeProps(forwardedAttrs.value, {
				class: ["astryx-kbd", unref(attrs).class],
				role: "img",
				"aria-label": accessibleName.value,
				style: unref(attrs).style
			}), [(openBlock(true), createElementBlock(Fragment, null, renderList(keys.value, (key, index) => {
				return openBlock(), createElementBlock("kbd", {
					key: `${key.name}:${index}`,
					class: "astryx-kbd__key",
					"aria-hidden": "true"
				}, toDisplayString(key.display), 1);
			}), 128))], 16, _hoisted_1);
		};
	}
});
//#endregion
export { _sfc_main as t };
