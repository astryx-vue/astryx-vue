import { Fr as $isRangeSelection, Gr as $isTextNode, aa as REDO_COMMAND, bi as CLEAR_EDITOR_COMMAND, c as configExtension, da as UNDO_COMMAND, dr as $isRootNode, ei as HISTORIC_TAG, n as mergeRegister, ni as HISTORY_PUSH_TAG, s as safeCast, u as defineExtension, vi as CAN_REDO_COMMAND, xi as CLEAR_HISTORY_COMMAND, yi as CAN_UNDO_COMMAND } from "./src-BWdqgNjM.js";
import { G as namedSignals, J as j, T as getPeerDependencyFromEditor, X as y, Y as n } from "./src-DjbHpMmC.js";
//#region ../../node_modules/.pnpm/@lexical+history@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/history/src/index.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var HISTORY_MERGE = 0;
var HISTORY_PUSH = 1;
var DISCARD_HISTORY_CANDIDATE = 2;
var OTHER = 0;
var COMPOSING_CHARACTER = 1;
var INSERT_CHARACTER_AFTER_SELECTION = 2;
var DELETE_CHARACTER_BEFORE_SELECTION = 3;
var DELETE_CHARACTER_AFTER_SELECTION = 4;
function getDirtyNodes(editorState, dirtyLeaves, dirtyElements) {
	const nodeMap = editorState._nodeMap;
	const nodes = [];
	for (const dirtyLeafKey of dirtyLeaves) {
		const dirtyLeaf = nodeMap.get(dirtyLeafKey);
		if (dirtyLeaf !== void 0) nodes.push(dirtyLeaf);
	}
	for (const [dirtyElementKey, intentionallyMarkedAsDirty] of dirtyElements) {
		if (!intentionallyMarkedAsDirty) continue;
		const dirtyElement = nodeMap.get(dirtyElementKey);
		if (dirtyElement !== void 0 && !$isRootNode(dirtyElement)) nodes.push(dirtyElement);
	}
	return nodes;
}
function getChangeType(prevEditorState, nextEditorState, dirtyLeavesSet, dirtyElementsSet, isComposing) {
	if (prevEditorState === null || dirtyLeavesSet.size === 0 && dirtyElementsSet.size === 0 && !isComposing) return OTHER;
	const nextSelection = nextEditorState._selection;
	const prevSelection = prevEditorState._selection;
	if (isComposing) return COMPOSING_CHARACTER;
	if (!$isRangeSelection(nextSelection) || !$isRangeSelection(prevSelection) || !prevSelection.isCollapsed() || !nextSelection.isCollapsed()) return OTHER;
	const dirtyNodes = getDirtyNodes(nextEditorState, dirtyLeavesSet, dirtyElementsSet);
	if (dirtyNodes.length === 0) return OTHER;
	if (dirtyNodes.length > 1) {
		const nextNodeMap = nextEditorState._nodeMap;
		const nextAnchorNode = nextNodeMap.get(nextSelection.anchor.key);
		const prevAnchorNode = nextNodeMap.get(prevSelection.anchor.key);
		if (nextAnchorNode && prevAnchorNode && !prevEditorState._nodeMap.has(nextAnchorNode.__key) && $isTextNode(nextAnchorNode) && nextAnchorNode.__text.length === 1 && nextSelection.anchor.offset === 1) return INSERT_CHARACTER_AFTER_SELECTION;
		return OTHER;
	}
	const nextDirtyNode = dirtyNodes[0];
	const prevDirtyNode = prevEditorState._nodeMap.get(nextDirtyNode.__key);
	if (!$isTextNode(prevDirtyNode) || !$isTextNode(nextDirtyNode) || prevDirtyNode.__mode !== nextDirtyNode.__mode) return OTHER;
	const prevText = prevDirtyNode.__text;
	const nextText = nextDirtyNode.__text;
	if (prevText === nextText) return OTHER;
	const nextAnchor = nextSelection.anchor;
	const prevAnchor = prevSelection.anchor;
	if (nextAnchor.key !== prevAnchor.key || nextAnchor.type !== "text") return OTHER;
	const nextAnchorOffset = nextAnchor.offset;
	const prevAnchorOffset = prevAnchor.offset;
	const textDiff = nextText.length - prevText.length;
	if (textDiff === 1 && prevAnchorOffset === nextAnchorOffset - 1) return INSERT_CHARACTER_AFTER_SELECTION;
	if (textDiff === -1 && prevAnchorOffset === nextAnchorOffset + 1) return DELETE_CHARACTER_BEFORE_SELECTION;
	if (textDiff === -1 && prevAnchorOffset === nextAnchorOffset) return DELETE_CHARACTER_AFTER_SELECTION;
	return OTHER;
}
function isTextNodeUnchanged(key, prevEditorState, nextEditorState) {
	const prevNode = prevEditorState._nodeMap.get(key);
	const nextNode = nextEditorState._nodeMap.get(key);
	const prevSelection = prevEditorState._selection;
	const nextSelection = nextEditorState._selection;
	if (!($isRangeSelection(prevSelection) && $isRangeSelection(nextSelection) && prevSelection.anchor.type === "element" && prevSelection.focus.type === "element" && nextSelection.anchor.type === "text" && nextSelection.focus.type === "text") && $isTextNode(prevNode) && $isTextNode(nextNode) && prevNode.__parent === nextNode.__parent) return JSON.stringify(prevEditorState.read(() => prevNode.exportJSON())) === JSON.stringify(nextEditorState.read(() => nextNode.exportJSON()));
	return false;
}
function createMergeActionGetter(editor, delayOrStore, dateNow) {
	let prevChangeTime = dateNow();
	let prevChangeType = OTHER;
	let compositionStartTime = prevChangeTime;
	let compositionStartChangeType = OTHER;
	let compositionStartState = null;
	return (prevEditorState, nextEditorState, currentHistoryEntry, dirtyLeaves, dirtyElements, tags) => {
		const changeTime = dateNow();
		if (tags.has("composition-start")) {
			compositionStartTime = prevChangeTime;
			compositionStartChangeType = prevChangeType;
			compositionStartState = prevEditorState;
		}
		if (tags.has("historic")) {
			prevChangeType = OTHER;
			prevChangeTime = changeTime;
			return DISCARD_HISTORY_CANDIDATE;
		}
		if (tags.has("composition-end") && compositionStartState) {
			prevChangeTime = compositionStartTime;
			prevChangeType = compositionStartChangeType;
			prevEditorState = compositionStartState;
		}
		const changeType = tags.has("paste") || tags.has("cut") ? OTHER : getChangeType(prevEditorState, nextEditorState, dirtyLeaves, dirtyElements, editor.isComposing());
		const mergeAction = (() => {
			const isSameEditor = currentHistoryEntry === null || currentHistoryEntry.editor === editor;
			const shouldPushHistory = tags.has(HISTORY_PUSH_TAG);
			if (!shouldPushHistory && isSameEditor && tags.has("history-merge")) return HISTORY_MERGE;
			if (changeType === COMPOSING_CHARACTER) return DISCARD_HISTORY_CANDIDATE;
			if (prevEditorState === null) return HISTORY_PUSH;
			const selection = nextEditorState._selection;
			if (!(dirtyLeaves.size > 0 || dirtyElements.size > 0)) {
				if (selection !== null) return HISTORY_MERGE;
				return DISCARD_HISTORY_CANDIDATE;
			}
			const delay = typeof delayOrStore === "number" ? delayOrStore : delayOrStore.peek();
			if (shouldPushHistory === false && changeType !== OTHER && changeType === prevChangeType && changeTime < prevChangeTime + delay && isSameEditor) return HISTORY_MERGE;
			if (dirtyLeaves.size === 1) {
				const dirtyLeafKey = Array.from(dirtyLeaves)[0];
				if (isTextNodeUnchanged(dirtyLeafKey, prevEditorState, nextEditorState)) return HISTORY_MERGE;
			}
			return HISTORY_PUSH;
		})();
		prevChangeTime = changeTime;
		prevChangeType = changeType;
		return mergeAction;
	};
}
/**
* Build the entry that reverses `historyStateEntry` and belongs on the
* opposite stack.
*
* With a single editor this is always `current`, since `current` tracks the
* live state of that editor. With a shared {@link HistoryState} the stacks
* interleave entries from several editors, so `current` may belong to an
* editor that is *not* about to change — pushing it would record a no-op and
* lose the state we are about to overwrite. In that case read the live state
* off the entry's own editor instead.
*/
function getInverseEntry(historyStateEntry, current) {
	if (current !== null && current.editor === historyStateEntry.editor) return current;
	const { editor } = historyStateEntry;
	const editorState = editor.getEditorState();
	return editorState.isEmpty() ? null : {
		editor,
		editorState
	};
}
/**
* Build the entry that an update from `editor` pushes onto the undo stack.
*
* `current` is the state to restore when this update is undone, but with a
* shared {@link HistoryState} it may belong to a different editor — one that
* is not changing here, so restoring it would be a no-op and the state that is
* about to be overwritten would never make it onto the stack. Record this
* editor's own pre-update state in that case.
*/
function getUndoEntry(editor, prevEditorState, current) {
	if (current === null) return null;
	if (current.editor === editor) return { ...current };
	return prevEditorState.isEmpty() ? null : {
		editor,
		editorState: prevEditorState
	};
}
function redo(editor, historyState, onChange) {
	const redoStack = historyState.redoStack;
	const undoStack = historyState.undoStack;
	if (redoStack.length !== 0) {
		const current = historyState.current;
		const historyStateEntry = redoStack.pop();
		if (historyStateEntry) {
			const inverseEntry = getInverseEntry(historyStateEntry, current);
			if (inverseEntry !== null) {
				undoStack.push(inverseEntry);
				editor.dispatchCommand(CAN_UNDO_COMMAND, true);
			}
		}
		if (redoStack.length === 0) editor.dispatchCommand(CAN_REDO_COMMAND, false);
		historyState.current = historyStateEntry || null;
		if (onChange) onChange(historyState);
		if (historyStateEntry) historyStateEntry.editor.setEditorState(historyStateEntry.editorState, { tag: HISTORIC_TAG });
	}
}
function undo(editor, historyState, onChange) {
	const redoStack = historyState.redoStack;
	const undoStack = historyState.undoStack;
	if (undoStack.length !== 0) {
		const current = historyState.current;
		const historyStateEntry = undoStack.pop();
		if (historyStateEntry) {
			const inverseEntry = getInverseEntry(historyStateEntry, current);
			if (inverseEntry !== null) {
				redoStack.push(inverseEntry);
				editor.dispatchCommand(CAN_REDO_COMMAND, true);
			}
		}
		if (undoStack.length === 0) editor.dispatchCommand(CAN_UNDO_COMMAND, false);
		historyState.current = historyStateEntry || null;
		if (onChange) onChange(historyState);
		if (historyStateEntry) historyStateEntry.editor.setEditorState(historyStateEntry.editorState, { tag: HISTORIC_TAG });
	}
}
function clearHistory(historyState, onChange) {
	historyState.undoStack = [];
	historyState.redoStack = [];
	historyState.current = null;
	if (onChange) onChange(historyState);
}
/**
* Registers necessary listeners to manage undo/redo history stack and related editor commands.
* It returns `unregister` callback that cleans up all listeners and should be called on editor unmount.
* @param editor - The lexical editor.
* @param historyState - The history state, containing the current state and the undo/redo stack.
* @param delay - The time (in milliseconds) the editor should delay generating a new history stack,
* instead of merging the current changes with the current stack.
* @param dateNow - The clock function used for delay-based merging.
* @param onHistoryStateChange - Optional callback invoked once on registration
* and again any time `historyState` is mutated (push, pop, clear, etc.). It is
* NOT invoked when a candidate update is discarded without changing the
* stacks. Useful for keeping derived values (e.g. signals) in sync with the
* current `HistoryState`.
* @param maxDepth - The maximum number of entries the undo stack may hold.
* When the cap is exceeded a new history event has been pushed the oldest
* entries are dropped from the front of the stack until the stack length is
* `maxDepth`. Pass `null` (the default) to keep the stack unbounded — the
* historical behavior. May be a plain number or a `ReadonlySignal<number | null>`
* for reactive reconfiguration.
* @returns The listeners cleanup callback function.
*/
function registerHistory(editor, historyState, delay, dateNow = Date.now, onHistoryStateChange, maxDepth = null) {
	const getMergeAction = createMergeActionGetter(editor, delay, dateNow);
	const readMaxDepth = () => typeof maxDepth === "number" || maxDepth === null ? maxDepth : maxDepth.peek();
	const notifyChange = () => {
		if (onHistoryStateChange) onHistoryStateChange(historyState);
	};
	const applyChange = ({ editorState, prevEditorState, dirtyLeaves, dirtyElements, tags }) => {
		const current = historyState.current;
		const redoStack = historyState.redoStack;
		const undoStack = historyState.undoStack;
		const currentEditorState = current === null ? null : current.editorState;
		if (current !== null && editorState === currentEditorState) return;
		const mergeAction = getMergeAction(prevEditorState, editorState, current, dirtyLeaves, dirtyElements, tags);
		if (mergeAction === HISTORY_PUSH) {
			if (redoStack.length !== 0) {
				historyState.redoStack = [];
				editor.dispatchCommand(CAN_REDO_COMMAND, false);
			}
			const undoEntry = getUndoEntry(editor, prevEditorState, current);
			if (undoEntry !== null) {
				undoStack.push(undoEntry);
				const cap = readMaxDepth();
				if (cap !== null && undoStack.length > cap) undoStack.splice(0, undoStack.length - cap);
				editor.dispatchCommand(CAN_UNDO_COMMAND, true);
			}
		} else if (mergeAction === DISCARD_HISTORY_CANDIDATE) return;
		historyState.current = {
			editor,
			editorState
		};
		notifyChange();
	};
	notifyChange();
	return mergeRegister(editor.registerCommand(UNDO_COMMAND, () => {
		undo(editor, historyState, onHistoryStateChange);
		return true;
	}, 0), editor.registerCommand(REDO_COMMAND, () => {
		redo(editor, historyState, onHistoryStateChange);
		return true;
	}, 0), editor.registerCommand(CLEAR_EDITOR_COMMAND, () => {
		clearHistory(historyState, onHistoryStateChange);
		return false;
	}, 0), editor.registerCommand(CLEAR_HISTORY_COMMAND, () => {
		clearHistory(historyState, onHistoryStateChange);
		editor.dispatchCommand(CAN_REDO_COMMAND, false);
		editor.dispatchCommand(CAN_UNDO_COMMAND, false);
		return true;
	}, 0), editor.registerUpdateListener(applyChange));
}
/**
* Creates an empty history state.
* @returns - The empty history state, as an object.
*/
function createEmptyHistoryState() {
	return {
		current: null,
		redoStack: [],
		undoStack: []
	};
}
/**
* Registers necessary listeners to manage undo/redo history stack and related
* editor commands, via the \@lexical/history module.
*/
var HistoryExtension = defineExtension({
	build: (editor, { delay, createInitialHistoryState, disabled, maxDepth, now }, state) => {
		return {
			...namedSignals({
				delay,
				disabled,
				historyState: createInitialHistoryState(editor),
				maxDepth,
				now
			}),
			...state.getInitResult()
		};
	},
	config: safeCast({
		createInitialHistoryState: createEmptyHistoryState,
		delay: 300,
		disabled: typeof window === "undefined",
		maxDepth: null,
		now: () => Date.now()
	}),
	init: () => ({
		canRedo: y(false),
		canUndo: y(false)
	}),
	name: "@lexical/history/History",
	register: (editor, config, state) => {
		const { canUndo, canRedo } = state.getInitResult();
		const stores = state.getOutput();
		const syncFromHistoryState = (historyState) => n(() => {
			canUndo.value = historyState != null && historyState.undoStack.length > 0;
			canRedo.value = historyState != null && historyState.redoStack.length > 0;
		});
		return j(() => {
			if (stores.disabled.value) {
				syncFromHistoryState(null);
				return;
			}
			return registerHistory(editor, stores.historyState.value, stores.delay, () => stores.now.peek()(), syncFromHistoryState, stores.maxDepth);
		});
	}
});
var HMR_EXTENSION_NAME = "@lexical/extension/HMR";
function getHistoryPeer(editor) {
	return editor ? getPeerDependencyFromEditor(editor, HistoryExtension.name) : null;
}
/**
* Reads `editor`'s HMR restore counter, subscribing the calling effect to it.
*
* `HMRExtension` restores an editor's `HistoryState` by assigning a rebuilt
* one to that editor's signal, which for a shared history would leave this
* editor and its parent holding two different histories — this editor's own
* restore replacing the shared object, or the parent's leaving this one
* pointing at the object the parent no longer uses. Depending on the counter
* re-runs the sync below after either, which re-links them.
*
* A peer lookup by name rather than a dependency: HMRExtension is a
* development-time extension that most editors do not have.
*/
function hmrRestoreCount(editor) {
	const peer = editor ? getPeerDependencyFromEditor(editor, HMR_EXTENSION_NAME) : void 0;
	return peer ? peer.output.restoreCount.value : 0;
}
/**
* Registers necessary listeners to manage undo/redo history stack and related
* editor commands, via the \@lexical/history module, only if the parent editor
* has a history plugin implementation.
*/
var SharedHistoryExtension = defineExtension({
	build: (editor, { disabled, parentEditor }) => namedSignals({
		disabled,
		parentEditor: parentEditor || editor._parentEditor
	}),
	config: safeCast({
		disabled: false,
		parentEditor: null
	}),
	dependencies: [configExtension(HistoryExtension, { disabled: true })],
	name: "@lexical/history/SharedHistory",
	register(editor, _config, state) {
		return j(() => {
			const { disabled, parentEditor } = state.getOutput();
			if (!disabled.value) {
				const { output } = state.getDependency(HistoryExtension);
				hmrRestoreCount(editor);
				hmrRestoreCount(parentEditor.value);
				const parentPeer = getHistoryPeer(parentEditor.value);
				if (!parentPeer) return;
				const parentOutput = parentPeer.output;
				n(() => {
					output.delay.value = parentOutput.delay.value;
					output.historyState.value = parentOutput.historyState.value;
					output.now.value = parentOutput.now.value;
					output.maxDepth.value = parentOutput.maxDepth.value;
					output.disabled.value = parentOutput.disabled.value;
				});
			}
		});
	}
});
//#endregion
export { HistoryExtension, SharedHistoryExtension, createEmptyHistoryState, registerHistory };
