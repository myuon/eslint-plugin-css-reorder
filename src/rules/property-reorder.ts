import { TSESLint } from "@typescript-eslint/experimental-utils";
import { ChildNode } from "postcss";
import { parse } from "../parser";

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
        const root = parse(`${eslintNode.quasi.quasis[0].value.raw}`);

        const walk = (nodes: ChildNode[]) => {
          let lastPropertyName = "";
          let lastNodeOrderIndex = 0;
          nodes.forEach((childNode) => {
            if (childNode.type !== "decl") {
              return;
            }

            const property = childNode.prop;
            const index = propertyOrder.findIndex((prop) => prop === property);
            if (index < 0) {
              return;
            }

            if (index < lastNodeOrderIndex) {
              context.report({
                node: eslintNode,
                messageId: "property-reorder",
                data: {
                  property,
                  before: lastPropertyName,
                },
              });
            }

            lastNodeOrderIndex = index;
            lastPropertyName = property;
          });
        };

        root.walkRules((node) => walk(node.nodes));

        // Nodes in root cannot be visited by walkRules
        walk(root.nodes);
      },
    };
  },
};
