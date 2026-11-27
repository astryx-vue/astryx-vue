/**
 * @file streamFollowing.ts
 * @input The scroll-anchoring owner
 * @output markFollowing, which the stream scroll calls with each change of its
 *   lock, and isFollowingNewest, which ChatLayout's keyboard reads
 * @position Internal to useChatStreamScroll and Chat; not exported
 */

import { setScrollAnchoringOff } from './scrollAnchoring.js'

// The scrollers whose stream scroll follows the newest message now, kept in
// step with each hook's lock.
const following = new WeakSet<Element>()

/**
 * Whether the stream scroll on `scroller` follows its newest message now, as
 * its lock says.
 */
export function isFollowingNewest(scroller: Element): boolean {
  return following.has(scroller)
}

/**
 * The lock's marks on the scroller: anchoring off while the hook follows, and
 * the state `isFollowingNewest` reads.
 */
export function markFollowing(el: Element, locked: boolean): void {
  setScrollAnchoringOff(el, locked)
  if (locked)
    following.add(el)
  else
    following.delete(el)
}
