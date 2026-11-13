# Contributing

Bug reports and pull requests are welcome.

- Keep changes small and focused; explain the problem the change solves.
- Run `npm run check` before opening a pull request. It runs ESLint, the type
  checker, the tests with coverage and the build, and CI runs the same steps.
  Coverage is held at 100%, so new code needs tests.
- A calculation that disagrees with a book or another calculator is not
  necessarily a bug: schools differ. Check [METHODOLOGY.md](METHODOLOGY.md) first.
  If you propose a different rule, cite the source and add a worked example.
- Changes to a calculation rule belong in `METHODOLOGY.md` as well as in the code.
- Use made-up names in tests and examples, not real people.
- Behaviour changes that affect users belong in `CHANGELOG.md` under "Unreleased".

By contributing you agree that your contribution is licensed under the MIT License.
