import { toPlainObject } from "css-tree";
import { extended } from "../src/parser";

test("a &", () => {
  const ast = extended.parse("a & ", { context: "selector" });
  expect(toPlainObject(ast)).toStrictEqual({
    type: "Selector",
    loc: null,
    children: [
      { type: "TypeSelector", loc: null, name: "a" },
      {
        type: "Combinator",
        loc: null,
        name: " ",
      },
      {
        type: "Nested",
        loc: null,
      },
    ],
  });
});

test("nested blocks", () => {
  const ast = extended.parse("a { div { display: flex; } }");
  expect(toPlainObject(ast)).toStrictEqual({
    type: "StyleSheet",
  });
});
