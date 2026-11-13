import { describe, expect, it } from "vitest";
import { birthdayNumber, lifePath, personalYear } from "../src/index.js";

describe("lifePath", () => {
  it("reduces day, month and year separately, then their sum", () => {
    expect(lifePath(1988, 11, 3)).toEqual({
      number: 22,
      isMaster: true,
      steps: { day: 3, month: 11, year: 8 },
    });
  });

  it("reduces to a single digit when no master appears", () => {
    expect(lifePath(1990, 7, 15)).toEqual({
      number: 5,
      isMaster: false,
      steps: { day: 6, month: 7, year: 1 },
    });
  });

  it("keeps a master day and a master year sum", () => {
    expect(lifePath(1993, 1, 29).steps).toEqual({ day: 11, month: 1, year: 22 });
    expect(lifePath(1993, 1, 29).number).toBe(7);
  });

  it("can land on 11 and 33", () => {
    expect(lifePath(2000, 5, 4).number).toBe(11);
    expect(lifePath(2009, 11, 11)).toEqual({
      number: 33,
      isMaster: true,
      steps: { day: 11, month: 11, year: 11 },
    });
  });

  it("throws a RangeError for dates that do not exist or are out of range", () => {
    expect(() => lifePath(2023, 2, 29)).toThrow(RangeError);
    expect(() => lifePath(1990, 13, 1)).toThrow(RangeError);
    expect(() => lifePath(2 ** 60, 1, 1)).toThrow(RangeError);
    expect(() => lifePath(1e300, 1, 1)).toThrow(RangeError);
  });

  it("throws a TypeError for arguments that are not numbers", () => {
    expect(() => lifePath("1990" as unknown as number, 1, 1)).toThrow(TypeError);
    expect(() => lifePath(1990, null as unknown as number, 1)).toThrow(TypeError);
    expect(() => lifePath(1990, 1, "1" as unknown as number)).toThrow(TypeError);
  });
});

describe("birthdayNumber", () => {
  it("reduces the day of the month and keeps masters", () => {
    expect(birthdayNumber(3)).toBe(3);
    expect(birthdayNumber(15)).toBe(6);
    expect(birthdayNumber(29)).toBe(11);
    expect(birthdayNumber(22)).toBe(22);
    expect(birthdayNumber(31)).toBe(4);
  });

  it("rejects days outside 1 to 31 and non-numbers", () => {
    expect(() => birthdayNumber(0)).toThrow(RangeError);
    expect(() => birthdayNumber(32)).toThrow(RangeError);
    expect(() => birthdayNumber("3" as unknown as number)).toThrow(TypeError);
  });
});

describe("personalYear", () => {
  it("adds birth month, birth day and the target year", () => {
    expect(personalYear(11, 3, 2026)).toEqual({
      number: 6,
      targetYear: 2026,
      steps: { month: 2, day: 3, year: 1, sum: 6 },
    });
  });

  it("always reduces to 1 to 9, even through a master sum", () => {
    const result = personalYear(9, 1, 2026);
    expect(result.steps.sum).toBe(11);
    expect(result.number).toBe(2);
  });

  it("validates month, day and year", () => {
    expect(() => personalYear(0, 1, 2026)).toThrow(RangeError);
    expect(() => personalYear(1, 32, 2026)).toThrow(RangeError);
    expect(() => personalYear(1, 1, 0)).toThrow(RangeError);
    expect(() => personalYear(1, 1, 10000)).toThrow(RangeError);
    expect(() => personalYear(1, 1, "2026" as unknown as number)).toThrow(TypeError);
  });
});
