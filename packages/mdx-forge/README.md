## Introduction

MDX Forge provides a straightforward approach to transform your content into a JSON structure from the command line.

## Getting Started

### Create a Project

Start by creating a new Next.js project using **create-next-app**:

```bash
npx create-next-app@latest
cd my-app
npm install
```

### Initialize a mdx-forge

Ensure you're in the proper working directory:

```bash
npx mdx-forge@latest init
```
Follow the prompts to configure your project, using the default configuration to begin with, which includes an example directory. This command creates an mdx.forge.json in the root of your application.

### Forge a content

To generate your content, run:

```bash
npx mdx-forge@latest forge
```

## Configuration (mdx.forge.json)

```
{

    /**
    * Directory with your .mdx files
    **/

    contentDirPath: "content/docs",

    /**
    * Directory where your content will be generated
    **/

    outputDirPath: ".mdx-forge",

    /**
    * (Optional) schema used to generate types. 
    * Reference: https://www.npmjs.com/package/json-schema-to-typescript
    **/

    schema: {}

}
```

## Usage

### Syntax

Use the following basic template for your MDX files. MDX-Forge supports YAML syntax. <br />
[Learn more about YAML](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)

```
---
title: Example file
date: 05-16-2024
tags:
- hello
- world
category: articles
---

This is a paragraph

<CustomComponent value="some_value" />

```

### tsconfig.json

Adjust your tsconfig.json to include custom paths:

```
// tsconfig.json
compilerOptions: {
    baseUrl: ".",
    paths: {
         "@mdx-forge": ["./.mdx-forge"]
    }
}
```
### Import all files and types

```
import allFiles, { my-custom-types } from "@mdx-forge"
```

_Note: For performance reasons, the index file (default export from MDX-Forge) does not include "content" value and key._


### Import single file

Use a utility function for server-side file retrieval: 

```ts
import fs from "fs";
import path from "path";
import { MdxFileInterface } from "@mdx-forge";

export async function getDocFromFileName(fileName: string) {
  try {
    const cwd = process.cwd();
    const file = await fs.promises.readFile(
      path.join(cwd, "path-to-your-content", `${fileName}.json`),
      "utf8"
    );
    return JSON.parse(file) as MdxFileInterface;
  } catch (e) {
    throw e;
  }
}
```

### package.json

Set up scripts to generate content on build and development:

```json
{
    "scripts": 
    {
        "mdx-forge:build": "npx mdx-forge@latest forge",
        "build": "npm run mdx-forge:build && next build",
        "dev": "npm run mdx-forge:build && next dev"
    }
}
```