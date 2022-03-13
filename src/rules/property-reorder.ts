import { TSESLint } from "@typescript-eslint/experimental-utils";
import * as csstree from "css-tree";

const propertyOrder = ["display", "flex"];

export const propertyReorder: TSESLint.RuleModule<"property-reorder", []> = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      "property-reorder":
        "Property {{ property }} should be ordered before {{ before }}.",
    },
  },
  create: (context) => {
    return {
      "TaggedTemplateExpression[tag.name='css']": (eslintNode: any) => {
        const ast = csstree.parse(
          `* {${eslintNode.quasi.quasis[0].value.raw}}`
        );
        console.log(JSON.stringify(ast));

        csstree.walk(ast, (node: csstree.CssNode) => {
          if (node.type === "Block") {
            let lastPropertyName = "";
            let lastNodeOrderIndex = 0;
            node.children.forEach((childNode) => {
              console.log(childNode);
              if (childNode.type !== "Declaration") {
                return;
              }

              const property = childNode.property;
              const index = propertyOrder.findIndex(
                (prop) => prop === property
              );
              if (index < 0) {
                return;
              }

              if (index < lastNodeOrderIndex) {
                context.report({
                  node: eslintNode,
                  messageId: "property-reorder",
                  data: {
                    property,
                    lastPropertyName,
                  },
                });
              }

              lastNodeOrderIndex = index;
              lastPropertyName = property;
            });
          }
        });
      },
    };
  },
};
