import { assertDate, assertInteger, digitSum, isMasterNumber, reduce, reduceFully } from "./core.js";
import { birthdayNumber, lifePath, lifePathParts } from "./date.js";
import { nameNumbers, rawNameTotal } from "./name.js";

/** Intermediate totals treated as karmic debt numbers. */
export const KARMIC_DEBT_NUMBERS = Object.freeze([13, 14, 16, 19] as const);

export interface KarmicDebtHit {
  number: number;
  source: "birthday" | "lifePath" | "expression";
  /** The intermediate total that matched. */
  total: number;
}

export interface FullChart {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  maturity: number;
  /** Master numbers that occur anywhere in the chart, each listed once. */
  masters: number[];
}

export interface CompatibilityWeights {
  same: number;
  sameGroup: number;
  intuitiveMental: number;
  mentalPhysical: number;
  intuitivePhysical: number;
  masterBonus: number;
  masterCap: number;
  radiant: number;
  warm: number;
  workable: number;
}

export type CompatibilityBand = "radiant" | "warm" | "workable" | "spiky";
export type CompatibilityRelation = "same" | "same-group" | "cross-group";

export interface CompatibilityResult {
  a: number;
  b: number;
  score: number;
  band: CompatibilityBand;
  relation: CompatibilityRelation;
}

/**
 * Default scores and band thresholds used by {@link compatibility}.
 * They are a convention of this library, not a numerological standard.
 */
export const COMPATIBILITY_WEIGHTS: Readonly<CompatibilityWeights> = Object.freeze({
  same: 88,
  sameGroup: 78,
  intuitiveMental: 70,
  mentalPhysical: 64,
  intuitivePhysical: 58,
  masterBonus: 4,
  masterCap: 94,
  radiant: 85,
  warm: 72,
  workable: 62,
});

type Group = "physical" | "mental" | "intuitive";

const GROUP: Readonly<Record<number, Group>> = {
  1: "physical",
  4: "physical",
  8: "physical",
  22: "physical",
  3: "mental",
  5: "mental",
  6: "mental",
  33: "mental",
  2: "intuitive",
  7: "intuitive",
  9: "intuitive",
  11: "intuitive",
};

const isDebt = (n: number): boolean => (KARMIC_DEBT_NUMBERS as readonly number[]).includes(n);

/**
 * Maturity number: life path plus expression, reduced with masters kept.
 */
export function maturityNumber(lifePathNumber: number, expressionNumber: number): number {
  return reduce(assertInteger(lifePathNumber, "lifePathNumber", 1) + assertInteger(expressionNumber, "expressionNumber", 1));
}

/**
 * Karmic debt numbers (13, 14, 16, 19) found in the birthday, in the sum of the
 * reduced life path parts, or in any step of reducing the raw name total.
 *
 * @throws {RangeError} when the date does not exist or the name has no Latin letters.
 */
export function karmicDebt(fullName: string, year: number, month: number, day: number): KarmicDebtHit[] {
  assertDate(year, month, day);
  const hits: KarmicDebtHit[] = [];

  if (isDebt(day)) hits.push({ number: day, source: "birthday", total: day });

  const parts = lifePathParts(year, month, day);
  const lifePathTotal = parts.day + parts.month + parts.year;
  if (isDebt(lifePathTotal)) hits.push({ number: lifePathTotal, source: "lifePath", total: lifePathTotal });

  for (let total = rawNameTotal(fullName); total > 9; total = digitSum(total)) {
    if (isDebt(total)) {
      hits.push({ number: total, source: "expression", total });
      break;
    }
  }

  return hits;
}

/**
 * Every core number for a full name and birth date.
 */
export function fullChart(fullName: string, year: number, month: number, day: number): FullChart {
  const lp = lifePath(year, month, day).number;
  const name = nameNumbers(fullName);
  const chart = {
    lifePath: lp,
    expression: name.expression,
    soulUrge: name.soulUrge,
    personality: name.personality,
    birthday: birthdayNumber(day),
    maturity: maturityNumber(lp, name.expression),
  };
  const masters = [...new Set(Object.values(chart).filter(isMasterNumber))].sort((x, y) => x - y);
  return { ...chart, masters };
}

function crossGroupScore(x: Group, y: Group, w: CompatibilityWeights): number {
  const pair = [x, y].sort().join("-");
  if (pair === "intuitive-mental") return w.intuitiveMental;
  if (pair === "mental-physical") return w.mentalPhysical;
  return w.intuitivePhysical;
}

/**
 * Group-based compatibility score for two numbers, usually life path numbers.
 * Inputs are reduced first. Numbers fall into three classical groups
 * (physical 1-4-8, mental 3-5-6, intuitive 2-7-9; masters follow their root),
 * and the score depends on whether the two share the number, the group or neither.
 * A master number adds a capped bonus. Any weight can be overridden.
 *
 * @example compatibility(1, 8) // { a: 1, b: 8, score: 78, band: "warm", relation: "same-group" }
 */
export function compatibility(a: number, b: number, weights: Partial<CompatibilityWeights> = {}): CompatibilityResult {
  const w = { ...COMPATIBILITY_WEIGHTS, ...weights };
  const x = reduce(assertInteger(a, "a", 1));
  const y = reduce(assertInteger(b, "b", 1));
  const gx = GROUP[x] as Group;
  const gy = GROUP[y] as Group;

  let relation: CompatibilityRelation;
  let score: number;
  if (x === y) {
    relation = "same";
    score = w.same;
  } else if (gx === gy) {
    relation = "same-group";
    score = w.sameGroup;
  } else {
    relation = "cross-group";
    score = crossGroupScore(gx, gy, w);
  }

  if (isMasterNumber(x) || isMasterNumber(y)) score = Math.min(w.masterCap, score + w.masterBonus);

  const band: CompatibilityBand =
    score >= w.radiant ? "radiant" : score >= w.warm ? "warm" : score >= w.workable ? "workable" : "spiky";
  return { a: x, b: y, score, band, relation };
}

/**
 * House or street number reduced fully to 1 to 9. Non-digit characters are
 * ignored, so "12B" counts as 12 and "12-14" as 1214.
 *
 * @throws {RangeError} when the input is negative, has no digits or only zeros.
 */
export function addressNumber(input: string | number): number {
  if (typeof input !== "string" && typeof input !== "number") {
    throw new TypeError(`input must be a string or a number, received ${input === null ? "null" : typeof input}`);
  }
  if (typeof input === "number") assertInteger(input, "input", 1);
  const text = String(input);
  if (/^\s*-\s*\d/.test(text)) throw new RangeError(`input must not be negative, received "${text}"`);
  let sum = 0;
  for (const d of text.replace(/\D/g, "")) sum += Number(d);
  if (sum === 0) throw new RangeError("input must contain a non-zero digit");
  return reduceFully(sum);
}
