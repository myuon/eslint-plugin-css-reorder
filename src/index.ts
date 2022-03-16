import { propertyReorder } from "./rules/property-reorder";

export = {
  rules: {
    "property-reorder": propertyReorder,
  },
  configs: {
    all: {
      plugins: ["property-reorder"],
      rules: {
        "property-reorder/property-reorder": "error",
      },
    },
  },
};
