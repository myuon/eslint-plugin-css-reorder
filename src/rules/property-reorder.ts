import { TSESLint, TSESTree } from "@typescript-eslint/experimental-utils";
import { Node } from "postcss";
import { parse } from "../parser";
import getContainingNode from "postcss-sorting/lib/getContainingNode";
import sortNode from "postcss-sorting/lib/order/sortNode";
import sortNodeProperties from "postcss-sorting/lib/properties-order/sortNodeProperties";

// cf: https://qiita.com/akuden/items/e9c91a7a2b0596d53fd1
const propertyOrder = [
  [
    "display",
    "flex",
    "flex-grow",
    "flex-shrink",
    "flex-basis",
    "flex-flow",
    "flex-wrap",
    "flex-direction",
    "grid",
    "grid-template",
    "grid-template-columns",
    "grid-template-rows",
    "grid-template-areas",
    "grid-auto-columns",
    "grid-auto-rows",
    "grid-auto-flow",
    "grid-gap",
    "grid-column-gap",
    "grid-row-gap",
    "grid-area",
    "grid-column",
    "grid-column-start",
    "grid-column-end",
    "grid-row",
    "grid-row-start",
    "grid-row-end",
    "align-content",
    "align-items",
    "align-self",
    "justify-content",
    "justify-items",
    "justify-self",
    "order",
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "z-index",
    "transform",
    "transform-origin",
    "transform-style",
    "backface-visibility",
    "perspective",
    "float",
    "clear",
  ],
  ["overflow", "overflow-x", "overflow-y", "visibility"],
  [
    "box-sizing",
    "table-layout",
    "caption-side",
    "empty-cells",
    "width",
    "min-width",
    "max-width",
    "height",
    "min-height",
    "max-height",
    "margin",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
    "padding",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "border",
    "border-top",
    "border-right",
    "border-bottom",
    "border-left",
    "border-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "border-style",
    "border-top-style",
    "border-right-style",
    "border-bottom-style",
    "border-left-style",
    "border-width",
    "border-top-width",
    "border-right-width",
    "border-bottom-width",
    "border-left-width",
    "border-radius",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-bottom-right-radius",
    "border-bottom-left-radius",
    "border-image",
    "border-image-source",
    "border-image-slice",
    "border-image-width",
    "border-image-outset",
    "border-image-repeat",
    "box-shadow",
  ],
  [
    "background",
    "background-color",
    "background-image",
    "background-repeat",
    "background-attachment",
    "background-position",
    "background-size",
    "background-clip",
  ],
  ["object-fit", "object-position"],
  ["opacity", "color"],
  [
    "font",
    "font-family",
    "font-variant",
    "font-weight",
    "font-stretch",
    "font-size",
    "font-style",
    "line-height",
    "letter-spacing",
    "text-align",
    "text-decoration",
    "text-indent",
    "text-transform",
    "text-shadow",
    "text-overflow",
    "text-overflow-ellipsis",
    "text-overflow-mode",
    "word-wrap",
    "word-break",
    "word-spacing",
    "white-space",
    "vertical-align",
  ],
  [
    "columns",
    "column-width",
    "column-count",
    "column-gap",
    "column-rule",
    "column-rule-width",
    "column-rule-style",
    "column-rule-color",
    "column-fill",
    "column-span",
    "break-after",
    "break-before",
    "break-inside",
  ],
  [
    "list-style",
    "list-style-type",
    "list-style-position",
    "list-style-image",
    "counter-increment",
    "counter-reset",
    "content",
    "quotes",
  ],
  [
    "pointer-events",
    "cursor",
    "outline",
    "outline-width",
    "outline-style",
    "outline-color",
    "outline-offset",
    "resize",
  ],
  [
    "transition",
    "transition-property",
    "transition-duration",
    "transition-timing-function",
    "transition-delay",
    "animation",
    "animation-name",
    "animation-duration",
    "animation-timing-function",
    "animation-delay",
    "animation-iteration-count",
    "animation-direction",
    "animation-fill-mode",
    "animation-play-state",
  ],
].flat();

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
        const raw = `&{${eslintNode.quasi.quasis[0].value.raw}}`;
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
          // You can't just stringify rootChanged.first, need to strip the enclosing {}
          const re = /\&\{(.*)\}/s;
          const body = rootChanged.toString().match(re)?.[1].trim();
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
