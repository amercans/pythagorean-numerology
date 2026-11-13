import { describe, expect, it } from "vitest";
import {
  cornerstoneCapstone,
  hiddenPassion,
  karmicLessons,
  letterValue,
  nameNumbers,
} from "../src/index.js";

describe("letterValue", () => {
  it("follows the Pythagorean table", () => {
    expect([..."ajs"].map((ch) => letterValue(ch))).toEqual([1, 1, 1]);
    expect([..."ir"].map((ch) => letterValue(ch))).toEqual([9, 9]);
    expect([..."hqz"].map((ch) => letterValue(ch))).toEqual([8, 8, 8]);
    expect(letterValue("Y")).toBe(7);
  });

  it("folds accented, Turkish and full-width letters", () => {
    expect(letterValue("é")).toBe(5);
    expect(letterValue("é")).toBe(5);
    expect(letterValue("ç")).toBe(3);
    expect(letterValue("ğ")).toBe(7);
    expect(letterValue("ı")).toBe(9);
    expect(letterValue("ş")).toBe(1);
    expect(letterValue("ü")).toBe(3);
    expect(letterValue("Ｋ")).toBe(2);
  });

  it("returns 0 for a single character that is not a Latin letter", () => {
    expect(letterValue("3")).toBe(0);
    expect(letterValue("-")).toBe(0);
    expect(letterValue("Ж")).toBe(0);
  });

  it("rejects anything but exactly one character", () => {
    expect(() => letterValue("")).toThrow(RangeError);
    expect(() => letterValue("ab")).toThrow(RangeError);
    expect(() => letterValue(1 as unknown as string)).toThrow(TypeError);
  });
});

describe("nameNumbers", () => {
  it("splits a name into expression, soul urge and personality", () => {
    expect(nameNumbers("Tobias Lindqvist")).toEqual({
      expression: 3,
      soulUrge: 7,
      personality: 5,
      isMaster: false,
    });
  });

  it("keeps master numbers", () => {
    expect(nameNumbers("Tobias Hale")).toEqual({
      expression: 11,
      soulUrge: 22,
      personality: 7,
      isMaster: true,
    });
  });

  it("counts Y as a consonant", () => {
    const result = nameNumbers("Glynn Wyrth");
    expect(result.soulUrge).toBe(0);
    expect(result.personality).toBe(result.expression);
  });

  it("gives the same result for accented and plain spellings", () => {
    expect(nameNumbers("Joaquín Weiß")).toEqual(nameNumbers("Joaquin Weiss"));
    expect(nameNumbers("Mireille Søndergaard")).toEqual(nameNumbers("Mireille Sondergaard"));
  });

  it("rejects names without Latin letters", () => {
    expect(() => nameNumbers("")).toThrow(RangeError);
    expect(() => nameNumbers("1234")).toThrow(RangeError);
    expect(() => nameNumbers("Ковальова")).toThrow(RangeError);
    expect(() => nameNumbers(7 as unknown as string)).toThrow(TypeError);
  });
});

describe("karmicLessons", () => {
  it("lists the values 1 to 9 missing from the name", () => {
    expect(karmicLessons("Tobias Lindqvist")).toEqual([7]);
    expect(karmicLessons("Ingrid")).toEqual([1, 2, 3, 6, 8]);
  });

  it("returns an empty list when every value is present", () => {
    expect(karmicLessons("abcdefghi")).toEqual([]);
  });

  it("rejects names without Latin letters", () => {
    expect(() => karmicLessons("   ")).toThrow(RangeError);
  });
});

describe("hiddenPassion", () => {
  it("returns the most frequent value", () => {
    expect(hiddenPassion("Ingrid")).toEqual({ numbers: [9], count: 3 });
  });

  it("returns every value that ties for first place", () => {
    expect(hiddenPassion("Tobias Lindqvist")).toEqual({ numbers: [1, 2, 9], count: 3 });
  });

  it("rejects names without Latin letters", () => {
    expect(() => hiddenPassion("")).toThrow(RangeError);
  });
});

describe("cornerstoneCapstone", () => {
  it("reads the first letter of the first name and the last letter of the surname", () => {
    expect(cornerstoneCapstone("Tobias Lindqvist")).toEqual({ cornerstone: 2, capstone: 2 });
  });

  it("uses a single word for both", () => {
    expect(cornerstoneCapstone("Ingrid")).toEqual({ cornerstone: 9, capstone: 4 });
  });

  it("skips words without Latin letters and folds accents", () => {
    expect(cornerstoneCapstone("  Élise 3 Moreau ")).toEqual({ cornerstone: 5, capstone: 3 });
    expect(cornerstoneCapstone("- Anouk Žáková -")).toEqual({ cornerstone: 1, capstone: 1 });
  });

  it("rejects names without Latin letters", () => {
    expect(() => cornerstoneCapstone("42")).toThrow(RangeError);
  });
});
