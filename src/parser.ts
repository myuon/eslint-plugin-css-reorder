import * as csstree from "css-tree";

const Ampersand = 0x0026;

export const extended = csstree.fork((syntaxConfig) => {
  const defaultGetNode = syntaxConfig.scope.Selector.getNode;

  syntaxConfig.scope.Selector.getNode = function (context) {
    if (this.isDelim(Ampersand)) {
      const start = this.tokenStart;
      this.next();

      return {
        type: "Nested",
        loc: this.getLocation(start, this.tokenEnd),
      };
    }

    return defaultGetNode.call(this, context);
  };

  return syntaxConfig;
});
