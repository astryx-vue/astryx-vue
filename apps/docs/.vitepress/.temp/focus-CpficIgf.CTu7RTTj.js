//#region ../../packages/core/dist/focus-CpficIgf.js
var FOCUSABLE_SELECTOR = [
	"a[href]",
	"area[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type=\"hidden\"])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"iframe",
	"[contenteditable]:not([contenteditable=\"false\"])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
function getFocusables(container) {
	return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => !element.hasAttribute("disabled"));
}
function focusElement(element) {
	try {
		element.focus();
	} catch {
		return false;
	}
	return document.activeElement === element;
}
function isFocusable(element) {
	if (element.hasAttribute("tabindex")) return element.tabIndex >= 0;
	if ([
		"A",
		"BUTTON",
		"INPUT",
		"SELECT",
		"TEXTAREA"
	].includes(element.tagName)) return !element.disabled;
	return element.isContentEditable;
}
//#endregion
export { getFocusables as n, isFocusable as r, focusElement as t };
