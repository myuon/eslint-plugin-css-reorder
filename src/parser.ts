import * as csstree from "css-tree";

export const extended: typeof csstree = (csstree as any).fork(
  (syntaxConfig: any) => {
    const defaultGetNode = syntaxConfig.scope.Selector.getNode;

    // Parse selector containing '&' (Nested)
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
    // Parse nested blocks (a Block in a Block)
    console.log(syntaxConfig.node.Block);
    syntaxConfig.node.Block.structure = {
      children: [["Atrule", "Rule", "Declaration", "Block"]],
    };

    return syntaxConfig;
  }
);
