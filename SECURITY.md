# Security policy

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's private reporting instead:
**Security → Report a vulnerability** on this repository
(<https://github.com/amercans/pythagorean-numerology/security/advisories/new>).

Include what you found, how to reproduce it and which version you tested.
You can expect an acknowledgement within a week.

## Scope

The library has no runtime dependencies, performs no I/O and keeps no state.
Of most interest are inputs that make a function hang, consume excessive memory
or throw something other than a `TypeError` or `RangeError`.

## Supported versions

Only the latest release receives fixes.
