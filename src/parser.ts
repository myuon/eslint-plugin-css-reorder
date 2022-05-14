import postcss, { ProcessOptions } from "postcss";

// A postcss plugin cannnot be used here: poctcss plugin will generate Promise parser, but we need a synchronous parser for eslint.

const preprocess = (css: string) => {
  // remove a line comment and insert a block comment
  // URL pattern (://) should be ignored
  return css.replace(
    /(?<!\:)\/\/(.*)/g,
    (_, p1: string) => `/* ${p1.trim()} */`
  );
};
any;

export const parse = (
  css: string,
  opts?: Pick<ProcessOptions, "map" | "from"> | undefined
) => {
  return postcss.parse(preprocess(css), opts);
};
