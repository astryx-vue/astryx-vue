import { t as toString } from "./lib-Bjq9bpM2.js";
import { d as unicodePunctuation, f as unicodeWhitespace, p as normalizeIdentifier } from "./micromark-util-character-RC--Fsi-.js";
//#region ../../node_modules/.pnpm/ccount@2.0.1/node_modules/ccount/index.js
/**
* Count how often a character (or substring) is used in a string.
*
* @param {string} value
*   Value to search in.
* @param {string} character
*   Character (or substring) to look for.
* @return {number}
*   Number of times `character` occurred in `value`.
*/
function ccount(value, character) {
	const source = String(value);
	if (typeof character !== "string") throw new TypeError("Expected character");
	let count = 0;
	let index = source.indexOf(character);
	while (index !== -1) {
		count++;
		index = source.indexOf(character, index + character.length);
	}
	return count;
}
//#endregion
//#region ../../node_modules/.pnpm/escape-string-regexp@5.0.0/node_modules/escape-string-regexp/index.js
function escapeStringRegexp(string) {
	if (typeof string !== "string") throw new TypeError("Expected a string");
	return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
//#endregion
//#region ../../node_modules/.pnpm/unist-util-is@6.0.1/node_modules/unist-util-is/lib/index.js
/**
* Generate an assertion from a test.
*
* Useful if you’re going to test many nodes, for example when creating a
* utility where something else passes a compatible test.
*
* The created function is a bit faster because it expects valid input only:
* a `node`, `index`, and `parent`.
*
* @param {Test} test
*   *   when nullish, checks if `node` is a `Node`.
*   *   when `string`, works like passing `(node) => node.type === test`.
*   *   when `function` checks if function passed the node is true.
*   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
*   *   when `array`, checks if any one of the subtests pass.
* @returns {Check}
*   An assertion.
*/
var convert = (
/**
* @param {Test} [test]
* @returns {Check}
*/
function(test) {
	if (test === null || test === void 0) return ok;
	if (typeof test === "function") return castFactory(test);
	if (typeof test === "object") return Array.isArray(test) ? anyFactory(test) : propertiesFactory(test);
	if (typeof test === "string") return typeFactory(test);
	throw new Error("Expected function, string, or object as test");
});
/**
* @param {Array<Props | TestFunction | string>} tests
* @returns {Check}
*/
function anyFactory(tests) {
	/** @type {Array<Check>} */
	const checks = [];
	let index = -1;
	while (++index < tests.length) checks[index] = convert(tests[index]);
	return castFactory(any);
	/**
	* @this {unknown}
	* @type {TestFunction}
	*/
	function any(...parameters) {
		let index = -1;
		while (++index < checks.length) if (checks[index].apply(this, parameters)) return true;
		return false;
	}
}
/**
* Turn an object into a test for a node with a certain fields.
*
* @param {Props} check
* @returns {Check}
*/
function propertiesFactory(check) {
	const checkAsRecord = check;
	return castFactory(all);
	/**
	* @param {Node} node
	* @returns {boolean}
	*/
	function all(node) {
		const nodeAsRecord = node;
		/** @type {string} */
		let key;
		for (key in check) if (nodeAsRecord[key] !== checkAsRecord[key]) return false;
		return true;
	}
}
/**
* Turn a string into a test for a node with a certain type.
*
* @param {string} check
* @returns {Check}
*/
function typeFactory(check) {
	return castFactory(type);
	/**
	* @param {Node} node
	*/
	function type(node) {
		return node && node.type === check;
	}
}
/**
* Turn a custom test into a test for a node that passes that test.
*
* @param {TestFunction} testFunction
* @returns {Check}
*/
function castFactory(testFunction) {
	return check;
	/**
	* @this {unknown}
	* @type {Check}
	*/
	function check(value, index, parent) {
		return Boolean(looksLikeANode(value) && testFunction.call(this, value, typeof index === "number" ? index : void 0, parent || void 0));
	}
}
function ok() {
	return true;
}
/**
* @param {unknown} value
* @returns {value is Node}
*/
function looksLikeANode(value) {
	return value !== null && typeof value === "object" && "type" in value;
}
//#endregion
//#region ../../node_modules/.pnpm/unist-util-visit-parents@6.0.2/node_modules/unist-util-visit-parents/lib/color.js
/**
* @param {string} d
* @returns {string}
*/
function color(d) {
	return d;
}
//#endregion
//#region ../../node_modules/.pnpm/unist-util-visit-parents@6.0.2/node_modules/unist-util-visit-parents/lib/index.js
/**
* @import {Node as UnistNode, Parent as UnistParent} from 'unist'
*/
/**
* @typedef {Exclude<import('unist-util-is').Test, undefined> | undefined} Test
*   Test from `unist-util-is`.
*
*   Note: we have remove and add `undefined`, because otherwise when generating
*   automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
*   which doesn’t work when publishing on npm.
*/
/**
* @typedef {(
*   Fn extends (value: any) => value is infer Thing
*   ? Thing
*   : Fallback
* )} Predicate
*   Get the value of a type guard `Fn`.
* @template Fn
*   Value; typically function that is a type guard (such as `(x): x is Y`).
* @template Fallback
*   Value to yield if `Fn` is not a type guard.
*/
/**
* @typedef {(
*   Check extends null | undefined // No test.
*   ? Value
*   : Value extends {type: Check} // String (type) test.
*   ? Value
*   : Value extends Check // Partial test.
*   ? Value
*   : Check extends Function // Function test.
*   ? Predicate<Check, Value> extends Value
*     ? Predicate<Check, Value>
*     : never
*   : never // Some other test?
* )} MatchesOne
*   Check whether a node matches a primitive check in the type system.
* @template Value
*   Value; typically unist `Node`.
* @template Check
*   Value; typically `unist-util-is`-compatible test, but not arrays.
*/
/**
* @typedef {(
*   Check extends ReadonlyArray<infer T>
*   ? MatchesOne<Value, T>
*   : Check extends Array<infer T>
*   ? MatchesOne<Value, T>
*   : MatchesOne<Value, Check>
* )} Matches
*   Check whether a node matches a check in the type system.
* @template Value
*   Value; typically unist `Node`.
* @template Check
*   Value; typically `unist-util-is`-compatible test.
*/
/**
* @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10} Uint
*   Number; capped reasonably.
*/
/**
* @typedef {I extends 0 ? 1 : I extends 1 ? 2 : I extends 2 ? 3 : I extends 3 ? 4 : I extends 4 ? 5 : I extends 5 ? 6 : I extends 6 ? 7 : I extends 7 ? 8 : I extends 8 ? 9 : 10} Increment
*   Increment a number in the type system.
* @template {Uint} [I=0]
*   Index.
*/
/**
* @typedef {(
*   Node extends UnistParent
*   ? Node extends {children: Array<infer Children>}
*     ? Child extends Children ? Node : never
*     : never
*   : never
* )} InternalParent
*   Collect nodes that can be parents of `Child`.
* @template {UnistNode} Node
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
*/
/**
* @typedef {InternalParent<InclusiveDescendant<Tree>, Child>} Parent
*   Collect nodes in `Tree` that can be parents of `Child`.
* @template {UnistNode} Tree
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
*/
/**
* @typedef {(
*   Depth extends Max
*   ? never
*   :
*     | InternalParent<Node, Child>
*     | InternalAncestor<Node, InternalParent<Node, Child>, Max, Increment<Depth>>
* )} InternalAncestor
*   Collect nodes in `Tree` that can be ancestors of `Child`.
* @template {UnistNode} Node
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
* @template {Uint} [Max=10]
*   Max; searches up to this depth.
* @template {Uint} [Depth=0]
*   Current depth.
*/
/**
* @typedef {InternalAncestor<InclusiveDescendant<Tree>, Child>} Ancestor
*   Collect nodes in `Tree` that can be ancestors of `Child`.
* @template {UnistNode} Tree
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
*/
/**
* @typedef {(
*   Tree extends UnistParent
*     ? Depth extends Max
*       ? Tree
*       : Tree | InclusiveDescendant<Tree['children'][number], Max, Increment<Depth>>
*     : Tree
* )} InclusiveDescendant
*   Collect all (inclusive) descendants of `Tree`.
*
*   > 👉 **Note**: for performance reasons, this seems to be the fastest way to
*   > recurse without actually running into an infinite loop, which the
*   > previous version did.
*   >
*   > Practically, a max of `2` is typically enough assuming a `Root` is
*   > passed, but it doesn’t improve performance.
*   > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
*   > Using up to `10` doesn’t hurt or help either.
* @template {UnistNode} Tree
*   Tree type.
* @template {Uint} [Max=10]
*   Max; searches up to this depth.
* @template {Uint} [Depth=0]
*   Current depth.
*/
/**
* @typedef {'skip' | boolean} Action
*   Union of the action types.
*
* @typedef {number} Index
*   Move to the sibling at `index` next (after node itself is completely
*   traversed).
*
*   Useful if mutating the tree, such as removing the node the visitor is
*   currently on, or any of its previous siblings.
*   Results less than 0 or greater than or equal to `children.length` stop
*   traversing the parent.
*
* @typedef {[(Action | null | undefined | void)?, (Index | null | undefined)?]} ActionTuple
*   List with one or two values, the first an action, the second an index.
*
* @typedef {Action | ActionTuple | Index | null | undefined | void} VisitorResult
*   Any value that can be returned from a visitor.
*/
/**
* @callback Visitor
*   Handle a node (matching `test`, if given).
*
*   Visitors are free to transform `node`.
*   They can also transform the parent of node (the last of `ancestors`).
*
*   Replacing `node` itself, if `SKIP` is not returned, still causes its
*   descendants to be walked (which is a bug).
*
*   When adding or removing previous siblings of `node` (or next siblings, in
*   case of reverse), the `Visitor` should return a new `Index` to specify the
*   sibling to traverse after `node` is traversed.
*   Adding or removing next siblings of `node` (or previous siblings, in case
*   of reverse) is handled as expected without needing to return a new `Index`.
*
*   Removing the children property of an ancestor still results in them being
*   traversed.
* @param {Visited} node
*   Found node.
* @param {Array<VisitedParents>} ancestors
*   Ancestors of `node`.
* @returns {VisitorResult}
*   What to do next.
*
*   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
*   An `Action` is treated as a tuple of `[Action]`.
*
*   Passing a tuple back only makes sense if the `Action` is `SKIP`.
*   When the `Action` is `EXIT`, that action can be returned.
*   When the `Action` is `CONTINUE`, `Index` can be returned.
* @template {UnistNode} [Visited=UnistNode]
*   Visited node type.
* @template {UnistParent} [VisitedParents=UnistParent]
*   Ancestor type.
*/
/**
* @typedef {Visitor<Matches<InclusiveDescendant<Tree>, Check>, Ancestor<Tree, Matches<InclusiveDescendant<Tree>, Check>>>} BuildVisitor
*   Build a typed `Visitor` function from a tree and a test.
*
*   It will infer which values are passed as `node` and which as `parents`.
* @template {UnistNode} [Tree=UnistNode]
*   Tree type.
* @template {Test} [Check=Test]
*   Test type.
*/
/** @type {Readonly<ActionTuple>} */
var empty = [];
/**
* Visit nodes, with ancestral information.
*
* This algorithm performs *depth-first* *tree traversal* in *preorder*
* (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
*
* You can choose for which nodes `visitor` is called by passing a `test`.
* For complex tests, you should test yourself in `visitor`, as it will be
* faster and will have improved type information.
*
* Walking the tree is an intensive task.
* Make use of the return values of the visitor when possible.
* Instead of walking a tree multiple times, walk it once, use `unist-util-is`
* to check if a node matches, and then perform different operations.
*
* You can change the tree.
* See `Visitor` for more info.
*
* @overload
* @param {Tree} tree
* @param {Check} check
* @param {BuildVisitor<Tree, Check>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @overload
* @param {Tree} tree
* @param {BuildVisitor<Tree>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @param {UnistNode} tree
*   Tree to traverse.
* @param {Visitor | Test} test
*   `unist-util-is`-compatible test
* @param {Visitor | boolean | null | undefined} [visitor]
*   Handle each node.
* @param {boolean | null | undefined} [reverse]
*   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
* @returns {undefined}
*   Nothing.
*
* @template {UnistNode} Tree
*   Node type.
* @template {Test} Check
*   `unist-util-is`-compatible test.
*/
function visitParents(tree, test, visitor, reverse) {
	/** @type {Test} */
	let check;
	if (typeof test === "function" && typeof visitor !== "function") {
		reverse = visitor;
		visitor = test;
	} else check = test;
	const is = convert(check);
	const step = reverse ? -1 : 1;
	factory(tree, void 0, [])();
	/**
	* @param {UnistNode} node
	* @param {number | undefined} index
	* @param {Array<UnistParent>} parents
	*/
	function factory(node, index, parents) {
		const value = node && typeof node === "object" ? node : {};
		if (typeof value.type === "string") {
			const name = typeof value.tagName === "string" ? value.tagName : typeof value.name === "string" ? value.name : void 0;
			Object.defineProperty(visit, "name", { value: "node (" + color(node.type + (name ? "<" + name + ">" : "")) + ")" });
		}
		return visit;
		function visit() {
			/** @type {Readonly<ActionTuple>} */
			let result = empty;
			/** @type {Readonly<ActionTuple>} */
			let subresult;
			/** @type {number} */
			let offset;
			/** @type {Array<UnistParent>} */
			let grandparents;
			if (!test || is(node, index, parents[parents.length - 1] || void 0)) {
				result = toResult(visitor(node, parents));
				if (result[0] === false) return result;
			}
			if ("children" in node && node.children) {
				const nodeAsParent = node;
				if (nodeAsParent.children && result[0] !== "skip") {
					offset = (reverse ? nodeAsParent.children.length : -1) + step;
					grandparents = parents.concat(nodeAsParent);
					while (offset > -1 && offset < nodeAsParent.children.length) {
						const child = nodeAsParent.children[offset];
						subresult = factory(child, offset, grandparents)();
						if (subresult[0] === false) return subresult;
						offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
					}
				}
			}
			return result;
		}
	}
}
/**
* Turn a return value into a clean result.
*
* @param {VisitorResult} value
*   Valid return values from visitors.
* @returns {Readonly<ActionTuple>}
*   Clean result.
*/
function toResult(value) {
	if (Array.isArray(value)) return value;
	if (typeof value === "number") return [true, value];
	return value === null || value === void 0 ? empty : [value];
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-find-and-replace@3.0.3/node_modules/mdast-util-find-and-replace/lib/index.js
/**
* @import {Nodes, Parents, PhrasingContent, Root, Text} from 'mdast'
* @import {BuildVisitor, Test, VisitorResult} from 'unist-util-visit-parents'
*/
/**
* @typedef RegExpMatchObject
*   Info on the match.
* @property {number} index
*   The index of the search at which the result was found.
* @property {string} input
*   A copy of the search string in the text node.
* @property {[...Array<Parents>, Text]} stack
*   All ancestors of the text node, where the last node is the text itself.
*
* @typedef {RegExp | string} Find
*   Pattern to find.
*
*   Strings are escaped and then turned into global expressions.
*
* @typedef {Array<FindAndReplaceTuple>} FindAndReplaceList
*   Several find and replaces, in array form.
*
* @typedef {[Find, Replace?]} FindAndReplaceTuple
*   Find and replace in tuple form.
*
* @typedef {ReplaceFunction | string | null | undefined} Replace
*   Thing to replace with.
*
* @callback ReplaceFunction
*   Callback called when a search matches.
* @param {...any} parameters
*   The parameters are the result of corresponding search expression:
*
*   * `value` (`string`) — whole match
*   * `...capture` (`Array<string>`) — matches from regex capture groups
*   * `match` (`RegExpMatchObject`) — info on the match
* @returns {Array<PhrasingContent> | PhrasingContent | string | false | null | undefined}
*   Thing to replace with.
*
*   * when `null`, `undefined`, `''`, remove the match
*   * …or when `false`, do not replace at all
*   * …or when `string`, replace with a text node of that value
*   * …or when `Node` or `Array<Node>`, replace with those nodes
*
* @typedef {[RegExp, ReplaceFunction]} Pair
*   Normalized find and replace.
*
* @typedef {Array<Pair>} Pairs
*   All find and replaced.
*
* @typedef Options
*   Configuration.
* @property {Test | null | undefined} [ignore]
*   Test for which nodes to ignore (optional).
*/
/**
* Find patterns in a tree and replace them.
*
* The algorithm searches the tree in *preorder* for complete values in `Text`
* nodes.
* Partial matches are not supported.
*
* @param {Nodes} tree
*   Tree to change.
* @param {FindAndReplaceList | FindAndReplaceTuple} list
*   Patterns to find.
* @param {Options | null | undefined} [options]
*   Configuration (when `find` is not `Find`).
* @returns {undefined}
*   Nothing.
*/
function findAndReplace(tree, list, options) {
	const ignored = convert((options || {}).ignore || []);
	const pairs = toPairs(list);
	let pairIndex = -1;
	while (++pairIndex < pairs.length) visitParents(tree, "text", visitor);
	/**
	* Visit a text node, and handle it if it is not in an ignored parent.
	*
	* @type {BuildVisitor<Root, 'text'>}
	*/
	function visitor(node, parents) {
		let index = -1;
		/** @type {Parents | undefined} */
		let grandparent;
		while (++index < parents.length) {
			const parent = parents[index];
			/** @type {Array<Nodes> | undefined} */
			const siblings = grandparent ? grandparent.children : void 0;
			if (ignored(parent, siblings ? siblings.indexOf(parent) : void 0, grandparent)) return;
			grandparent = parent;
		}
		if (grandparent) return handler(node, parents);
	}
	/**
	* Handle a text node which is not in an ignored parent.
	*
	* @param {Text} node
	*   Text node to search in.
	* @param {Array<Parents>} parents
	*   Ancestors of `node`.
	* @returns {VisitorResult}
	*   Where to continue visiting.
	*/
	function handler(node, parents) {
		const parent = parents[parents.length - 1];
		const find = pairs[pairIndex][0];
		const replace = pairs[pairIndex][1];
		let start = 0;
		const index = parent.children.indexOf(node);
		let change = false;
		/** @type {Array<PhrasingContent>} */
		let nodes = [];
		find.lastIndex = 0;
		let match = find.exec(node.value);
		while (match) {
			const position = match.index;
			/** @type {RegExpMatchObject} */
			const matchObject = {
				index: match.index,
				input: match.input,
				stack: [...parents, node]
			};
			let value = replace(...match, matchObject);
			if (typeof value === "string") value = value.length > 0 ? {
				type: "text",
				value
			} : void 0;
			if (value === false) find.lastIndex = position + 1;
			else {
				if (start !== position) add({
					type: "text",
					value: node.value.slice(start, position)
				});
				if (Array.isArray(value)) for (const child of value) add(child);
				else if (value) add(value);
				start = position + match[0].length;
				change = true;
			}
			if (!find.global) break;
			match = find.exec(node.value);
		}
		if (change) {
			if (start < node.value.length) add({
				type: "text",
				value: node.value.slice(start)
			});
			parent.children.splice(index, 1, ...nodes);
		} else nodes = [node];
		return index + nodes.length;
		/**
		* Add a node.
		*
		* @param {PhrasingContent} child
		*   Node to add.
		* @returns {undefined}
		*   Nothing.
		*/
		function add(child) {
			const previous = nodes[nodes.length - 1];
			if (previous && previous.type === "text" && child.type === "text") previous.value += child.value;
			else nodes.push(child);
		}
	}
}
/**
* Turn a tuple or a list of tuples into pairs.
*
* @param {FindAndReplaceList | FindAndReplaceTuple} tupleOrList
*   Schema.
* @returns {Pairs}
*   Clean pairs.
*/
function toPairs(tupleOrList) {
	if (!Array.isArray(tupleOrList)) throw new TypeError("Expected find and replace tuple or list of tuples");
	/** @type {Pairs} */
	const result = [];
	/** @type {FindAndReplaceList} */
	const list = !tupleOrList[0] || Array.isArray(tupleOrList[0]) ? tupleOrList : [tupleOrList];
	let index = -1;
	while (++index < list.length) {
		const tuple = list[index];
		result.push([toExpression(tuple[0]), toFunction(tuple[1])]);
	}
	return result;
}
/**
* Turn a find into an expression.
*
* @param {Find} find
*   Pattern to find.
* @returns {RegExp}
*   Global expression.
*/
function toExpression(find) {
	return typeof find === "string" ? new RegExp(escapeStringRegexp(find), "g") : find;
}
/**
* Turn a replace into a function.
*
* @param {Replace} replace
*   Thing to replace with.
* @returns {ReplaceFunction}
*   Function that returns that thing.
*/
function toFunction(replace) {
	return typeof replace === "function" ? replace : function() {
		return replace;
	};
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-gfm-autolink-literal@2.0.1/node_modules/mdast-util-gfm-autolink-literal/lib/index.js
/**
* @import {RegExpMatchObject, ReplaceFunction} from 'mdast-util-find-and-replace'
* @import {CompileContext, Extension as FromMarkdownExtension, Handle as FromMarkdownHandle, Transform as FromMarkdownTransform} from 'mdast-util-from-markdown'
* @import {ConstructName, Options as ToMarkdownExtension} from 'mdast-util-to-markdown'
* @import {Link, PhrasingContent} from 'mdast'
*/
/** @type {ConstructName} */
var inConstruct = "phrasing";
/** @type {Array<ConstructName>} */
var notInConstruct = [
	"autolink",
	"link",
	"image",
	"label"
];
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM autolink
* literals in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM autolink literals.
*/
function gfmAutolinkLiteralFromMarkdown() {
	return {
		transforms: [transformGfmAutolinkLiterals],
		enter: {
			literalAutolink: enterLiteralAutolink,
			literalAutolinkEmail: enterLiteralAutolinkValue,
			literalAutolinkHttp: enterLiteralAutolinkValue,
			literalAutolinkWww: enterLiteralAutolinkValue
		},
		exit: {
			literalAutolink: exitLiteralAutolink,
			literalAutolinkEmail: exitLiteralAutolinkEmail,
			literalAutolinkHttp: exitLiteralAutolinkHttp,
			literalAutolinkWww: exitLiteralAutolinkWww
		}
	};
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM autolink
* literals in markdown.
*
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM autolink literals.
*/
function gfmAutolinkLiteralToMarkdown() {
	return { unsafe: [
		{
			character: "@",
			before: "[+\\-.\\w]",
			after: "[\\-.\\w]",
			inConstruct,
			notInConstruct
		},
		{
			character: ".",
			before: "[Ww]",
			after: "[\\-.\\w]",
			inConstruct,
			notInConstruct
		},
		{
			character: ":",
			before: "[ps]",
			after: "\\/",
			inConstruct,
			notInConstruct
		}
	] };
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterLiteralAutolink(token) {
	this.enter({
		type: "link",
		title: null,
		url: "",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterLiteralAutolinkValue(token) {
	this.config.enter.autolinkProtocol.call(this, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolinkHttp(token) {
	this.config.exit.autolinkProtocol.call(this, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolinkWww(token) {
	this.config.exit.data.call(this, token);
	const node = this.stack[this.stack.length - 1];
	node.type;
	node.url = "http://" + this.sliceSerialize(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolinkEmail(token) {
	this.config.exit.autolinkEmail.call(this, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolink(token) {
	this.exit(token);
}
/** @type {FromMarkdownTransform} */
function transformGfmAutolinkLiterals(tree) {
	findAndReplace(tree, [[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, findUrl], [/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu, findEmail]], { ignore: ["link", "linkReference"] });
}
/**
* @type {ReplaceFunction}
* @param {string} _
* @param {string} protocol
* @param {string} domain
* @param {string} path
* @param {RegExpMatchObject} match
* @returns {Array<PhrasingContent> | Link | false}
*/
function findUrl(_, protocol, domain, path, match) {
	let prefix = "";
	if (!previous(match)) return false;
	if (/^w/i.test(protocol)) {
		domain = protocol + domain;
		protocol = "";
		prefix = "http://";
	}
	if (!isCorrectDomain(domain)) return false;
	const parts = splitUrl(domain + path);
	if (!parts[0]) return false;
	/** @type {Link} */
	const result = {
		type: "link",
		title: null,
		url: prefix + protocol + parts[0],
		children: [{
			type: "text",
			value: protocol + parts[0]
		}]
	};
	if (parts[1]) return [result, {
		type: "text",
		value: parts[1]
	}];
	return result;
}
/**
* @type {ReplaceFunction}
* @param {string} _
* @param {string} atext
* @param {string} label
* @param {RegExpMatchObject} match
* @returns {Link | false}
*/
function findEmail(_, atext, label, match) {
	if (!previous(match, true) || /[-\d_]$/.test(label)) return false;
	return {
		type: "link",
		title: null,
		url: "mailto:" + atext + "@" + label,
		children: [{
			type: "text",
			value: atext + "@" + label
		}]
	};
}
/**
* @param {string} domain
* @returns {boolean}
*/
function isCorrectDomain(domain) {
	const parts = domain.split(".");
	if (parts.length < 2 || parts[parts.length - 1] && (/_/.test(parts[parts.length - 1]) || !/[a-zA-Z\d]/.test(parts[parts.length - 1])) || parts[parts.length - 2] && (/_/.test(parts[parts.length - 2]) || !/[a-zA-Z\d]/.test(parts[parts.length - 2]))) return false;
	return true;
}
/**
* @param {string} url
* @returns {[string, string | undefined]}
*/
function splitUrl(url) {
	const trailExec = /[!"&'),.:;<>?\]}]+$/.exec(url);
	if (!trailExec) return [url, void 0];
	url = url.slice(0, trailExec.index);
	let trail = trailExec[0];
	let closingParenIndex = trail.indexOf(")");
	const openingParens = ccount(url, "(");
	let closingParens = ccount(url, ")");
	while (closingParenIndex !== -1 && openingParens > closingParens) {
		url += trail.slice(0, closingParenIndex + 1);
		trail = trail.slice(closingParenIndex + 1);
		closingParenIndex = trail.indexOf(")");
		closingParens++;
	}
	return [url, trail];
}
/**
* @param {RegExpMatchObject} match
* @param {boolean | null | undefined} [email=false]
* @returns {boolean}
*/
function previous(match, email) {
	const code = match.input.charCodeAt(match.index - 1);
	return (match.index === 0 || unicodeWhitespace(code) || unicodePunctuation(code)) && (!email || code !== 47);
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-gfm-footnote@2.1.0_supports-color@10.2.2/node_modules/mdast-util-gfm-footnote/lib/index.js
/**
* @import {
*   CompileContext,
*   Extension as FromMarkdownExtension,
*   Handle as FromMarkdownHandle
* } from 'mdast-util-from-markdown'
* @import {ToMarkdownOptions} from 'mdast-util-gfm-footnote'
* @import {
*   Handle as ToMarkdownHandle,
*   Map,
*   Options as ToMarkdownExtension
* } from 'mdast-util-to-markdown'
* @import {FootnoteDefinition, FootnoteReference} from 'mdast'
*/
footnoteReference.peek = footnoteReferencePeek;
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteCallString() {
	this.buffer();
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteCall(token) {
	this.enter({
		type: "footnoteReference",
		identifier: "",
		label: ""
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteDefinitionLabelString() {
	this.buffer();
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteDefinition(token) {
	this.enter({
		type: "footnoteDefinition",
		identifier: "",
		label: "",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteCallString(token) {
	const label = this.resume();
	const node = this.stack[this.stack.length - 1];
	node.type;
	node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
	node.label = label;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteCall(token) {
	this.exit(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteDefinitionLabelString(token) {
	const label = this.resume();
	const node = this.stack[this.stack.length - 1];
	node.type;
	node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
	node.label = label;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteDefinition(token) {
	this.exit(token);
}
/** @type {ToMarkdownHandle} */
function footnoteReferencePeek() {
	return "[";
}
/**
* @type {ToMarkdownHandle}
* @param {FootnoteReference} node
*/
function footnoteReference(node, _, state, info) {
	const tracker = state.createTracker(info);
	let value = tracker.move("[^");
	const exit = state.enter("footnoteReference");
	const subexit = state.enter("reference");
	value += tracker.move(state.safe(state.associationId(node), {
		after: "]",
		before: value
	}));
	subexit();
	exit();
	value += tracker.move("]");
	return value;
}
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM footnotes
* in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown`.
*/
function gfmFootnoteFromMarkdown() {
	return {
		enter: {
			gfmFootnoteCallString: enterFootnoteCallString,
			gfmFootnoteCall: enterFootnoteCall,
			gfmFootnoteDefinitionLabelString: enterFootnoteDefinitionLabelString,
			gfmFootnoteDefinition: enterFootnoteDefinition
		},
		exit: {
			gfmFootnoteCallString: exitFootnoteCallString,
			gfmFootnoteCall: exitFootnoteCall,
			gfmFootnoteDefinitionLabelString: exitFootnoteDefinitionLabelString,
			gfmFootnoteDefinition: exitFootnoteDefinition
		}
	};
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM footnotes
* in markdown.
*
* @param {ToMarkdownOptions | null | undefined} [options]
*   Configuration (optional).
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown`.
*/
function gfmFootnoteToMarkdown(options) {
	let firstLineBlank = false;
	if (options && options.firstLineBlank) firstLineBlank = true;
	return {
		handlers: {
			footnoteDefinition,
			footnoteReference
		},
		unsafe: [{
			character: "[",
			inConstruct: [
				"label",
				"phrasing",
				"reference"
			]
		}]
	};
	/**
	* @type {ToMarkdownHandle}
	* @param {FootnoteDefinition} node
	*/
	function footnoteDefinition(node, _, state, info) {
		const tracker = state.createTracker(info);
		let value = tracker.move("[^");
		const exit = state.enter("footnoteDefinition");
		const subexit = state.enter("label");
		value += tracker.move(state.safe(state.associationId(node), {
			before: value,
			after: "]"
		}));
		subexit();
		value += tracker.move("]:");
		if (node.children && node.children.length > 0) {
			tracker.shift(4);
			value += tracker.move((firstLineBlank ? "\n" : " ") + state.indentLines(state.containerFlow(node, tracker.current()), firstLineBlank ? mapAll : mapExceptFirst));
		}
		exit();
		return value;
	}
}
/** @type {Map} */
function mapExceptFirst(line, index, blank) {
	return index === 0 ? line : mapAll(line, index, blank);
}
/** @type {Map} */
function mapAll(line, index, blank) {
	return (blank ? "" : "    ") + line;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-gfm-strikethrough@2.0.1_supports-color@10.2.2/node_modules/mdast-util-gfm-strikethrough/lib/index.js
/**
* @import {Delete} from 'mdast'
* @import {
*   CompileContext,
*   Extension as FromMarkdownExtension,
*   Handle as FromMarkdownHandle
* } from 'mdast-util-from-markdown'
* @import {
*   Attention,
*   ConstructName,
*   Handle as ToMarkdownHandle,
*   Options as ToMarkdownExtension
* } from 'mdast-util-to-markdown'
*/
/**
* List of constructs that occur in phrasing (paragraphs, headings), but cannot
* contain strikethrough.
* So they sort of cancel each other out.
* Note: could use a better name.
*
* Note: keep in sync with: <https://github.com/syntax-tree/mdast-util-to-markdown/blob/8ce8dbf/lib/unsafe.js#L14>
*
* @type {Array<ConstructName>}
*/
var constructsWithoutStrikethrough = [
	"autolink",
	"destinationLiteral",
	"destinationRaw",
	"reference",
	"titleQuote",
	"titleApostrophe"
];
handleDelete.attention = attentionDelete;
handleDelete.peek = peekDelete;
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM
* strikethrough in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM strikethrough.
*/
function gfmStrikethroughFromMarkdown() {
	return {
		canContainEols: ["delete"],
		enter: { strikethrough: enterStrikethrough },
		exit: { strikethrough: exitStrikethrough }
	};
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM
* strikethrough in markdown.
*
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM strikethrough.
*/
function gfmStrikethroughToMarkdown() {
	return {
		handlers: { delete: handleDelete },
		unsafe: [{
			character: "~",
			inConstruct: "phrasing",
			notInConstruct: constructsWithoutStrikethrough
		}]
	};
}
/**
* Enter strikethrough.
*
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterStrikethrough(token) {
	this.enter({
		type: "delete",
		children: [],
		position: void 0
	}, token);
}
/**
* Exit strikethrough.
*
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitStrikethrough(token) {
	this.exit(token);
}
/**
* Serialize a delete node.
*
* @type {ToMarkdownHandle}
* @param {Delete} node
*   Node to serialize.
*/
function handleDelete(node, _, state, info) {
	const tracker = state.createTracker(info);
	const sequence = state.stack.includes("strikethrough") ? "~" : "~~";
	const exit = state.enter("strikethrough");
	let value = tracker.move(sequence);
	value += state.containerPhrasing(node, {
		...tracker.current(),
		before: value,
		after: "~"
	});
	value += tracker.move(sequence);
	exit();
	return value;
}
/**
* Serialize a delete node as attention.
*
* @type {Attention}
*/
function attentionDelete() {
	return {
		construct: "strikethrough",
		markers: ["~"],
		sizes: [2, 1]
	};
}
/**
* Peek the first character of a delete node.
*
* @type {ToMarkdownHandle}
*/
function peekDelete() {
	return "~";
}
//#endregion
//#region ../../node_modules/.pnpm/markdown-table@3.0.4/node_modules/markdown-table/index.js
/**
* @typedef {Options} MarkdownTableOptions
*   Configuration.
*/
/**
* @typedef Options
*   Configuration.
* @property {boolean | null | undefined} [alignDelimiters=true]
*   Whether to align the delimiters (default: `true`);
*   they are aligned by default:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   Pass `false` to make them staggered:
*
*   ```markdown
*   | Alpha | B |
*   | - | - |
*   | C | Delta |
*   ```
* @property {ReadonlyArray<string | null | undefined> | string | null | undefined} [align]
*   How to align columns (default: `''`);
*   one style for all columns or styles for their respective columns;
*   each style is either `'l'` (left), `'r'` (right), or `'c'` (center);
*   other values are treated as `''`, which doesn’t place the colon in the
*   alignment row but does align left;
*   *only the lowercased first character is used, so `Right` is fine.*
* @property {boolean | null | undefined} [delimiterEnd=true]
*   Whether to end each row with the delimiter (default: `true`).
*
*   > 👉 **Note**: please don’t use this: it could create fragile structures
*   > that aren’t understandable to some markdown parsers.
*
*   When `true`, there are ending delimiters:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   When `false`, there are no ending delimiters:
*
*   ```markdown
*   | Alpha | B
*   | ----- | -----
*   | C     | Delta
*   ```
* @property {boolean | null | undefined} [delimiterStart=true]
*   Whether to begin each row with the delimiter (default: `true`).
*
*   > 👉 **Note**: please don’t use this: it could create fragile structures
*   > that aren’t understandable to some markdown parsers.
*
*   When `true`, there are starting delimiters:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   When `false`, there are no starting delimiters:
*
*   ```markdown
*   Alpha | B     |
*   ----- | ----- |
*   C     | Delta |
*   ```
* @property {boolean | null | undefined} [padding=true]
*   Whether to add a space of padding between delimiters and cells
*   (default: `true`).
*
*   When `true`, there is padding:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   When `false`, there is no padding:
*
*   ```markdown
*   |Alpha|B    |
*   |-----|-----|
*   |C    |Delta|
*   ```
* @property {((value: string) => number) | null | undefined} [stringLength]
*   Function to detect the length of table cell content (optional);
*   this is used when aligning the delimiters (`|`) between table cells;
*   full-width characters and emoji mess up delimiter alignment when viewing
*   the markdown source;
*   to fix this, you can pass this function,
*   which receives the cell content and returns its “visible” size;
*   note that what is and isn’t visible depends on where the text is displayed.
*
*   Without such a function, the following:
*
*   ```js
*   markdownTable([
*     ['Alpha', 'Bravo'],
*     ['中文', 'Charlie'],
*     ['👩‍❤️‍👩', 'Delta']
*   ])
*   ```
*
*   Yields:
*
*   ```markdown
*   | Alpha | Bravo |
*   | - | - |
*   | 中文 | Charlie |
*   | 👩‍❤️‍👩 | Delta |
*   ```
*
*   With [`string-width`](https://github.com/sindresorhus/string-width):
*
*   ```js
*   import stringWidth from 'string-width'
*
*   markdownTable(
*     [
*       ['Alpha', 'Bravo'],
*       ['中文', 'Charlie'],
*       ['👩‍❤️‍👩', 'Delta']
*     ],
*     {stringLength: stringWidth}
*   )
*   ```
*
*   Yields:
*
*   ```markdown
*   | Alpha | Bravo   |
*   | ----- | ------- |
*   | 中文  | Charlie |
*   | 👩‍❤️‍👩    | Delta   |
*   ```
*/
/**
* @param {string} value
*   Cell value.
* @returns {number}
*   Cell size.
*/
function defaultStringLength(value) {
	return value.length;
}
/**
* Generate a markdown
* ([GFM](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables))
* table.
*
* @param {ReadonlyArray<ReadonlyArray<string | null | undefined>>} table
*   Table data (matrix of strings).
* @param {Readonly<Options> | null | undefined} [options]
*   Configuration (optional).
* @returns {string}
*   Result.
*/
function markdownTable(table, options) {
	const settings = options || {};
	const align = (settings.align || []).concat();
	const stringLength = settings.stringLength || defaultStringLength;
	/** @type {Array<number>} Character codes as symbols for alignment per column. */
	const alignments = [];
	/** @type {Array<Array<string>>} Cells per row. */
	const cellMatrix = [];
	/** @type {Array<Array<number>>} Sizes of each cell per row. */
	const sizeMatrix = [];
	/** @type {Array<number>} */
	const longestCellByColumn = [];
	let mostCellsPerRow = 0;
	let rowIndex = -1;
	while (++rowIndex < table.length) {
		/** @type {Array<string>} */
		const row = [];
		/** @type {Array<number>} */
		const sizes = [];
		let columnIndex = -1;
		if (table[rowIndex].length > mostCellsPerRow) mostCellsPerRow = table[rowIndex].length;
		while (++columnIndex < table[rowIndex].length) {
			const cell = serialize(table[rowIndex][columnIndex]);
			if (settings.alignDelimiters !== false) {
				const size = stringLength(cell);
				sizes[columnIndex] = size;
				if (longestCellByColumn[columnIndex] === void 0 || size > longestCellByColumn[columnIndex]) longestCellByColumn[columnIndex] = size;
			}
			row.push(cell);
		}
		cellMatrix[rowIndex] = row;
		sizeMatrix[rowIndex] = sizes;
	}
	let columnIndex = -1;
	if (typeof align === "object" && "length" in align) while (++columnIndex < mostCellsPerRow) alignments[columnIndex] = toAlignment(align[columnIndex]);
	else {
		const code = toAlignment(align);
		while (++columnIndex < mostCellsPerRow) alignments[columnIndex] = code;
	}
	columnIndex = -1;
	/** @type {Array<string>} */
	const row = [];
	/** @type {Array<number>} */
	const sizes = [];
	while (++columnIndex < mostCellsPerRow) {
		const code = alignments[columnIndex];
		let before = "";
		let after = "";
		if (code === 99) {
			before = ":";
			after = ":";
		} else if (code === 108) before = ":";
		else if (code === 114) after = ":";
		let size = settings.alignDelimiters === false ? 1 : Math.max(1, longestCellByColumn[columnIndex] - before.length - after.length);
		const cell = before + "-".repeat(size) + after;
		if (settings.alignDelimiters !== false) {
			size = before.length + size + after.length;
			if (size > longestCellByColumn[columnIndex]) longestCellByColumn[columnIndex] = size;
			sizes[columnIndex] = size;
		}
		row[columnIndex] = cell;
	}
	cellMatrix.splice(1, 0, row);
	sizeMatrix.splice(1, 0, sizes);
	rowIndex = -1;
	/** @type {Array<string>} */
	const lines = [];
	while (++rowIndex < cellMatrix.length) {
		const row = cellMatrix[rowIndex];
		const sizes = sizeMatrix[rowIndex];
		columnIndex = -1;
		/** @type {Array<string>} */
		const line = [];
		while (++columnIndex < mostCellsPerRow) {
			const cell = row[columnIndex] || "";
			let before = "";
			let after = "";
			if (settings.alignDelimiters !== false) {
				const size = longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0);
				const code = alignments[columnIndex];
				if (code === 114) before = " ".repeat(size);
				else if (code === 99) {
					if (size % 2) {
						before = " ".repeat(size / 2 + .5);
						after = " ".repeat(size / 2 - .5);
					} else {
						before = " ".repeat(size / 2);
						after = before;
					}
				} else after = " ".repeat(size);
			}
			if (settings.delimiterStart !== false && !columnIndex) line.push("|");
			if (settings.padding !== false && !(settings.alignDelimiters === false && cell === "") && (settings.delimiterStart !== false || columnIndex)) line.push(" ");
			if (settings.alignDelimiters !== false) line.push(before);
			line.push(cell);
			if (settings.alignDelimiters !== false) line.push(after);
			if (settings.padding !== false) line.push(" ");
			if (settings.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) line.push("|");
		}
		lines.push(settings.delimiterEnd === false ? line.join("").replace(/ +$/, "") : line.join(""));
	}
	return lines.join("\n");
}
/**
* @param {string | null | undefined} [value]
*   Value to serialize.
* @returns {string}
*   Result.
*/
function serialize(value) {
	return value === null || value === void 0 ? "" : String(value);
}
/**
* @param {string | null | undefined} value
*   Value.
* @returns {number}
*   Alignment.
*/
function toAlignment(value) {
	const code = typeof value === "string" ? value.codePointAt(0) : 0;
	return code === 67 || code === 99 ? 99 : code === 76 || code === 108 ? 108 : code === 82 || code === 114 ? 114 : 0;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-phrasing@4.1.0/node_modules/mdast-util-phrasing/lib/index.js
/**
* @typedef {import('mdast').Html} Html
* @typedef {import('mdast').PhrasingContent} PhrasingContent
*/
/**
* Check if the given value is *phrasing content*.
*
* > 👉 **Note**: Excludes `html`, which can be both phrasing or flow.
*
* @param node
*   Thing to check, typically `Node`.
* @returns
*   Whether `value` is phrasing content.
*/
var phrasing = convert([
	"break",
	"delete",
	"emphasis",
	"footnote",
	"footnoteReference",
	"image",
	"imageReference",
	"inlineCode",
	"inlineMath",
	"link",
	"linkReference",
	"mdxJsxTextElement",
	"mdxTextExpression",
	"strong",
	"text",
	"textDirective"
]);
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/blockquote.js
/**
* @import {Blockquote, Parents} from 'mdast'
* @import {Info, Map, State} from 'mdast-util-to-markdown'
*/
/**
* Serialize a blockquote node.
*
* @param {Blockquote} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function blockquote(node, _, state, info) {
	const exit = state.enter("blockquote");
	const tracker = state.createTracker(info);
	tracker.move("> ");
	tracker.shift(2);
	const value = state.indentLines(state.containerFlow(node, tracker.current()), map$1);
	exit();
	return value;
}
/**
* Indent lines w/ blockquote markers.
*
* @type {Map}
*/
function map$1(line, _, blank) {
	return ">" + (blank ? "" : " ") + line;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js
/**
* @import {ConstructName, Unsafe} from 'mdast-util-to-markdown'
*/
/**
* Check if a pattern is in scope based on the current stack of constructs.
*
* @param {Array<ConstructName>} stack
*   Current stack of constructs.
* @param {Unsafe} pattern
*   Pattern to check.
* @returns {boolean}
*   Whether the pattern is in scope.
*/
function patternInScope(stack, pattern) {
	return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
}
/**
* Check if any of the constructs in the list are present in the stack.
*
* @param {Array<ConstructName>} stack
*   Current stack of constructs.
* @param {Unsafe['inConstruct']} list
*   List of constructs to check for in the stack.
* @param {boolean} none
*   Value to return if the list is empty or not provided.
* @returns {boolean}
*   Whether any of the constructs in the list are present in the stack.
*/
function listInScope(stack, list, none) {
	if (typeof list === "string") list = [list];
	if (!list || list.length === 0) return none;
	let index = -1;
	while (++index < list.length) if (stack.includes(list[index])) return true;
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/break.js
/**
* @import {Break, Parents} from 'mdast'
* @import {Info, State} from 'mdast-util-to-markdown'
*/
/**
* Serialize a break node.
*
* @param {Break} _
*   Node to serialize.
* @param {Parents | undefined} _1
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function hardBreak(_, _1, state, info) {
	let index = -1;
	while (++index < state.unsafe.length) {
		const pattern = state.unsafe[index];
		if (pattern.character === "\n" && !pattern.before && !pattern.after && patternInScope(state.stack, pattern)) return /[\t ]/.test(info.before) ? "" : " ";
	}
	return "\\\n";
}
//#endregion
//#region ../../node_modules/.pnpm/longest-streak@3.1.0/node_modules/longest-streak/index.js
/**
* Get the count of the longest repeating streak of `substring` in `value`.
*
* @param {string} value
*   Content to search in.
* @param {string} substring
*   Substring to look for, typically one character.
* @returns {number}
*   Count of most frequent adjacent `substring`s in `value`.
*/
function longestStreak(value, substring) {
	const source = String(value);
	let index = source.indexOf(substring);
	let expected = index;
	let count = 0;
	let max = 0;
	if (typeof substring !== "string") throw new TypeError("Expected substring");
	while (index !== -1) {
		if (index === expected) {
			if (++count > max) max = count;
		} else count = 1;
		expected = index + substring.length;
		index = source.indexOf(substring, expected);
	}
	return max;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {Code} from 'mdast'
*/
/**
* Checks if a code block can be formatted as an indented code block.
*
* @param {Code} node
*   Node to check.
* @param {State} state
*   Info passed around.
* @returns {boolean}
*   Whether the code can be formatted as an indented code block.
*/
function formatCodeAsIndented(node, state) {
	return Boolean(state.options.fences === false && node.value && !node.lang && /[^\n\r ]/.test(node.value) && !/^[\t ]*(?:[\n\r]|$)|(?:^|[\n\r])[\t ]*$/.test(node.value));
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/check-fence.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* Checks the preferred fence option.
*
* @param {State} state
*   Info passed around.
* @returns {Exclude<Options['fence'], null | undefined>}
*   Preferred fence marker.
*/
function checkFence(state) {
	const marker = state.options.fence || "`";
	if (marker !== "`" && marker !== "~") throw new Error("Cannot serialize code with `" + marker + "` for `options.fence`, expected `` ` `` or `~`");
	return marker;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/code.js
/**
* @import {Info, Map, State} from 'mdast-util-to-markdown'
* @import {Code, Parents} from 'mdast'
*/
/**
* Serialize a code node.
*
* @param {Code} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function code(node, _, state, info) {
	const marker = checkFence(state);
	const raw = node.value || "";
	if (formatCodeAsIndented(node, state)) {
		const exit = state.enter("codeIndented");
		const value = state.indentLines(raw, map);
		exit();
		return value;
	}
	const tracker = state.createTracker(info);
	const sequence = marker.repeat(Math.max(longestStreak(raw, marker) + 1, 3));
	const exit = state.enter("codeFenced");
	const suffix = marker === "`" ? "GraveAccent" : "Tilde";
	let value = tracker.move(sequence);
	if (node.lang) {
		const subexit = state.enter(`codeFencedLang${suffix}`);
		value += tracker.move(state.safe(node.lang, {
			before: value,
			after: " ",
			encode: ["`"],
			...tracker.current()
		}));
		subexit();
	}
	if (node.lang && node.meta) {
		const subexit = state.enter(`codeFencedMeta${suffix}`);
		value += tracker.move(" ");
		value += tracker.move(state.safe(node.meta, {
			before: value,
			after: "\n",
			encode: ["`"],
			...tracker.current()
		}));
		subexit();
	}
	value += tracker.move("\n");
	if (raw) value += tracker.move(raw + "\n");
	value += tracker.move(sequence);
	exit();
	return value;
}
/**
* Indent lines w/ code indent.
*
* @type {Map}
*/
function map(line, _, blank) {
	return (blank ? "" : "    ") + line;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/check-quote.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* Checks the preferred quote option.
*
* @param {State} state
*   Info passed around.
* @returns {Exclude<Options['quote'], null | undefined>}
*   Preferred quote.
*/
function checkQuote(state) {
	const marker = state.options.quote || "\"";
	if (marker !== "\"" && marker !== "'") throw new Error("Cannot serialize title with `" + marker + "` for `options.quote`, expected `\"`, or `'`");
	return marker;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/definition.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Definition, Parents} from 'mdast'
*/
/**
* Serialize a definition node.
*
* @param {Definition} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function definition(node, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const exit = state.enter("definition");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("[");
	value += tracker.move(state.safe(state.associationId(node), {
		before: value,
		after: "]",
		...tracker.current()
	}));
	value += tracker.move("]: ");
	subexit();
	if (!node.url || /[\0- \u007F]/.test(node.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: node.title ? " " : "\n",
			...tracker.current()
		}));
	}
	subexit();
	if (node.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	exit();
	return value;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* Checks the preferred emphasis option.
*
* @param {State} state
*   Info passed around.
* @returns {Exclude<Options['emphasis'], null | undefined>}
*   Preferred emphasis marker.
*/
function checkEmphasis(state) {
	const marker = state.options.emphasis || "*";
	if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize emphasis with `" + marker + "` for `options.emphasis`, expected `*`, or `_`");
	return marker;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/emphasis.js
/**
* @import {AttentionInfo, Info, State} from 'mdast-util-to-markdown'
* @import {Emphasis, Parents} from 'mdast'
*/
emphasis.attention = attention$1;
emphasis.peek = peek$1;
/**
* Serialize an emphasis node.
*
* Attention is properly handled by `containerPhrasing`.
*
* @param {Emphasis} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function emphasis(node, _, state, info) {
	const exit = state.enter("phrasing");
	const value = state.containerPhrasing({
		type: "root",
		children: [node]
	}, info);
	exit();
	return value;
}
/**
* Serialize an emphasis node as attention.
*
* @param {Emphasis} _
*   Node to serialize.
* @param {State} state
*   Info passed around.
* @returns {AttentionInfo}
*   Info on how to serialize the node.
*/
function attention$1(_, state) {
	return {
		construct: "emphasis",
		markers: checkEmphasis(state) === "*" ? ["*", "_"] : ["_", "*"],
		sizes: [1]
	};
}
/**
* Peek at this node.
*
* @param {Emphasis} _
*   Node to serialize.
* @param {Parents | undefined} _1
*   Parent node.
* @param {State} state
*   Info passed around.
* @returns {string}
*   Start of the serialized markdown.
*/
function peek$1(_, _1, state) {
	return state.options.emphasis || "*";
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js
/**
* Encode a code point as a character reference.
*
* @param {number} code
*   Code point to encode.
* @returns {string}
*   Encoded character reference.
*/
function encodeCharacterReference(code) {
	return "&#x" + code.toString(16).toUpperCase() + ";";
}
//#endregion
//#region ../../node_modules/.pnpm/unist-util-visit@5.1.0/node_modules/unist-util-visit/lib/index.js
/**
* @import {Node as UnistNode, Parent as UnistParent} from 'unist'
* @import {VisitorResult} from 'unist-util-visit-parents'
*/
/**
* @typedef {Exclude<import('unist-util-is').Test, undefined> | undefined} Test
*   Test from `unist-util-is`.
*
*   Note: we have remove and add `undefined`, because otherwise when generating
*   automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
*   which doesn’t work when publishing on npm.
*/
/**
* @typedef {(
*   Fn extends (value: any) => value is infer Thing
*   ? Thing
*   : Fallback
* )} Predicate
*   Get the value of a type guard `Fn`.
* @template Fn
*   Value; typically function that is a type guard (such as `(x): x is Y`).
* @template Fallback
*   Value to yield if `Fn` is not a type guard.
*/
/**
* @typedef {(
*   Check extends null | undefined // No test.
*   ? Value
*   : Value extends {type: Check} // String (type) test.
*   ? Value
*   : Value extends Check // Partial test.
*   ? Value
*   : Check extends Function // Function test.
*   ? Predicate<Check, Value> extends Value
*     ? Predicate<Check, Value>
*     : never
*   : never // Some other test?
* )} MatchesOne
*   Check whether a node matches a primitive check in the type system.
* @template Value
*   Value; typically unist `Node`.
* @template Check
*   Value; typically `unist-util-is`-compatible test, but not arrays.
*/
/**
* @typedef {(
*   Check extends ReadonlyArray<any>
*   ? MatchesOne<Value, Check[number]>
*   : MatchesOne<Value, Check>
* )} Matches
*   Check whether a node matches a check in the type system.
* @template Value
*   Value; typically unist `Node`.
* @template Check
*   Value; typically `unist-util-is`-compatible test.
*/
/**
* @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10} Uint
*   Number; capped reasonably.
*/
/**
* @typedef {I extends 0 ? 1 : I extends 1 ? 2 : I extends 2 ? 3 : I extends 3 ? 4 : I extends 4 ? 5 : I extends 5 ? 6 : I extends 6 ? 7 : I extends 7 ? 8 : I extends 8 ? 9 : 10} Increment
*   Increment a number in the type system.
* @template {Uint} [I=0]
*   Index.
*/
/**
* @typedef {(
*   Node extends UnistParent
*   ? Node extends {children: Array<infer Children>}
*     ? Child extends Children ? Node : never
*     : never
*   : never
* )} InternalParent
*   Collect nodes that can be parents of `Child`.
* @template {UnistNode} Node
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
*/
/**
* @typedef {InternalParent<InclusiveDescendant<Tree>, Child>} Parent
*   Collect nodes in `Tree` that can be parents of `Child`.
* @template {UnistNode} Tree
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
*/
/**
* @typedef {(
*   Depth extends Max
*   ? never
*   :
*     | InternalParent<Node, Child>
*     | InternalAncestor<Node, InternalParent<Node, Child>, Max, Increment<Depth>>
* )} InternalAncestor
*   Collect nodes in `Tree` that can be ancestors of `Child`.
* @template {UnistNode} Node
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
* @template {Uint} [Max=10]
*   Max; searches up to this depth.
* @template {Uint} [Depth=0]
*   Current depth.
*/
/**
* @typedef {(
*   Tree extends UnistParent
*     ? Depth extends Max
*       ? Tree
*       : Tree | InclusiveDescendant<Tree['children'][number], Max, Increment<Depth>>
*     : Tree
* )} InclusiveDescendant
*   Collect all (inclusive) descendants of `Tree`.
*
*   > 👉 **Note**: for performance reasons, this seems to be the fastest way to
*   > recurse without actually running into an infinite loop, which the
*   > previous version did.
*   >
*   > Practically, a max of `2` is typically enough assuming a `Root` is
*   > passed, but it doesn’t improve performance.
*   > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
*   > Using up to `10` doesn’t hurt or help either.
* @template {UnistNode} Tree
*   Tree type.
* @template {Uint} [Max=10]
*   Max; searches up to this depth.
* @template {Uint} [Depth=0]
*   Current depth.
*/
/**
* @callback Visitor
*   Handle a node (matching `test`, if given).
*
*   Visitors are free to transform `node`.
*   They can also transform `parent`.
*
*   Replacing `node` itself, if `SKIP` is not returned, still causes its
*   descendants to be walked (which is a bug).
*
*   When adding or removing previous siblings of `node` (or next siblings, in
*   case of reverse), the `Visitor` should return a new `Index` to specify the
*   sibling to traverse after `node` is traversed.
*   Adding or removing next siblings of `node` (or previous siblings, in case
*   of reverse) is handled as expected without needing to return a new `Index`.
*
*   Removing the children property of `parent` still results in them being
*   traversed.
* @param {Visited} node
*   Found node.
* @param {Visited extends UnistNode ? number | undefined : never} index
*   Index of `node` in `parent`.
* @param {Ancestor extends UnistParent ? Ancestor | undefined : never} parent
*   Parent of `node`.
* @returns {VisitorResult}
*   What to do next.
*
*   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
*   An `Action` is treated as a tuple of `[Action]`.
*
*   Passing a tuple back only makes sense if the `Action` is `SKIP`.
*   When the `Action` is `EXIT`, that action can be returned.
*   When the `Action` is `CONTINUE`, `Index` can be returned.
* @template {UnistNode} [Visited=UnistNode]
*   Visited node type.
* @template {UnistParent} [Ancestor=UnistParent]
*   Ancestor type.
*/
/**
* @typedef {Visitor<Visited, Parent<Ancestor, Visited>>} BuildVisitorFromMatch
*   Build a typed `Visitor` function from a node and all possible parents.
*
*   It will infer which values are passed as `node` and which as `parent`.
* @template {UnistNode} Visited
*   Node type.
* @template {UnistParent} Ancestor
*   Parent type.
*/
/**
* @typedef {(
*   BuildVisitorFromMatch<
*     Matches<Descendant, Check>,
*     Extract<Descendant, UnistParent>
*   >
* )} BuildVisitorFromDescendants
*   Build a typed `Visitor` function from a list of descendants and a test.
*
*   It will infer which values are passed as `node` and which as `parent`.
* @template {UnistNode} Descendant
*   Node type.
* @template {Test} Check
*   Test type.
*/
/**
* @typedef {(
*   BuildVisitorFromDescendants<
*     InclusiveDescendant<Tree>,
*     Check
*   >
* )} BuildVisitor
*   Build a typed `Visitor` function from a tree and a test.
*
*   It will infer which values are passed as `node` and which as `parent`.
* @template {UnistNode} [Tree=UnistNode]
*   Node type.
* @template {Test} [Check=Test]
*   Test type.
*/
/**
* Visit nodes.
*
* This algorithm performs *depth-first* *tree traversal* in *preorder*
* (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
*
* You can choose for which nodes `visitor` is called by passing a `test`.
* For complex tests, you should test yourself in `visitor`, as it will be
* faster and will have improved type information.
*
* Walking the tree is an intensive task.
* Make use of the return values of the visitor when possible.
* Instead of walking a tree multiple times, walk it once, use `unist-util-is`
* to check if a node matches, and then perform different operations.
*
* You can change the tree.
* See `Visitor` for more info.
*
* @overload
* @param {Tree} tree
* @param {Check} check
* @param {BuildVisitor<Tree, Check>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @overload
* @param {Tree} tree
* @param {BuildVisitor<Tree>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @param {UnistNode} tree
*   Tree to traverse.
* @param {Visitor | Test} testOrVisitor
*   `unist-util-is`-compatible test (optional, omit to pass a visitor).
* @param {Visitor | boolean | null | undefined} [visitorOrReverse]
*   Handle each node (when test is omitted, pass `reverse`).
* @param {boolean | null | undefined} [maybeReverse=false]
*   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
* @returns {undefined}
*   Nothing.
*
* @template {UnistNode} Tree
*   Node type.
* @template {Test} Check
*   `unist-util-is`-compatible test.
*/
function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
	/** @type {boolean | null | undefined} */
	let reverse;
	/** @type {Test} */
	let test;
	/** @type {Visitor} */
	let visitor;
	if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
		test = void 0;
		visitor = testOrVisitor;
		reverse = visitorOrReverse;
	} else {
		test = testOrVisitor;
		visitor = visitorOrReverse;
		reverse = maybeReverse;
	}
	visitParents(tree, test, overload, reverse);
	/**
	* @param {UnistNode} node
	* @param {Array<UnistParent>} parents
	*/
	function overload(node, parents) {
		const parent = parents[parents.length - 1];
		const index = parent ? parent.children.indexOf(node) : void 0;
		return visitor(node, index, parent);
	}
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {Heading} from 'mdast'
*/
/**
* Checks if a heading can be formatted as a setext heading.
*
* @param {Heading} node
*   Node to check.
* @param {State} state
*   Info passed around.
* @returns {boolean}
*   Whether the heading can be formatted as a setext heading.
*/
function formatHeadingAsSetext(node, state) {
	let literalWithBreak = false;
	visit(node, function(node) {
		if ("value" in node && /\r?\n|\r/.test(node.value) || node.type === "break") {
			literalWithBreak = true;
			return false;
		}
	});
	return Boolean((!node.depth || node.depth < 3) && toString(node) && (state.options.setext || literalWithBreak));
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/heading.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Heading, Parents} from 'mdast'
*/
/**
* Serialize a heading node.
*
* @param {Heading} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function heading(node, _, state, info) {
	const rank = Math.max(Math.min(6, node.depth || 1), 1);
	const tracker = state.createTracker(info);
	if (formatHeadingAsSetext(node, state)) {
		const exit = state.enter("headingSetext");
		const subexit = state.enter("phrasing");
		const value = state.containerPhrasing(node, {
			...tracker.current(),
			before: "\n",
			after: "\n"
		});
		subexit();
		exit();
		return value + "\n" + (rank === 1 ? "=" : "-").repeat(value.length - (Math.max(value.lastIndexOf("\r"), value.lastIndexOf("\n")) + 1));
	}
	const sequence = "#".repeat(rank);
	const exit = state.enter("headingAtx");
	const subexit = state.enter("phrasing");
	tracker.move(sequence + " ");
	let value = state.containerPhrasing(node, {
		before: "# ",
		after: "\n",
		...tracker.current()
	});
	const head = value.charCodeAt(0);
	if (head === 9 || head === 32) value = encodeCharacterReference(head) + value.slice(1);
	value = value ? sequence + " " + value : sequence;
	if (state.options.closeAtx) value += " " + sequence;
	subexit();
	exit();
	return value;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/html.js
/**
* @import {Html} from 'mdast'
*/
html.peek = htmlPeek;
/**
* Serialize an HTML node.
*
* @param {Html} node
*   Node to serialize.
* @returns {string}
*   Serialized markdown.
*/
function html(node) {
	return node.value || "";
}
/**
* Peek at this node.
*
* @returns {string}
*   Start of the serialized markdown.
*/
function htmlPeek() {
	return "<";
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/image.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Image, Parents} from 'mdast'
*/
image.peek = imagePeek;
/**
* Serialize an image node.
*
* @param {Image} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function image(node, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const exit = state.enter("image");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("![");
	value += tracker.move(state.safe(node.alt, {
		before: value,
		after: "]",
		...tracker.current()
	}));
	value += tracker.move("](");
	subexit();
	if (!node.url && node.title || /[\0- \u007F]/.test(node.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: node.title ? " " : ")",
			...tracker.current()
		}));
	}
	subexit();
	if (node.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	value += tracker.move(")");
	exit();
	return value;
}
/**
* Peek at this node.
*
* @returns {string}
*   Start of the serialized markdown.
*/
function imagePeek() {
	return "!";
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/image-reference.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {ImageReference, Parents} from 'mdast'
*/
imageReference.peek = imageReferencePeek;
/**
* Serialize an image reference node.
*
* @param {ImageReference} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function imageReference(node, _, state, info) {
	const type = node.referenceType;
	const exit = state.enter("imageReference");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("![");
	const alt = state.safe(node.alt, {
		before: value,
		after: "]",
		...tracker.current()
	});
	value += tracker.move(alt + "][");
	subexit();
	const stack = state.stack;
	state.stack = stack.filter(function(d) {
		return d !== "phrasing";
	});
	subexit = state.enter("reference");
	const reference = state.safe(state.associationId(node), {
		before: value,
		after: "]",
		...tracker.current()
	});
	subexit();
	state.stack = stack;
	exit();
	if (type === "full" || !alt || alt !== reference) value += tracker.move(reference + "]");
	else if (type === "shortcut") value = value.slice(0, -1);
	else value += tracker.move("]");
	return value;
}
/**
* Peek at this node.
*
* @returns {string}
*   Start of the serialized markdown.
*/
function imageReferencePeek() {
	return "!";
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/inline-code.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {InlineCode, Parents} from 'mdast'
*/
inlineCode.peek = inlineCodePeek;
/**
* Serialize an inline code node.
*
* @param {InlineCode} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @returns {string}
*   Serialized markdown.
*/
function inlineCode(node, _, state) {
	let value = node.value || "";
	let sequence = "`";
	let index = -1;
	while (new RegExp("(^|[^`])" + sequence + "([^`]|$)").test(value)) sequence += "`";
	if (/[^\n\r ]/.test(value) && (/^[\n\r ]/.test(value) && /[\n\r ]$/.test(value) || /^`|`$/.test(value))) value = " " + value + " ";
	while (++index < state.unsafe.length) {
		const pattern = state.unsafe[index];
		const expression = state.compilePattern(pattern);
		if (!pattern.atBreak) continue;
		/** @type {RegExpExecArray | null} */
		let match;
		while (match = expression.exec(value)) {
			let position = match.index;
			if (value.charCodeAt(position) === 10 && value.charCodeAt(position - 1) === 13) position--;
			value = value.slice(0, position) + " " + value.slice(match.index + 1);
		}
	}
	return sequence + value + sequence;
}
/**
* Peek at this node.
*
* @returns {string}
*   Start of the serialized markdown.
*/
function inlineCodePeek() {
	return "`";
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {Link} from 'mdast'
*/
/**
* Checks if a link can be formatted as an autolink.
*
* @param {Link} node
*   Node to check.
* @param {State} state
*   Info passed around.
* @returns {boolean}
*   Whether the link can be formatted as an autolink.
*/
function formatLinkAsAutolink(node, state) {
	const raw = toString(node);
	return Boolean(!state.options.resourceLink && node.url && !node.title && node.children && node.children.length === 1 && node.children[0].type === "text" && (raw === node.url || "mailto:" + raw === node.url) && /^[a-z][+\-.a-z]+:/i.test(node.url) && !/[\0- <>\u007F]/.test(node.url));
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/link.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Link, Parents} from 'mdast'
* @import {Exit} from '../types.js'
*/
link.peek = linkPeek;
/**
* Serialize a link node.
*
* @param {Link} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function link(node, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const tracker = state.createTracker(info);
	if (formatLinkAsAutolink(node, state)) {
		const stack = state.stack;
		state.stack = stack.filter(function(d) {
			return d !== "phrasing";
		});
		const exit = state.enter("autolink");
		let value = tracker.move("<");
		value += tracker.move(state.containerPhrasing(node, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
		exit();
		state.stack = stack;
		return value;
	}
	const exit = state.enter("link");
	let subexit = state.enter("label");
	let value = tracker.move("[");
	value += tracker.move(state.containerPhrasing(node, {
		before: value,
		after: "](",
		...tracker.current()
	}));
	value += tracker.move("](");
	subexit();
	if (!node.url && node.title || /[\0- \u007F]/.test(node.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node.url, {
			before: value,
			after: node.title ? " " : ")",
			...tracker.current()
		}));
	}
	subexit();
	if (node.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	value += tracker.move(")");
	exit();
	return value;
}
/**
* Peek at this node.
*
* @param {Link} node
*   Node to peek at.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @returns {string}
*   Start of the serialized markdown.
*/
function linkPeek(node, _, state) {
	return formatLinkAsAutolink(node, state) ? "<" : "[";
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/link-reference.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {LinkReference, Parents} from 'mdast'
*/
linkReference.peek = linkReferencePeek;
/**
* Serialize a link reference node.
*
* @param {LinkReference} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function linkReference(node, _, state, info) {
	const type = node.referenceType;
	const exit = state.enter("linkReference");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("[");
	const text = state.containerPhrasing(node, {
		before: value,
		after: "]",
		...tracker.current()
	});
	value += tracker.move(text + "][");
	subexit();
	const stack = state.stack;
	state.stack = stack.filter(function(d) {
		return d !== "phrasing";
	});
	subexit = state.enter("reference");
	const reference = state.safe(state.associationId(node), {
		before: value,
		after: "]",
		...tracker.current()
	});
	subexit();
	state.stack = stack;
	exit();
	if (type === "full" || !text || text !== reference) value += tracker.move(reference + "]");
	else if (type === "shortcut") value = value.slice(0, -1);
	else value += tracker.move("]");
	return value;
}
/**
* Peek at this node.
*
* @returns {string}
*   Start of the serialized markdown.
*/
function linkReferencePeek() {
	return "[";
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/check-bullet.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* Checks the preferred list bullet option.
*
* @param {State} state
*   Info passed around.
* @returns {Exclude<Options['bullet'], null | undefined>}
*   Preferred list bullet.
*/
function checkBullet(state) {
	const marker = state.options.bullet || "*";
	if (marker !== "*" && marker !== "+" && marker !== "-") throw new Error("Cannot serialize items with `" + marker + "` for `options.bullet`, expected `*`, `+`, or `-`");
	return marker;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* Checks the preferred alternate list bullet option.
*
* @param {State} state
*   Info passed around.
* @returns {Exclude<Options['bullet'], null | undefined>}
*   Preferred alternate list bullet.
*/
function checkBulletOther(state) {
	const bullet = checkBullet(state);
	const bulletOther = state.options.bulletOther;
	if (!bulletOther) return bullet === "*" ? "-" : "*";
	if (bulletOther !== "*" && bulletOther !== "+" && bulletOther !== "-") throw new Error("Cannot serialize items with `" + bulletOther + "` for `options.bulletOther`, expected `*`, `+`, or `-`");
	if (bulletOther === bullet) throw new Error("Expected `bullet` (`" + bullet + "`) and `bulletOther` (`" + bulletOther + "`) to be different");
	return bulletOther;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* Checks the preferred ordered list bullet option.
*
* @param {State} state
*   Info passed around.
* @returns {Exclude<Options['bulletOrdered'], null | undefined>}
*   Preferred ordered list bullet.
*/
function checkBulletOrdered(state) {
	const marker = state.options.bulletOrdered || ".";
	if (marker !== "." && marker !== ")") throw new Error("Cannot serialize items with `" + marker + "` for `options.bulletOrdered`, expected `.` or `)`");
	return marker;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/check-rule.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* Checks the preferred rule option.
*
* @param {State} state
*   Info passed around.
* @returns {Exclude<Options['rule'], null | undefined>}
*   Preferred rule marker.
*/
function checkRule(state) {
	const marker = state.options.rule || "*";
	if (marker !== "*" && marker !== "-" && marker !== "_") throw new Error("Cannot serialize rules with `" + marker + "` for `options.rule`, expected `*`, `-`, or `_`");
	return marker;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/list.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {List, Parents} from 'mdast'
*/
/**
* Serialize a list node.
*
* @param {List} node
*   Node to serialize.
* @param {Parents | undefined} parent
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function list(node, parent, state, info) {
	const exit = state.enter("list");
	const bulletCurrent = state.bulletCurrent;
	/** @type {string} */
	let bullet = node.ordered ? checkBulletOrdered(state) : checkBullet(state);
	/** @type {string} */
	const bulletOther = node.ordered ? bullet === "." ? ")" : "." : checkBulletOther(state);
	let useDifferentMarker = parent && state.bulletLastUsed ? bullet === state.bulletLastUsed : false;
	if (!node.ordered) {
		const firstListItem = node.children ? node.children[0] : void 0;
		if ((bullet === "*" || bullet === "-") && firstListItem && (!firstListItem.children || !firstListItem.children[0]) && state.stack[state.stack.length - 1] === "list" && state.stack[state.stack.length - 2] === "listItem" && state.stack[state.stack.length - 3] === "list" && state.stack[state.stack.length - 4] === "listItem" && state.indexStack[state.indexStack.length - 1] === 0 && state.indexStack[state.indexStack.length - 2] === 0 && state.indexStack[state.indexStack.length - 3] === 0) useDifferentMarker = true;
		if (checkRule(state) === bullet && firstListItem) {
			let index = -1;
			while (++index < node.children.length) {
				const item = node.children[index];
				if (item && item.type === "listItem" && item.children && item.children[0] && item.children[0].type === "thematicBreak") {
					useDifferentMarker = true;
					break;
				}
			}
		}
	}
	if (useDifferentMarker) bullet = bulletOther;
	state.bulletCurrent = bullet;
	const value = state.containerFlow(node, info);
	state.bulletLastUsed = bullet;
	state.bulletCurrent = bulletCurrent;
	exit();
	return value;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* Checks the preferred list item indent option.
*
* @param {State} state
*   Info passed around.
* @returns {Exclude<Options['listItemIndent'], null | undefined>}
*   Preferred list item indent.
*/
function checkListItemIndent(state) {
	const style = state.options.listItemIndent || "one";
	if (style !== "tab" && style !== "one" && style !== "mixed") throw new Error("Cannot serialize items with `" + style + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");
	return style;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/list-item.js
/**
* @import {Info, Map, State} from 'mdast-util-to-markdown'
* @import {ListItem, Parents} from 'mdast'
*/
/**
* Serialize a list item node.
*
* @param {ListItem} node
*   Node to serialize.
* @param {Parents | undefined} parent
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function listItem(node, parent, state, info) {
	const listItemIndent = checkListItemIndent(state);
	let bullet = state.bulletCurrent || checkBullet(state);
	if (parent && parent.type === "list" && parent.ordered) bullet = (typeof parent.start === "number" && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node)) + bullet;
	let size = bullet.length + 1;
	if (listItemIndent === "tab" || listItemIndent === "mixed" && (parent && parent.type === "list" && parent.spread || node.spread)) size = Math.ceil(size / 4) * 4;
	const tracker = state.createTracker(info);
	tracker.move(bullet + " ".repeat(size - bullet.length));
	tracker.shift(size);
	const exit = state.enter("listItem");
	const value = state.indentLines(state.containerFlow(node, tracker.current()), map);
	exit();
	return value;
	/**
	* Indent lines of the list item.
	*
	* @type {Map}
	*/
	function map(line, index, blank) {
		if (index) return (blank ? "" : " ".repeat(size)) + line;
		return (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/paragraph.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Paragraph, Parents} from 'mdast'
*/
/**
* Serialize a paragraph node.
*
* @param {Paragraph} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function paragraph(node, _, state, info) {
	const exit = state.enter("paragraph");
	const subexit = state.enter("phrasing");
	const value = state.containerPhrasing(node, info);
	subexit();
	exit();
	return value;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/root.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Parents, Root} from 'mdast'
*/
/**
* Serialize a root node.
*
* @param {Root} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function root(node, _, state, info) {
	if (!node.children.some(function(d) {
		return phrasing(d);
	})) return state.containerFlow(node, info);
	const exit = state.enter("phrasing");
	const value = state.containerPhrasing(node, info);
	exit();
	return value;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/check-strong.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* Checks the preferred strong option.
*
* @param {State} state
*   Info passed around.
* @returns {Exclude<Options['strong'], null | undefined>}
*   Preferred strong marker.
*/
function checkStrong(state) {
	const marker = state.options.strong || "*";
	if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize strong with `" + marker + "` for `options.strong`, expected `*`, or `_`");
	return marker;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/strong.js
/**
* @import {AttentionInfo, Info, State} from 'mdast-util-to-markdown'
* @import {Parents, Strong} from 'mdast'
*/
strong.attention = attention;
strong.peek = peek;
/**
* Serialize a strong node.
*
* Attention is properly handled by `containerPhrasing`.
*
* @param {Strong} node
*   Node to serialize.
* @param {Parents | undefined} _
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function strong(node, _, state, info) {
	const exit = state.enter("phrasing");
	const value = state.containerPhrasing({
		type: "root",
		children: [node]
	}, info);
	exit();
	return value;
}
/**
* Serialize a strong node as attention.
*
* @param {Strong} _
*   Node to serialize.
* @param {State} state
*   Info passed around.
* @returns {AttentionInfo}
*   Info on how to serialize the node.
*/
function attention(_, state) {
	return {
		construct: "strong",
		markers: checkStrong(state) === "*" ? ["*", "_"] : ["_", "*"],
		sizes: [2]
	};
}
/**
* Peek at this node.
*
* @param {Strong} _
*   Node to serialize.
* @param {Parents | undefined} _1
*   Parent node.
* @param {State} state
*   Info passed around.
* @returns {string}
*   Start of the serialized markdown.
*/
function peek(_, _1, state) {
	return state.options.strong || "*";
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/text.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Parents, Text} from 'mdast'
*/
/**
* Serialize a text node.
*
* @param {Text} node
*   Node to serialize.
* @param {Parents | undefined} parent
*   Parent node.
* @param {State} state
*   Info passed around.
* @param {Info} info
*   Info on surrounding context.
* @returns {string}
*   Serialized markdown.
*/
function text(node, parent, state, info) {
	/* c8 ignore next -- parent always passed */
	const siblings = parent ? parent.children : [];
	const index = siblings.indexOf(node);
	return state.safe(node.value, {
		...info,
		afterNode: siblings[index + 1],
		beforeNode: siblings[index - 1]
	});
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* Checks the preferred rule repetition option.
*
* @param {State} state
*   Info passed around.
* @returns {Exclude<Options['ruleRepetition'], null | undefined>}
*   Preferred rule repetition.
*/
function checkRuleRepetition(state) {
	const repetition = state.options.ruleRepetition || 3;
	if (repetition < 3) throw new Error("Cannot serialize rules with repetition `" + repetition + "` for `options.ruleRepetition`, expected `3` or more");
	return repetition;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {Parents, ThematicBreak} from 'mdast'
*/
/**
* Serialize a thematic break node.
*
* @param {ThematicBreak} _
*   Node to serialize.
* @param {Parents | undefined} _1
*   Parent node.
* @param {State} state
*   Info passed around.
* @returns {string}
*   Serialized markdown.
*/
function thematicBreak(_, _1, state) {
	const value = (checkRule(state) + (state.options.ruleSpaces ? " " : "")).repeat(checkRuleRepetition(state));
	return state.options.ruleSpaces ? value.slice(0, -1) : value;
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.2.0/node_modules/mdast-util-to-markdown/lib/handle/index.js
/**
* Default (CommonMark) handlers.
*/
var handle = {
	blockquote,
	break: hardBreak,
	code,
	definition,
	emphasis,
	hardBreak,
	heading,
	html,
	image,
	imageReference,
	inlineCode,
	link,
	linkReference,
	list,
	listItem,
	paragraph,
	root,
	strong,
	text,
	thematicBreak
};
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-gfm-table@2.0.0_supports-color@10.2.2/node_modules/mdast-util-gfm-table/lib/index.js
/**
* @typedef {import('mdast').InlineCode} InlineCode
* @typedef {import('mdast').Table} Table
* @typedef {import('mdast').TableCell} TableCell
* @typedef {import('mdast').TableRow} TableRow
*
* @typedef {import('markdown-table').Options} MarkdownTableOptions
*
* @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
* @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
* @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
*
* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
* @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
* @typedef {import('mdast-util-to-markdown').State} State
* @typedef {import('mdast-util-to-markdown').Info} Info
*/
/**
* @typedef Options
*   Configuration.
* @property {boolean | null | undefined} [tableCellPadding=true]
*   Whether to add a space of padding between delimiters and cells (default:
*   `true`).
* @property {boolean | null | undefined} [tablePipeAlign=true]
*   Whether to align the delimiters (default: `true`).
* @property {MarkdownTableOptions['stringLength'] | null | undefined} [stringLength]
*   Function to detect the length of table cell content, used when aligning
*   the delimiters between cells (optional).
*/
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM tables in
* markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM tables.
*/
function gfmTableFromMarkdown() {
	return {
		enter: {
			table: enterTable,
			tableData: enterCell,
			tableHeader: enterCell,
			tableRow: enterRow
		},
		exit: {
			codeText: exitCodeText,
			table: exitTable,
			tableData: exit,
			tableHeader: exit,
			tableRow: exit
		}
	};
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterTable(token) {
	const align = token._align;
	this.enter({
		type: "table",
		align: align.map(function(d) {
			return d === "none" ? null : d;
		}),
		children: []
	}, token);
	this.data.inTable = true;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitTable(token) {
	this.exit(token);
	this.data.inTable = void 0;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterRow(token) {
	this.enter({
		type: "tableRow",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exit(token) {
	this.exit(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterCell(token) {
	this.enter({
		type: "tableCell",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitCodeText(token) {
	let value = this.resume();
	if (this.data.inTable) value = value.replace(/\\([\\|])/g, replace);
	const node = this.stack[this.stack.length - 1];
	node.type;
	node.value = value;
	this.exit(token);
}
/**
* @param {string} $0
* @param {string} $1
* @returns {string}
*/
function replace($0, $1) {
	return $1 === "|" ? $1 : $0;
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM tables in
* markdown.
*
* @param {Options | null | undefined} [options]
*   Configuration.
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM tables.
*/
function gfmTableToMarkdown(options) {
	const settings = options || {};
	const padding = settings.tableCellPadding;
	const alignDelimiters = settings.tablePipeAlign;
	const stringLength = settings.stringLength;
	const around = padding ? " " : "|";
	return {
		unsafe: [
			{
				character: "\r",
				inConstruct: "tableCell"
			},
			{
				character: "\n",
				inConstruct: "tableCell"
			},
			{
				atBreak: true,
				character: "|",
				after: "[	 :-]"
			},
			{
				character: "|",
				inConstruct: "tableCell"
			},
			{
				atBreak: true,
				character: ":",
				after: "-"
			},
			{
				atBreak: true,
				character: "-",
				after: "[:|-]"
			}
		],
		handlers: {
			inlineCode: inlineCodeWithTable,
			table: handleTable,
			tableCell: handleTableCell,
			tableRow: handleTableRow
		}
	};
	/**
	* @type {ToMarkdownHandle}
	* @param {Table} node
	*/
	function handleTable(node, _, state, info) {
		return serializeData(handleTableAsData(node, state, info), node.align);
	}
	/**
	* This function isn’t really used normally, because we handle rows at the
	* table level.
	* But, if someone passes in a table row, this ensures we make somewhat sense.
	*
	* @type {ToMarkdownHandle}
	* @param {TableRow} node
	*/
	function handleTableRow(node, _, state, info) {
		const value = serializeData([handleTableRowAsData(node, state, info)]);
		return value.slice(0, value.indexOf("\n"));
	}
	/**
	* @type {ToMarkdownHandle}
	* @param {TableCell} node
	*/
	function handleTableCell(node, _, state, info) {
		const exit = state.enter("tableCell");
		const subexit = state.enter("phrasing");
		const value = state.containerPhrasing(node, {
			...info,
			before: around,
			after: around
		});
		subexit();
		exit();
		return value;
	}
	/**
	* @param {Array<Array<string>>} matrix
	* @param {Array<string | null | undefined> | null | undefined} [align]
	*/
	function serializeData(matrix, align) {
		return markdownTable(matrix, {
			align,
			alignDelimiters,
			padding,
			stringLength
		});
	}
	/**
	* @param {Table} node
	* @param {State} state
	* @param {Info} info
	*/
	function handleTableAsData(node, state, info) {
		const children = node.children;
		let index = -1;
		/** @type {Array<Array<string>>} */
		const result = [];
		const subexit = state.enter("table");
		while (++index < children.length) result[index] = handleTableRowAsData(children[index], state, info);
		subexit();
		return result;
	}
	/**
	* @param {TableRow} node
	* @param {State} state
	* @param {Info} info
	*/
	function handleTableRowAsData(node, state, info) {
		const children = node.children;
		let index = -1;
		/** @type {Array<string>} */
		const result = [];
		const subexit = state.enter("tableRow");
		while (++index < children.length) result[index] = handleTableCell(children[index], node, state, info);
		subexit();
		return result;
	}
	/**
	* @type {ToMarkdownHandle}
	* @param {InlineCode} node
	*/
	function inlineCodeWithTable(node, parent, state) {
		let value = handle.inlineCode(node, parent, state);
		if (state.stack.includes("tableCell")) value = value.replace(/\|/g, "\\$&");
		return value;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-gfm-task-list-item@2.0.0_supports-color@10.2.2/node_modules/mdast-util-gfm-task-list-item/lib/index.js
/**
* @typedef {import('mdast').ListItem} ListItem
* @typedef {import('mdast').Paragraph} Paragraph
* @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
* @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
* @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
* @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
*/
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM task
* list items in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM task list items.
*/
function gfmTaskListItemFromMarkdown() {
	return { exit: {
		taskListCheckValueChecked: exitCheck,
		taskListCheckValueUnchecked: exitCheck,
		paragraph: exitParagraphWithTaskListItem
	} };
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM task list
* items in markdown.
*
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM task list items.
*/
function gfmTaskListItemToMarkdown() {
	return {
		unsafe: [{
			atBreak: true,
			character: "-",
			after: "[:|-]"
		}],
		handlers: { listItem: listItemWithTaskListItem }
	};
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitCheck(token) {
	const node = this.stack[this.stack.length - 2];
	node.type;
	node.checked = token.type === "taskListCheckValueChecked";
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitParagraphWithTaskListItem(token) {
	const parent = this.stack[this.stack.length - 2];
	if (parent && parent.type === "listItem" && typeof parent.checked === "boolean") {
		const node = this.stack[this.stack.length - 1];
		node.type;
		const head = node.children[0];
		if (head && head.type === "text") {
			const siblings = parent.children;
			let index = -1;
			/** @type {Paragraph | undefined} */
			let firstParaghraph;
			while (++index < siblings.length) {
				const sibling = siblings[index];
				if (sibling.type === "paragraph") {
					firstParaghraph = sibling;
					break;
				}
			}
			if (firstParaghraph === node) {
				head.value = head.value.slice(1);
				if (head.value.length === 0) node.children.shift();
				else if (node.position && head.position && typeof head.position.start.offset === "number") {
					head.position.start.column++;
					head.position.start.offset++;
					node.position.start = Object.assign({}, head.position.start);
				}
			}
		}
	}
	this.exit(token);
}
/**
* @type {ToMarkdownHandle}
* @param {ListItem} node
*/
function listItemWithTaskListItem(node, parent, state, info) {
	const head = node.children[0];
	const checkable = typeof node.checked === "boolean" && head && head.type === "paragraph";
	const checkbox = "[" + (node.checked ? "x" : " ") + "] ";
	const tracker = state.createTracker(info);
	if (checkable) tracker.move(checkbox);
	let value = handle.listItem(node, parent, state, {
		...info,
		...tracker.current()
	});
	if (checkable) value = value.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, check);
	return value;
	/**
	* @param {string} $0
	* @returns {string}
	*/
	function check($0) {
		return $0 + checkbox;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/mdast-util-gfm@3.1.0_supports-color@10.2.2/node_modules/mdast-util-gfm/lib/index.js
/**
* @import {Extension as FromMarkdownExtension} from 'mdast-util-from-markdown'
* @import {Options} from 'mdast-util-gfm'
* @import {Options as ToMarkdownExtension} from 'mdast-util-to-markdown'
*/
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM (autolink
* literals, footnotes, strikethrough, tables, tasklists).
*
* @returns {Array<FromMarkdownExtension>}
*   Extension for `mdast-util-from-markdown` to enable GFM (autolink literals,
*   footnotes, strikethrough, tables, tasklists).
*/
function gfmFromMarkdown() {
	return [
		gfmAutolinkLiteralFromMarkdown(),
		gfmFootnoteFromMarkdown(),
		gfmStrikethroughFromMarkdown(),
		gfmTableFromMarkdown(),
		gfmTaskListItemFromMarkdown()
	];
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM (autolink
* literals, footnotes, strikethrough, tables, tasklists).
*
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM (autolink literals,
*   footnotes, strikethrough, tables, tasklists).
*/
function gfmToMarkdown(options) {
	return { extensions: [
		gfmAutolinkLiteralToMarkdown(),
		gfmFootnoteToMarkdown(options),
		gfmStrikethroughToMarkdown(),
		gfmTableToMarkdown(options),
		gfmTaskListItemToMarkdown()
	] };
}
//#endregion
export { gfmFromMarkdown, gfmToMarkdown };
