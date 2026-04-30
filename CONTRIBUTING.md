# Contributing to masterportalAPI

Thank you for your interest in contributing to masterportalAPI. This document is the entry point for contributors.

If a policy, workflow, or convention is not defined in this repository, the corresponding rules from the [main Masterportal project](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/) apply.

## Code of Conduct

All participants are expected to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Developer Documentation

The main developer documentation for this repository is available in these places:

- **[Project overview and usage](./README.md)** — Installation, package usage, error handling, and available scripts
- **[Example setup](./example/README.md)** — How to use the example application for manual testing
- **[API documentation generation](./README.md#scripts)** — Generate local JSDoc output with `npm run generate-jsdoc`
- **[Changelog](./CHANGELOG.md)** — Add your changes under `Unreleased`
- **[Package metadata](./package.json)** — Supported Node.js and npm versions, scripts, dependencies, and repository metadata

If you need guidance that is not documented in this repository, follow the corresponding documentation and contribution rules from the [main Masterportal project](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/).

## Quick Reference

| What | Where |
|---|---|
| Install dependencies | `npm install` |
| Start the example dev server | `npm run example` |
| Run tests | `npm test` |
| Pre-push check (ESLint + tests) | `npm run prePushHook` |
| Generate API docs | `npm run generate-jsdoc` |

## Asking Questions

If you have questions about using or developing with masterportalAPI, start by checking the [README](./README.md).

## Getting Familiar with the Code in the Repository

The repository is organized into a few main areas:

- `src/` contains the library source code
- `test/` contains the automated test suite
- `example/` contains a Parcel-based example app for manual testing
- `public/` contains public assets used by the example and runtime utilities

If you are new to the codebase, begin with [README.md](./README.md), then inspect the relevant modules in `src/` and the corresponding test files in `test/`.

## How to Contribute

1. **Fork the repository** — external developers do not receive write access. See Forks.
2. **Branch from dev** and follow the Git workflow.
3. **Write code** that adheres to the coding conventions.
4. **Add tests** for new or changed functionality.
5. **Update the changelog** — add an entry under `Unreleased` in [CHANGELOG.md](./CHANGELOG.md).
6. **Open a Pull Request** against dev. Reviewers will check against the Definition of Done.

## Reporting Issues

Use the [Bitbucket Issue Tracker](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/issues). Please include:

- A clear description of the problem or feature request
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- npm and Node.js version
- Relevant configuration
- Screenshots, logs if they help explain the problem

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./License.txt).
