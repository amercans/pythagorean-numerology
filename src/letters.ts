const SPECIAL_LETTERS: Readonly<Record<string, string>> = {
  ı: "i",
  ß: "ss",
  ẞ: "ss",
  æ: "ae",
  Æ: "ae",
  œ: "oe",
  Œ: "oe",
  ø: "o",
  Ø: "o",
  ł: "l",
  Ł: "l",
  đ: "d",
  Đ: "d",
  ð: "d",
  Ð: "d",
  þ: "th",
  Þ: "th",
};

const SPECIAL_PATTERN = new RegExp(`[${Object.keys(SPECIAL_LETTERS).join("")}]`, "g");

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

/**
 * Lower-cases a name, folds diacritics, ligatures and full-width forms to plain
 * Latin letters (`Ç` → `c`, `ß` → `ss`, `ø` → `o`, `Ａ` → `a`) and drops
 * everything else, including letters from non-Latin scripts.
 *
 * @example normalizeName("Joaquín Weiß") // "joaquinweiss"
 */
export function normalizeName(name: string): string {
  if (typeof name !== "string") {
    throw new TypeError(`name must be a string, received ${typeof name}`);
  }
  return name
    .replace(SPECIAL_PATTERN, (ch) => SPECIAL_LETTERS[ch] as string)
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

/**
 * Pythagorean value (1 to 9) of a single character, after normalisation.
 * Returns 0 for a character that is not a Latin letter.
 *
 * @throws {RangeError} when `letter` is not exactly one character.
 */
export function letterValue(letter: string): number {
  if (typeof letter !== "string") {
    throw new TypeError(`letter must be a string, received ${typeof letter}`);
  }
  if ([...letter.normalize("NFC")].length !== 1) {
    throw new RangeError(`letter must be a single character, received "${letter}"`);
  }
  const ch = normalizeName(letter).charAt(0);
  return ch ? ((ch.charCodeAt(0) - 97) % 9) + 1 : 0;
}

export function isVowel(letter: string): boolean {
  return VOWELS.has(letter);
}

export function nameLetters(name: string): string {
  const letters = normalizeName(name);
  if (!letters) {
    throw new RangeError("name must contain at least one Latin letter");
  }
  return letters;
}
