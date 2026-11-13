# Methodology

Numerology has no single specification. Books and calculators agree on the letter table and on most reductions, but differ in a few places. This document lists the rule this library follows for every calculation, with a worked example, and notes where other sources differ.

## Reduction

A number is reduced by adding its digits until one digit remains: `1999 → 28 → 10 → 1`.

**Master numbers.** `reduce` stops at 11, 22 and 33, also when they appear on the way down: `1993 → 22`, `29 → 11`, `38 → 11`. 44 and higher repeated digits are not treated as masters (`44 → 8`); some schools do treat 44 as a master number.

`reduceFully` ignores master numbers and always returns 1 to 9: `29 → 11 → 2`.

| Calculation | Masters kept? |
|---|---|
| Life path, birthday, expression, soul urge, personality, maturity | Yes |
| Personal year, address number | No |

Personal year and address numbers describe a cycle or a place rather than a person, which is why most sources reduce them fully. Some keep 11 and 22 in the personal year as well.

## Letter table

Letters are numbered by position in the alphabet, wrapping every nine:

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|
| A | B | C | D | E | F | G | H | I |
| J | K | L | M | N | O | P | Q | R |
| S | T | U | V | W | X | Y | Z |   |

**Vowels** are A, E, I, O and U. **Y is always a consonant.** Some sources count Y as a vowel when it carries the vowel sound (as in "myth" or "rhythm"); deciding that needs pronunciation, which a calculation cannot know, so this library keeps the rule fixed.

## Name normalisation

Before the table is applied, a name is:

1. stripped of special letters with no decomposition: `ı → i`, `ß → ss`, `æ → ae`, `œ → oe`, `ø → o`, `ł → l`, `đ`/`ð → d`, `þ → th`;
2. decomposed with compatibility mapping (Unicode NFKD) and stripped of combining marks, so `ç → c`, `í → i`, `ñ → n`, `å → a`, `ĳ → ij` and full-width `Ａ → A`;
3. lower-cased, with everything except `a` to `z` removed.

`"Joaquín Weiß"` becomes `"joaquinweiss"`, and `"Mireille Søndergaard"` becomes `"mireillesondergaard"`. Turkish `ç ğ ı İ ş ö ü` fold to `c g i i s o u`. Spaces, hyphens, apostrophes and digits are ignored. Letters from non-Latin scripts are ignored as well; a name that has no Latin letters at all is rejected.

## Life path

Day, month and year are each reduced on their own (masters kept), then their sum is reduced (masters kept).

`3 November 1988`: day `3`, month `11` (master, kept), year `1+9+8+8 = 26 → 8`. Sum `3 + 11 + 8 = 22` → **22**.

Reducing each part first is the most common method. Adding all eight digits at once (`0+3+1+1+1+9+8+8 = 31 → 4`) gives a different answer for some dates, including this one.

## Birthday

The day of the month, reduced with masters kept: `29 → 11`, `15 → 6`, `22 → 22`.

## Expression, soul urge, personality

| Number | Letters |
|---|---|
| Expression | all letters of the full name |
| Soul urge | vowels |
| Personality | consonants |

Each total is reduced with masters kept. `Tobias Lindqvist`: all letters `2+6+2+9+1+1 + 3+9+5+4+8+4+9+1+2 = 66 → 12 → 3`; vowels `6+9+1+9+9 = 34 → 7`; consonants `66 − 34 = 32 → 5`.

A name with no vowels has a soul urge of 0, and one with no consonants has a personality of 0.

## Maturity

Life path plus expression, reduced with masters kept: life path 5 and expression 3 give **8**; life path 4 and expression 7 give **11**.

## Personal year

Birth month, birth day and the target year are each reduced fully, added, and reduced fully again.

Born 3 November, year 2026: month `11 → 2`, day `3`, year `2+0+2+6 = 10 → 1`. Sum `6` → **6**.

## Karmic debt

13, 14, 16 and 19 are karmic debt numbers. A hit is reported when one of them appears as:

- **birthday:** the day of the month itself (born on the 13th, 14th, 16th or 19th);
- **lifePath:** the sum of the reduced day, month and year, before the final reduction (`1990-07-15`: `6 + 7 + 1 = 14`);
- **expression:** the raw total of the name or any step of its reduction (`Katja Falk`: `7 + 12 = 19`; `Henrik Bauer`: `38 + 20 = 58 → 13`).

Each result carries the matching `total` so it can be checked by hand.

## Karmic lessons and hidden passion

Both count the letter values 1 to 9 in the full name. **Karmic lessons** are the values that never occur. **Hidden passion** is the value that occurs most often; ties return every value with the highest count.

## Cornerstone and capstone

The cornerstone is the value of the first letter of the first word, and the capstone the value of the last letter of the last word. Words without Latin letters are skipped, so `"Élise 3 Moreau"` uses `É` and the final `u`.

## Address number

The digits of a house or street number, reduced fully: `1428 → 15 → 6`. Other characters are ignored, so `12B` counts as `12` and `12-14` as `1214`. Numbers and strings follow the same rule: zero (`0`, `"00"`) and negative input (`-12`, `"-12"`) are rejected, as is a fractional number.

## Compatibility

`compatibility` is a group-based heuristic. **Numerology has no standard compatibility score; the numbers below are a convention of this library.** They can be overridden through the `weights` argument.

Numbers are reduced first and sorted into three classical groups. Master numbers follow their root:

| Group | Numbers |
|---|---|
| Physical | 1, 4, 8, 22 |
| Mental | 3, 5, 6, 33 |
| Intuitive | 2, 7, 9, 11 |

| Relation | Default score |
|---|---|
| Same number | 88 |
| Same group | 78 |
| Intuitive and mental | 70 |
| Mental and physical | 64 |
| Intuitive and physical | 58 |

If either number is a master number, 4 points are added, up to a maximum of 94.

| Band | Score |
|---|---|
| radiant | 85 or more |
| warm | 72 to 84 |
| workable | 62 to 71 |
| spiky | below 62 |

The weight names in `COMPATIBILITY_WEIGHTS` are `same`, `sameGroup`, `intuitiveMental`, `mentalPhysical`, `intuitivePhysical`, `masterBonus`, `masterCap`, `radiant`, `warm` and `workable`.

## Dates

Dates use the proleptic Gregorian calendar, checked with plain arithmetic: years from 1 to 9999, months 1 to 12, days up to the length of the month, and leap years every fourth year except centuries not divisible by 400. JavaScript `Date` is not used, so results never depend on the time zone.
