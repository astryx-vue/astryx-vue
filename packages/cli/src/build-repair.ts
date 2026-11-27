/**
 * Reads an idea's English words the way a person meant them when the spelling
 * is slightly off: a page name written joined ("kanbanboard"), a word split in
 * two ("log in"), or two neighbouring letters swapped ("dashbaord"). Only words
 * no template uses are touched, so a word that already matches is never changed.
 */

function known(vocabulary: Set<string>, term: string): boolean {
  return vocabulary.has(term) || (term.length > 3 && term.endsWith('s') && vocabulary.has(term.slice(0, -1)))
}

function swappedForm(vocabulary: Set<string>, term: string): string | null {
  for (let index = 0; index < term.length - 1; index++) {
    if (term[index] === term[index + 1])
      continue
    const swapped = `${term.slice(0, index)}${term[index + 1]}${term[index]}${term.slice(index + 2)}`
    if (known(vocabulary, swapped))
      return swapped
  }
  return null
}

/**
 * @param terms the idea's usable terms, as `ideaTerms` produced them
 * @param idea the idea as typed, so neighbouring words can be rejoined
 * @param vocabulary every English word the templates use
 * @param joinedNames template names written without separators, mapped to their words
 */
export function repairTerms(
  terms: string[],
  idea: string,
  vocabulary: Set<string>,
  joinedNames: Map<string, string[]>,
): string[] {
  const result = [...terms]
  const replaced = new Set<string>()

  const runs = idea.toLowerCase().match(/[a-z0-9]+/g) ?? []
  for (let index = 0; index < runs.length - 1; index++) {
    const [first, second] = [runs[index], runs[index + 1]]
    const joined = first + second
    if (vocabulary.has(joined) && !(known(vocabulary, first) && known(vocabulary, second))) {
      result.push(joined)
      replaced.add(first)
      replaced.add(second)
    }
  }

  for (const term of terms) {
    if (!/^[a-z0-9]+$/.test(term) || known(vocabulary, term))
      continue
    const parts = joinedNames.get(term)
    if (parts) {
      result.push(...parts)
      replaced.add(term)
      continue
    }
    const swapped = term.length >= 5 ? swappedForm(vocabulary, term) : null
    if (swapped) {
      result.push(swapped)
      replaced.add(term)
    }
  }
  return [...new Set(result.filter(term => !replaced.has(term) || known(vocabulary, term)))]
}
