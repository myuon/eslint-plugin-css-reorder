import { TSESLint } from "@typescript-eslint/experimental-utils";
import { cssInterpolation } from "../../src/rules/css-interpolation";

const tester = new TSESLint.RuleTester({
  parser: require.resolve("espree"),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
});

tester.run("css-interpolation", cssInterpolation, {
  valid: [{ code: "css``" }],
  invalid: [
    {
      code: "css`a { color: #y3; }`",
      errors: [{ messageId: "css-interpolation" }],
    },
  ],
});
