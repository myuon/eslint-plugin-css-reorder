import * as csstree from "css-tree";

export const extended: typeof csstree = (csstree as any).fork(
  (syntaxConfig: any) => {
    const defaultGetNode = syntaxConfig.scope.Selector.getNode;

    syntaxConfig.scope.Selector.getNode = function (context: any) {
      // 0x0026: &
      if (this.isDelim(0x0026)) {
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
  }
);
