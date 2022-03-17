import { TSESLint, TSESTree } from "@typescript-eslint/experimental-utils";
import { Node } from "postcss";
import { parse } from "../parser";
import getContainingNode from "postcss-sorting/lib/getContainingNode";
import sortNode from "postcss-sorting/lib/order/sortNode";
import sortNodeProperties from "postcss-sorting/lib/properties-order/sortNodeProperties";
import { properties } from "../properties";

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
        // UGLY!
        const raw = `&{${eslintNode.quasi.quasis.reduce(
          (acc, cur, index) =>
            acc +
            (index > 0 ? `var(--placeholder_${index - 1})` : "") +
            cur.value.raw,
          ""
        )}}`;
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
            order: properties,
            unspecifiedPropertiesPosition: "bottom",
          });
        };

        const rootChanged = root.clone();
        rootChanged.walk(reorder);

        if (root.toString() !== rootChanged.toString()) {
          // You can't just stringify rootChanged.first, need to strip the enclosing {}
          const re = /\&\{(.*)\}/s;
          const body = rootChanged.toString().match(re)?.[1].trim();
          if (!body) {
            throw new Error("Unexpected");
          }

          // Recover placeholder_**
          const source = context.getSourceCode();
          const recover = (body: string) => {
            return eslintNode.quasi.expressions.reduce(
              (acc, expr, index) =>
                acc.replace(
                  `var(--placeholder_${index})`,
                  "${" + `${source.getText(expr)}` + "}"
                ),
              body
            );
          };

          context.report({
            node: eslintNode,
            messageId: "property-reorder",
            fix: (fixer) => {
              return fixer.replaceText(
                eslintNode,
                "css`" + recover(body) + "`"
              );
            },
          });
        }
      },
    };
  },
};
