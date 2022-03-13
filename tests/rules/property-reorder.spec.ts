import { TSESLint } from "@typescript-eslint/experimental-utils";
import { propertyReorder } from "../../src/rules/property-reorder";

const tester = new TSESLint.RuleTester({
  parser: require.resolve("espree"),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
});

tester.run("property-reorder", propertyReorder, {
  valid: [
    { code: "css`a { display: flex; flex: 1; }`" },
    { code: "css`display: flex; flex: 1;`" },
  ],
  invalid: [
    {
      code: "css`a { flex: 1; display: flex; }`",
      errors: [{ messageId: "property-reorder" }],
    },
    {
      code: "css`flex: 1; display: flex;`",
      errors: [{ messageId: "property-reorder" }],
    },
  ],
});
