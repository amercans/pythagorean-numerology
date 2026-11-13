import { MAX_YEAR, assertDate, assertInteger, digitSum, isMasterNumber, reduce, reduceFully } from "./core.js";

export interface LifePathResult {
  /** The life path number: 1 to 9, or a master number. */
  number: number;
  isMaster: boolean;
  /** Each part of the date after its own reduction. */
  steps: { day: number; month: number; year: number };
}

export interface PersonalYearResult {
  /** Always 1 to 9. */
  number: number;
  targetYear: number;
  steps: { month: number; day: number; year: number; sum: number };
}

export function lifePathParts(year: number, month: number, day: number): LifePathResult["steps"] {
  return { day: reduce(day), month: reduce(month), year: reduce(digitSum(year)) };
}

/**
 * Life path number of a birth date. Day, month and year are reduced on their
 * own (masters kept), then their sum is reduced (masters kept).
 *
 * @throws {RangeError} when the date does not exist.
 * @example lifePath(1988, 11, 3).number // 22
 */
export function lifePath(year: number, month: number, day: number): LifePathResult {
  assertDate(year, month, day);
  const steps = lifePathParts(year, month, day);
  const number = reduce(steps.day + steps.month + steps.year);
  return { number, isMaster: isMasterNumber(number), steps };
}

/**
 * Birthday number: the day of the month, reduced with masters kept (29 → 11).
 *
 * @throws {RangeError} when `day` is not 1 to 31.
 */
export function birthdayNumber(day: number): number {
  return reduce(assertInteger(day, "day", 1, 31));
}

/**
 * Personal year number for `targetYear`. Birth month, birth day and the target
 * year are each reduced to one digit, summed and reduced again. Masters are not
 * kept, so the result is always 1 to 9.
 *
 * @example personalYear(11, 3, 2026).number // 6
 */
export function personalYear(birthMonth: number, birthDay: number, targetYear: number): PersonalYearResult {
  const month = reduceFully(assertInteger(birthMonth, "birthMonth", 1, 12));
  const day = reduceFully(assertInteger(birthDay, "birthDay", 1, 31));
  const year = reduceFully(assertInteger(targetYear, "targetYear", 1, MAX_YEAR));
  const sum = month + day + year;
  return { number: reduceFully(sum), targetYear, steps: { month, day, year, sum } };
}
