# pythagorean-numerology

[![CI](https://github.com/amercans/pythagorean-numerology/actions/workflows/ci.yml/badge.svg)](https://github.com/amercans/pythagorean-numerology/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/amercans/pythagorean-numerology)](https://github.com/amercans/pythagorean-numerology/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Pythagorean numerology calculations for TypeScript and JavaScript, by [True Numerology](https://truenumerology.com): life path, expression, soul urge, personality, personal year, karmic debt and the rest of a standard chart.

**Try it:** [truenumerology.com/life-path](https://truenumerology.com/life-path)

<img src="docs/screenshot.webp" alt="Life path calculator on truenumerology.com showing 22, a master number, for 3 November 1988" width="620">

- **Deterministic.** The same input always gives the same number. The library calculates; it does not interpret.
- **No dependencies, no network.** Plain ES2022 with no platform APIs, so it runs in Node 20+ and in modern browsers. ESM and CommonJS builds with type definitions.
- **Names from any Latin alphabet.** `Joaquín`, `Weiß`, `Søndergaard` and `Łucja` are folded to plain letters instead of losing characters.
- **Documented method.** Numerology schools disagree on details. Every rule this library follows is written down in [METHODOLOGY.md](METHODOLOGY.md), with worked examples.
- **Fully tested.** 100% line and branch coverage.

## Why

Most numerology code is either embedded in a single website or wrapped in a paid API that needs a network round trip and a key. Neither is easy to test, and both tend to drop accented letters silently, so `Søndergaard` and `Sondergaard` give different results.

This library is the calculation engine on its own: small, typed and checkable against the worked examples in the methodology. It grew out of the calculators on the site.

## Install

The package is installed straight from GitHub; npm builds it on install.

```sh
npm install github:amercans/pythagorean-numerology
```

To pin a release, add its tag (`github:amercans/pythagorean-numerology#v1.0.0`). Each [release](https://github.com/amercans/pythagorean-numerology/releases) also carries a prebuilt tarball that can be installed with `npm install <tarball-url>`.

## Usage

```ts
import { lifePath, nameNumbers, fullChart, compatibility } from "pythagorean-numerology";

lifePath(1988, 11, 3);
// { number: 22, isMaster: true, steps: { day: 3, month: 11, year: 8 } }

nameNumbers("Tobias Lindqvist");
// { expression: 3, soulUrge: 7, personality: 5, isMaster: false }

fullChart("Tobias Lindqvist", 1990, 7, 15);
// { lifePath: 5, expression: 3, soulUrge: 7, personality: 5,
//   birthday: 6, maturity: 8, masters: [] }

compatibility(1, 8);
// { a: 1, b: 8, score: 78, band: "warm", relation: "same-group" }
```

CommonJS works too:

```js
const { personalYear } = require("pythagorean-numerology");

personalYear(11, 3, 2026).number; // 6
```

Dates are passed as `(year, month, day)` with `year` from 1 to 9999 and `month` from 1 to 12, so there is no `Date` object and no time-zone shift.

## API

| Function | Returns |
|---|---|
| `lifePath(year, month, day)` | Life path number with the reduced day, month and year |
| `birthdayNumber(day)` | Day of the month, reduced (29 → 11) |
| `personalYear(birthMonth, birthDay, targetYear)` | Personal year number, always 1 to 9 |
| `nameNumbers(fullName)` | Expression, soul urge and personality numbers |
| `karmicLessons(fullName)` | Values 1 to 9 missing from the name |
| `hiddenPassion(fullName)` | Most frequent letter value(s) in the name |
| `cornerstoneCapstone(fullName)` | First letter of the first name, last letter of the surname |
| `maturityNumber(lifePath, expression)` | Life path plus expression, reduced |
| `karmicDebt(fullName, year, month, day)` | Karmic debt numbers (13, 14, 16, 19) and where they occur |
| `fullChart(fullName, year, month, day)` | All core numbers in one object |
| `compatibility(a, b, weights?)` | Group-based score, band and relation for two numbers |
| `addressNumber(input)` | House or street number, reduced to 1 to 9; zero and negative input are rejected |
| `reduce(n)` / `reduceFully(n)` | Digit-sum reduction, with or without master numbers |
| `normalizeName(name)` / `letterValue(letter)` | Name folding and the Pythagorean letter table |
| `isValidDate(year, month, day)` / `daysInMonth(year, month)` | Calendar checks |
| `isMasterNumber(n)` | `true` for 11, 22 and 33 |

Constants: `MASTER_NUMBERS`, `KARMIC_DEBT_NUMBERS`, `COMPATIBILITY_WEIGHTS`, `MAX_YEAR`. All result types are exported.

### Errors

Invalid input throws instead of returning a misleading number. Every calculating function follows the same rule:

- `TypeError` when an argument has the wrong type, for example `lifePath("1990", 1, 1)` or a number where a name is expected.
- `RangeError` when the type is right but the value is not: a date that does not exist, a year outside 1 to 9999, a negative, fractional or unsafe integer, a name with no Latin letters, an address that is zero or negative, or a `letterValue` argument longer than one character.

The predicates `isValidDate` and `isMasterNumber` never throw; they return `false` for invalid input.

### Compatibility weights

`compatibility` sorts numbers into three classical groups and scores the pair by whether they share the number, the group or neither. The scores are a convention of this library, not a numerological standard, so every one of them can be changed:

```ts
compatibility(4, 4, { same: 95 }).score; // 95
```

See [METHODOLOGY.md](METHODOLOGY.md#compatibility) for the default table.

## Limitations

- **Latin alphabet only.** Letters from other scripts (Cyrillic, Greek, Arabic, Hebrew, CJK and so on) are ignored, because the Pythagorean table has no values for them. A name written only in another script throws a `RangeError`.
- **One school of calculation.** Y always counts as a consonant, and only 11, 22 and 33 are master numbers. The reasons and the alternatives are in [METHODOLOGY.md](METHODOLOGY.md).
- **No interpretation.** The library returns numbers, not their meanings.

## Contributing

Bug reports and pull requests are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md). Report security issues privately as described in [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
