/** Highest year accepted by the date functions. */
export const MAX_YEAR = 9999;

/** Numbers that {@link reduce} keeps instead of reducing further. */
export const MASTER_NUMBERS = Object.freeze([11, 22, 33] as const);

/** Returns `true` for 11, 22 and 33, and `false` for anything else. */
export function isMasterNumber(n: number): boolean {
  return (MASTER_NUMBERS as readonly number[]).includes(n);
}

export function assertNumber(value: unknown, label: string): asserts value is number {
  if (typeof value !== "number") {
    throw new TypeError(`${label} must be a number, received ${typeof value}`);
  }
}

export function assertInteger(value: unknown, label: string, min: number, max = Number.MAX_SAFE_INTEGER): number {
  assertNumber(value, label);
  if (!Number.isInteger(value) || value < min || value > max) {
    const range = max === Number.MAX_SAFE_INTEGER ? `an integer >= ${min}` : `an integer from ${min} to ${max}`;
    throw new RangeError(`${label} must be ${range}, received ${value}`);
  }
  return value;
}

export function digitSum(n: number): number {
  let sum = 0;
  for (let rest = n; rest > 0; rest = Math.floor(rest / 10)) sum += rest % 10;
  return sum;
}

/**
 * Sums the digits of a non-negative integer until one digit remains,
 * stopping early at a master number (11, 22, 33).
 *
 * @example reduce(1993) // 22
 */
export function reduce(n: number): number {
  let value = assertInteger(n, "n", 0);
  while (value > 9 && !isMasterNumber(value)) value = digitSum(value);
  return value;
}

/**
 * Sums the digits of a non-negative integer until one digit remains,
 * without keeping master numbers.
 *
 * @example reduceFully(29) // 2
 */
export function reduceFully(n: number): number {
  let value = assertInteger(n, "n", 0);
  while (value > 9) value = digitSum(value);
  return value;
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/**
 * Days in a month of the proleptic Gregorian calendar.
 *
 * @throws {RangeError} when `year` is not 1 to 9999 or `month` is not 1 to 12.
 */
export function daysInMonth(year: number, month: number): number {
  assertInteger(year, "year", 1, MAX_YEAR);
  assertInteger(month, "month", 1, 12);
  return monthLength(year, month);
}

function monthLength(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/**
 * Checks a calendar date with plain arithmetic (no `Date`, no time zone).
 * Years run from 1 to 9999; leap years follow the Gregorian rule.
 * Returns `false` for any invalid input instead of throwing.
 */
export function isValidDate(year: number, month: number, day: number): boolean {
  const isInt = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v);
  if (!isInt(year) || !isInt(month) || !isInt(day)) return false;
  if (year < 1 || year > MAX_YEAR || month < 1 || month > 12 || day < 1) return false;
  return day <= monthLength(year, month);
}

export function assertDate(year: number, month: number, day: number): void {
  assertNumber(year, "year");
  assertNumber(month, "month");
  assertNumber(day, "day");
  if (!isValidDate(year, month, day)) {
    throw new RangeError(`${year}-${month}-${day} is not a valid date`);
  }
}
