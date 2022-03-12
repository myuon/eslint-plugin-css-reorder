import { TSESLint } from "@typescript-eslint/experimental-utils";
import stylelint from "stylelint";

export const cssInterpolation: TSESLint.RuleModule<"css-interpolation", []> = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      "css-interpolation":
        "Run stylelint inside css interpolation for libraries such as emotion",
    },
  },
  create: (context) => {
    return {
      "TaggedTemplateExpression[tag.name='css']": (node: any) => {
        stylelint.lint({
          code: node.quasi.quasis[0].value.raw,
        });
      },
    };
  },
};
