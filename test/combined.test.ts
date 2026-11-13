import { describe, expect, it } from "vitest";
import {
  COMPATIBILITY_WEIGHTS,
  KARMIC_DEBT_NUMBERS,
  addressNumber,
  compatibility,
  fullChart,
  karmicDebt,
  maturityNumber,
} from "../src/index.js";

describe("maturityNumber", () => {
  it("reduces life path plus expression and keeps masters", () => {
    expect(maturityNumber(5, 3)).toBe(8);
    expect(maturityNumber(22, 9)).toBe(4);
    expect(maturityNumber(4, 7)).toBe(11);
  });

  it("rejects values that are not positive integers", () => {
    expect(() => maturityNumber(0, 5)).toThrow(RangeError);
    expect(() => maturityNumber(5, 1.5)).toThrow(RangeError);
    expect(() => maturityNumber("5" as unknown as number, 3)).toThrow(TypeError);
  });
});

describe("karmicDebt", () => {
  it("exposes the debt numbers", () => {
    expect(KARMIC_DEBT_NUMBERS).toEqual([13, 14, 16, 19]);
  });

  it("flags a birthday on a debt day", () => {
    expect(karmicDebt("Tobias Lindqvist", 1990, 5, 13)).toEqual([
      { number: 13, source: "birthday", total: 13 },
    ]);
  });

  it("flags a life path whose component sum is a debt number", () => {
    expect(karmicDebt("Tobias Lindqvist", 1990, 5, 7)).toEqual([
      { number: 13, source: "lifePath", total: 13 },
    ]);
  });

  it("flags an expression that is or passes through a debt number", () => {
    expect(karmicDebt("Katja Falk", 1988, 11, 3)).toEqual([
      { number: 19, source: "expression", total: 19 },
    ]);
    expect(karmicDebt("Henrik Bauer", 1988, 11, 3)).toEqual([
      { number: 13, source: "expression", total: 13 },
    ]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(karmicDebt("Tobias Lindqvist", 1988, 11, 3)).toEqual([]);
  });

  it("validates the name and the date", () => {
    expect(() => karmicDebt("", 1990, 1, 1)).toThrow(RangeError);
    expect(() => karmicDebt("Ingrid", 1990, 2, 30)).toThrow(RangeError);
    expect(() => karmicDebt("Ingrid", "1990" as unknown as number, 2, 3)).toThrow(TypeError);
  });
});

describe("fullChart", () => {
  it("returns every core number for a name and a birth date", () => {
    expect(fullChart("Tobias Lindqvist", 1990, 7, 15)).toEqual({
      lifePath: 5,
      expression: 3,
      soulUrge: 7,
      personality: 5,
      birthday: 6,
      maturity: 8,
      masters: [],
    });
  });

  it("lists each master number once", () => {
    const chart = fullChart("Tobias Hale", 1988, 11, 29);
    expect(chart).toMatchObject({ lifePath: 3, expression: 11, soulUrge: 22, birthday: 11 });
    expect(chart.masters).toEqual([11, 22]);
  });

  it("sorts several master numbers", () => {
    const chart = fullChart("Tobias Hale", 1988, 11, 3);
    expect(chart).toMatchObject({ lifePath: 22, expression: 11, maturity: 33 });
    expect(chart.masters).toEqual([11, 22, 33]);
  });
});

describe("compatibility", () => {
  it("scores identical numbers highest", () => {
    expect(compatibility(4, 4)).toEqual({ a: 4, b: 4, score: 88, band: "radiant", relation: "same" });
  });

  it("scores numbers from the same group as warm", () => {
    expect(compatibility(1, 8)).toEqual({ a: 1, b: 8, score: 78, band: "warm", relation: "same-group" });
  });

  it("scores pairs across groups by the pair of groups", () => {
    expect(compatibility(2, 3)).toMatchObject({ score: 70, band: "workable", relation: "cross-group" });
    expect(compatibility(3, 4)).toMatchObject({ score: 64, band: "workable" });
    expect(compatibility(2, 4)).toMatchObject({ score: 58, band: "spiky" });
  });

  it("is symmetric", () => {
    const pairs: [number, number][] = [[1, 5], [2, 9], [6, 7], [11, 4]];
    for (const [x, y] of pairs) {
      expect(compatibility(x, y).score).toBe(compatibility(y, x).score);
    }
  });

  it("adds a capped bonus when a master number is involved", () => {
    expect(compatibility(11, 2)).toMatchObject({ score: 82, relation: "same-group" });
    expect(compatibility(11, 11)).toMatchObject({ score: 92, band: "radiant" });
    expect(compatibility(22, 4).score).toBe(82);
    expect(compatibility(33, 6).score).toBe(82);
  });

  it("reduces raw totals before comparing", () => {
    expect(compatibility(29, 2)).toEqual(compatibility(11, 2));
    expect(compatibility(19, 10)).toMatchObject({ a: 1, b: 1, relation: "same" });
  });

  it("accepts partial weight overrides", () => {
    expect(compatibility(4, 4, { same: 95 }).score).toBe(95);
    expect(compatibility(11, 11, { masterBonus: 10, masterCap: 99 }).score).toBe(98);
    expect(compatibility(2, 4, { workable: 50 }).band).toBe("workable");
  });

  it("exposes the default weights", () => {
    expect(COMPATIBILITY_WEIGHTS).toEqual({
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
    expect(Object.isFrozen(COMPATIBILITY_WEIGHTS)).toBe(true);
  });

  it("rejects values that are not positive integers", () => {
    expect(() => compatibility(0, 4)).toThrow(RangeError);
    expect(() => compatibility(4, 2.5)).toThrow(RangeError);
    expect(() => compatibility("4" as unknown as number, 2)).toThrow(TypeError);
  });
});

describe("addressNumber", () => {
  it("reduces the digits of an address fully", () => {
    expect(addressNumber("1428")).toBe(6);
    expect(addressNumber("29")).toBe(2);
    expect(addressNumber("Flat 12B, 47")).toBe(5);
    expect(addressNumber("12-14")).toBe(8);
    expect(addressNumber(1428)).toBe(6);
  });

  it("treats numbers and strings the same way", () => {
    expect(addressNumber(29)).toBe(addressNumber("29"));
    expect(() => addressNumber(0)).toThrow(RangeError);
    expect(() => addressNumber("0")).toThrow(RangeError);
    expect(() => addressNumber("00")).toThrow(RangeError);
    expect(() => addressNumber(-12)).toThrow(RangeError);
    expect(() => addressNumber("-12")).toThrow(RangeError);
    expect(() => addressNumber(" - 12")).toThrow(RangeError);
  });

  it("rejects input without digits, fractions and other types", () => {
    expect(() => addressNumber("Rose Cottage")).toThrow(RangeError);
    expect(() => addressNumber(12.5)).toThrow(RangeError);
    expect(() => addressNumber(null as unknown as string)).toThrow(TypeError);
    expect(() => addressNumber(undefined as unknown as string)).toThrow(TypeError);
  });
});
