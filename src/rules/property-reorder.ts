import { TSESLint, TSESTree } from "@typescript-eslint/experimental-utils";
import { ChildNode, Node } from "postcss";
import { parse } from "../parser";
import getContainingNode from "postcss-sorting/lib/getContainingNode";
import sortNode from "postcss-sorting/lib/order/sortNode";
import sortNodeProperties from "postcss-sorting/lib/properties-order/sortNodeProperties";

const propertyOrder = [["display", "flex"]].flat();

export const propertyReorder: TSESLint.RuleModule<"property-reorder", []> = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      "property-reorder": "Need reorder",
    },
    fixable: "code",
    hasSuggestions: true,
  },
  create: (context) => {
    return {
      "TaggedTemplateExpression[tag.name='css']": (
        eslintNode: TSESTree.TaggedTemplateExpression
      ) => {
        const raw = `& { ${eslintNode.quasi.quasis[0].value.raw} }`;
        const root = parse(raw);

        const reorder = (input: Node) => {
          const node = getContainingNode(input);

          sortNode(node, [
            "custom-properties",
            "dollar-variables",
            "at-variables",
            "declarations",
            "rules",
            "at-rules",
          ]);
          sortNodeProperties(node, {
            order: propertyOrder,
            unspecifiedPropertiesPosition: "bottom",
          });
        };

        const rootChanged = root.clone();
        rootChanged.walk(reorder);

        if (root.toString() !== rootChanged.toString()) {
          const re = /\&\s\{\s(.*)\s\}/;
          const body = re.exec(rootChanged.toString())?.[1];
          if (!body) {
            throw new Error("Unexpected");
          }

          context.report({
            node: eslintNode,
            messageId: "property-reorder",
            fix: (fixer) => {
              return fixer.replaceText(eslintNode, "css`" + body + "`");
            },
          });
        }
      },
    };
  },
};
