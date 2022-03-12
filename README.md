# eslint-plugin-stylelint

ESLint plugin for stylelint with CSS-in-JS

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-stylelint`:

```sh
npm install eslint-plugin-stylelint --save-dev
```

## Usage

Add `stylelint` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "stylelint"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "stylelint/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


