import { parse } from "../src/parser";

test("selector with &", () => {
  const root = parse("a & {}");
  expect(root.toString()).toBe(`a & {}`);
});

test("nested blocks", () => {
  const root = parse("a { div { display: flex; } }");
  expect(root.toString()).toBe(`a { div { display: flex; } }`);
});

test("line comment", () => {
  const root = parse(`// hoge
display: flex;`);
  expect(root.toString()).toBe(`/* hoge */
display: flex;`);
});
