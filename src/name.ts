import { isMasterNumber, reduce } from "./core.js";
import { isVowel, letterValue, nameLetters, normalizeName } from "./letters.js";

export interface NameNumbersResult {
  /** All letters. */
  expression: number;
  /** Vowels (A, E, I, O, U). 0 when the name has none. */
  soulUrge: number;
  /** Consonants, Y included. 0 when the name has none. */
  personality: number;
  /** Whether the expression number is a master number. */
  isMaster: boolean;
}

export interface HiddenPassionResult {
  /** Values that appear most often, ascending. */
  numbers: number[];
  /** How often they appear. */
  count: number;
}

export interface CornerstoneCapstoneResult {
  cornerstone: number;
  capstone: number;
}

export function rawNameTotal(name: string): number {
  let total = 0;
  for (const ch of nameLetters(name)) total += letterValue(ch);
  return total;
}

/**
 * Expression, soul urge and personality numbers of a full name.
 * Each total is reduced with masters kept.
 *
 * @throws {RangeError} when the name contains no Latin letters.
 * @example nameNumbers("Tobias Lindqvist") // { expression: 3, soulUrge: 7, personality: 5, isMaster: false }
 */
export function nameNumbers(fullName: string): NameNumbersResult {
  let vowels = 0;
  let consonants = 0;
  for (const ch of nameLetters(fullName)) {
    if (isVowel(ch)) vowels += letterValue(ch);
    else consonants += letterValue(ch);
  }
  const expression = reduce(vowels + consonants);
  return {
    expression,
    soulUrge: reduce(vowels),
    personality: reduce(consonants),
    isMaster: isMasterNumber(expression),
  };
}

function valueCounts(fullName: string): number[] {
  const counts = new Array<number>(10).fill(0);
  for (const ch of nameLetters(fullName)) {
    const value = letterValue(ch);
    counts[value] = (counts[value] as number) + 1;
  }
  return counts;
}

/**
 * Values from 1 to 9 that no letter of the name carries.
 *
 * @throws {RangeError} when the name contains no Latin letters.
 */
export function karmicLessons(fullName: string): number[] {
  const counts = valueCounts(fullName);
  const lessons: number[] = [];
  for (let n = 1; n <= 9; n++) if (counts[n] === 0) lessons.push(n);
  return lessons;
}

/**
 * The letter value(s) that appear most often in the name. Ties return every
 * value that shares the highest count.
 *
 * @throws {RangeError} when the name contains no Latin letters.
 */
export function hiddenPassion(fullName: string): HiddenPassionResult {
  const counts = valueCounts(fullName);
  const count = Math.max(...counts);
  const numbers: number[] = [];
  for (let n = 1; n <= 9; n++) if (counts[n] === count) numbers.push(n);
  return { numbers, count };
}

/**
 * Cornerstone (first letter of the first word) and capstone (last letter of the
 * last word). Words without Latin letters are skipped.
 *
 * @throws {RangeError} when the name contains no Latin letters.
 */
export function cornerstoneCapstone(fullName: string): CornerstoneCapstoneResult {
  nameLetters(fullName);
  const words = fullName.split(/\s+/).map(normalizeName).filter(Boolean);
  const first = words[0] as string;
  const last = words[words.length - 1] as string;
  return {
    cornerstone: letterValue(first.charAt(0)),
    capstone: letterValue(last.charAt(last.length - 1)),
  };
}
