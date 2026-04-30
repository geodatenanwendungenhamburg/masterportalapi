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
| Run tests in watch mode | `npm run test:watch` |
| Pre-push check (ESLint + tests) | `npm run prePushHook` |
| Generate API docs | `npm run generate-jsdoc` |

## Asking Questions

If you have questions about using or developing with masterportalAPI, start by checking the [README](./README.md). If you have found a bug or want to propose an improvement, use the [Bitbucket Issue Tracker](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/issues).

## Getting Familiar with the Code in the Repository

The repository is organized into a few main areas:

- `src/` contains the library source code
- `test/` contains the automated test suite
- `example/` contains a Parcel-based example app for manual testing
- `public/` contains public assets used by the example and runtime utilities

If you are new to the codebase, begin with [README.md](./README.md), then inspect the relevant modules in `src/` and the corresponding test files in `test/`.

## How to Contribute

1. **Fork or branch** the repository according to your access level and team workflow.
2. **Install dependencies** with `npm install`.
3. **Use a supported runtime**. The project currently supports Node.js `^22.19.0 || ^24.11.1` and npm `^10.5.0 || ^11.6.2` as defined in [package.json](./package.json).
4. **Make focused changes** in `src/` and keep related tests updated in `test/`.
5. **Run the checks** with `npm run prePushHook` before opening a pull request.
6. **Update documentation** when behavior, API usage, or developer-facing workflows change.
7. **Update the changelog** by adding an entry under `Unreleased` in [CHANGELOG.md](./CHANGELOG.md).
8. **Open a Pull Request** in Bitbucket with a clear description of the change, the motivation behind it, and any testing you performed.

## Reporting Issues

Use the [Bitbucket Issue Tracker](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/issues). Please include:

- A clear description of the bug or feature request
- Steps to reproduce, if applicable
- Expected behavior and actual behavior
- Your Node.js and npm versions
- Relevant configuration, layer definitions, or service URLs when applicable
- Screenshots, logs, or stack traces if they help explain the problem

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./License.txt).
