import { parse } from "../src/parser";

test("selector with &", () => {
  const root = parse("a & {}");
  expect(root.toString()).toBe(`a & {}`);
});

test("nested blocks", () => {
  const root = parse("a { div { display: flex; } }");
  expect(root.toString()).toBe(`a { div { display: flex; } }`);
});
