import { describe, expect, it } from "vitest";
import {
  MASTER_NUMBERS,
  MAX_YEAR,
  daysInMonth,
  isMasterNumber,
  isValidDate,
  normalizeName,
  reduce,
  reduceFully,
} from "../src/index.js";

describe("reduce", () => {
  it("returns single digits unchanged", () => {
    for (let n = 0; n <= 9; n++) expect(reduce(n)).toBe(n);
  });

  it("sums digits until one digit remains", () => {
    expect(reduce(10)).toBe(1);
    expect(reduce(123)).toBe(6);
    expect(reduce(1999)).toBe(1);
    expect(reduce(987654321)).toBe(9);
  });

  it("keeps master numbers, including ones reached on the way down", () => {
    expect(reduce(11)).toBe(11);
    expect(reduce(22)).toBe(22);
    expect(reduce(33)).toBe(33);
    expect(reduce(29)).toBe(11);
    expect(reduce(38)).toBe(11);
    expect(reduce(49)).toBe(4);
    expect(reduce(1993)).toBe(22);
  });

  it("does not treat 44 as a master number", () => {
    expect(reduce(44)).toBe(8);
  });

  it("throws a TypeError for a non-number", () => {
    expect(() => reduce("12" as unknown as number)).toThrow(TypeError);
    expect(() => reduce(undefined as unknown as number)).toThrow(TypeError);
  });

  it("throws a RangeError for a number that is not a safe non-negative integer", () => {
    expect(() => reduce(-1)).toThrow(RangeError);
    expect(() => reduce(1.5)).toThrow(RangeError);
    expect(() => reduce(Number.NaN)).toThrow(RangeError);
    expect(() => reduce(Number.POSITIVE_INFINITY)).toThrow(RangeError);
    expect(() => reduce(2 ** 60)).toThrow(RangeError);
  });
});

describe("reduceFully", () => {
  it("always reaches a single digit", () => {
    expect(reduceFully(11)).toBe(2);
    expect(reduceFully(22)).toBe(4);
    expect(reduceFully(33)).toBe(6);
    expect(reduceFully(2026)).toBe(1);
    expect(reduceFully(7)).toBe(7);
  });

  it("validates its input like reduce", () => {
    expect(() => reduceFully(-5)).toThrow(RangeError);
    expect(() => reduceFully("5" as unknown as number)).toThrow(TypeError);
  });
});

describe("master numbers", () => {
  it("exposes the master list", () => {
    expect(MASTER_NUMBERS).toEqual([11, 22, 33]);
  });

  it("identifies masters and returns false for anything else", () => {
    expect(isMasterNumber(11)).toBe(true);
    expect(isMasterNumber(33)).toBe(true);
    expect(isMasterNumber(44)).toBe(false);
    expect(isMasterNumber(2)).toBe(false);
    expect(isMasterNumber("11" as unknown as number)).toBe(false);
  });
});

describe("isValidDate", () => {
  it("accepts real dates from year 1 to 9999", () => {
    expect(MAX_YEAR).toBe(9999);
    expect(isValidDate(1988, 11, 3)).toBe(true);
    expect(isValidDate(2024, 2, 29)).toBe(true);
    expect(isValidDate(2000, 2, 29)).toBe(true);
    expect(isValidDate(1, 1, 1)).toBe(true);
    expect(isValidDate(9999, 12, 31)).toBe(true);
  });

  it("returns false for impossible dates and invalid input", () => {
    expect(isValidDate(2023, 2, 29)).toBe(false);
    expect(isValidDate(1900, 2, 29)).toBe(false);
    expect(isValidDate(2026, 4, 31)).toBe(false);
    expect(isValidDate(2026, 13, 1)).toBe(false);
    expect(isValidDate(2026, 0, 10)).toBe(false);
    expect(isValidDate(2026, 1, 0)).toBe(false);
    expect(isValidDate(0, 1, 1)).toBe(false);
    expect(isValidDate(10000, 1, 1)).toBe(false);
    expect(isValidDate(2 ** 60, 1, 1)).toBe(false);
    expect(isValidDate(1e300, 1, 1)).toBe(false);
    expect(isValidDate(2026, 1.5, 1)).toBe(false);
    expect(isValidDate(2026, 1, Number.NaN)).toBe(false);
    expect(isValidDate("2026" as unknown as number, 1, 1)).toBe(false);
  });
});

describe("daysInMonth", () => {
  it("returns the length of the month", () => {
    expect(daysInMonth(2026, 1)).toBe(31);
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
  });

  it("validates the year and the month", () => {
    expect(() => daysInMonth(2026, 13)).toThrow(RangeError);
    expect(() => daysInMonth(2026, 0)).toThrow(RangeError);
    expect(() => daysInMonth(0, 1)).toThrow(RangeError);
    expect(() => daysInMonth(10000, 1)).toThrow(RangeError);
    expect(() => daysInMonth("2026" as unknown as number, 1)).toThrow(TypeError);
  });
});

describe("normalizeName", () => {
  it("lower-cases and keeps only Latin letters", () => {
    expect(normalizeName("Anne-Marie O'Dwyer 3rd")).toBe("annemarieodwyerrd");
  });

  it("folds diacritics instead of dropping the letters", () => {
    expect(normalizeName("Joaquín Weiß")).toBe("joaquinweiss");
    expect(normalizeName("Mireille Søndergaard")).toBe("mireillesondergaard");
    expect(normalizeName("Zofia Kowalczyk-Ørsted")).toBe("zofiakowalczykorsted");
    expect(normalizeName("Iñaki Ferrante")).toBe("inakiferrante");
  });

  it("folds Turkish letters, including dotless and dotted i", () => {
    expect(normalizeName("ÇĞİŞÖÜ çğışöü")).toBe("cgisoucgisou");
  });

  it("expands ligatures and special letters", () => {
    expect(normalizeName("Ærin Lœwe")).toBe("aerinloewe");
    expect(normalizeName("Þóra Đorđević")).toBe("thoradordevic");
    expect(normalizeName("Łucja Nĳhoff")).toBe("lucjanijhoff");
  });

  it("folds full-width letters", () => {
    expect(normalizeName("Ｌｅｏｎ Ｂｒａｎｔ")).toBe("leonbrant");
  });

  it("ignores letters outside the Latin alphabet", () => {
    expect(normalizeName("Ковальова")).toBe("");
    expect(normalizeName("Ilse Ковальова")).toBe("ilse");
  });

  it("requires a string", () => {
    expect(() => normalizeName(42 as unknown as string)).toThrow(TypeError);
  });
});
