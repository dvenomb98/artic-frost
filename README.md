# ARTIC FROST

This is a monorepo powered by Turborepo.

## Project structure

- `apps/chess` - A multiplayer chess application.
- `apps/docs` - A documentation site for my packages and projects.
- `apps/web` - My personal website.

- `packages/ui` - Internal UI library
- `packages/eslint-config` - Internal ESLint config library
- `packages/typescript-config` - Internal TypeScript config library

- `packages/chess-lite` - Zero dependency chess library used to build the
  `chess` app. Its published on NPM as `chess-lite`.
- `packages/fresh-scroll` - Zero dependency react infinite scroll component. Its
  published on NPM as `fresh-scroll`.

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
