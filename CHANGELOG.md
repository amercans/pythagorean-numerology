# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.0] - 2026-11-13

### Added
- Life path, birthday and personal year numbers from a birth date.
- Expression, soul urge and personality numbers, karmic lessons, hidden passion,
  cornerstone and capstone from a full name.
- Maturity number, karmic debt detection and a full chart in one call.
- Group-based compatibility score with overridable weights.
- Address number, digit-sum reduction with and without master numbers, and
  calendar checks without `Date`.
- Name normalisation that folds diacritics, ligatures and full-width forms from
  Latin alphabets (`ç`, `í`, `ß`, `ø`, `ł`, `ĳ`, `Ａ` and others) instead of dropping them.
- Consistent errors: `TypeError` for a wrong argument type, `RangeError` for an
  out-of-range value. Dates are accepted from year 1 to 9999.
- ESM and CommonJS builds with type definitions; no runtime dependencies.

[Unreleased]: https://github.com/amercans/pythagorean-numerology/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/amercans/pythagorean-numerology/releases/tag/v1.0.0
