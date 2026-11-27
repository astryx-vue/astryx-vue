/**
 * @file switchFill.ts
 * @input Switch's native input and its track
 * @output readFillInState: the track's computed fill as the theme paints it
 *   in a given state, read in place
 * @position Read by switchTouchVisuals.ts for the colour fade under a finger
 *
 * The track's fill follows the input's `:checked` (switch.css). The colour
 * fade needs the fill of the state the track is not in: the input's checked
 * state is swapped, the colour read and the state swapped back in the same
 * task, so nothing paints in between and no event fires.
 */

/** The track's computed fill when the input's checked state is `isOn`. */
export function readFillInState(input: HTMLInputElement, track: HTMLElement, isOn: boolean): string {
  const saved = input.checked
  // A fill the controller holds inline is not the theme's: it steps aside too.
  const held = track.style.getPropertyValue('background-color')
  input.checked = isOn
  if (held !== '')
    track.style.removeProperty('background-color')
  try {
    return getComputedStyle(track).backgroundColor
  }
  finally {
    input.checked = saved
    if (held !== '')
      track.style.setProperty('background-color', held)
  }
}
