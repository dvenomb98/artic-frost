# ARTIC FROST

This is a monorepo powered by Turborepo.

## Project structure

- `apps/chess` - A multiplayer chess application.
- `apps/web` - My personal website.

- `packages/ui` - Internal UI library
- `packages/eslint-config` - Internal ESLint config library
- `packages/typescript-config` - Internal TypeScript config library
- `packages/markdown` - Internal Markdown library
- `packages/chess-lite` - Zero dependency chess library used to build the
  `chess` app. Its published on NPM as `chess-lite`.

## Development

### Setup

```bash
npm install
```

To run a specific project, perform the following command from root directory:

```bash
npm run dev --workspace=apps/chess // replace apps/chess with the project you want to run
```

To run all projects, perform the following command from root directory:

```bash
npm run dev
```

### Relasing packages

This project uses [Changesets](https://github.com/changesets/changesets) to manage releases.

To release a new version of a package, perform the following command from root directory:

```bash
npm run changeset
```

Push the changes to the repository and create a pull request.

Once the pull request is merged, the packages will be released to NPM.
