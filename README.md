# eslint-plugin-css-reorder

[![npm version](https://badge.fury.io/js/eslint-plugin-css-reorder.svg)](https://badge.fury.io/js/eslint-plugin-css-reorder) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ESLint plugin for CSS properties reordering

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-css-reorder`:

```sh
npm install eslint-plugin-css-reorder --save-dev
```

## Usage

Add `css-reorder` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["css-reorder"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "css-reorder/rule-name": 2
  }
}
```

## Supported Rules

- property-reorder
