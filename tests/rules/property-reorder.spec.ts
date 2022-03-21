import { TSESLint } from "@typescript-eslint/experimental-utils";
import { propertyReorder } from "../../src/rules/property-reorder";

const tester = new TSESLint.RuleTester({
  parser: require.resolve("espree"),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

tester.run("property-reorder", propertyReorder, {
  valid: [
    { code: "css`a { display: flex; flex: 1; }`" },
    { code: "css`display: flex; flex: 1;`" },
    {
      code: "const render = () => { return ( <div css={css`display: ${'gr' + 'id'};\n`}><img /></div> ); };",
    },
    {
      code: "const render = () => { return ( <div css={css`display:${theme.display};gap:${theme.gap};`}><img /></div> ); };",
    },
    {
      code: `const styles = css\`
        // comment
      \``,
    },
  ],
  invalid: [
    {
      code: "css`a { flex: 1; display: flex; }`",
      errors: [
        {
          messageId: "property-reorder",
        },
      ],
      output: "css`a { display: flex; flex: 1; }`",
    },
    {
      code: "css`flex: 1; display: flex;`",
      errors: [
        {
          messageId: "property-reorder",
        },
      ],
      output: "css`display: flex;flex: 1;`",
    },
    {
      code: "const render = () => { return ( <div css={css`gap: 16px;\ndisplay: grid;\n`}><img /></div> ); };",
      errors: [
        {
          messageId: "property-reorder",
        },
      ],
      output:
        "const render = () => { return ( <div css={css`display: grid;gap: 16px;`}><img /></div> ); };",
    },
    {
      code: "css`a { display }`",
      errors: [
        {
          messageId: "css-error",
        },
      ],
    },
  ],
});
