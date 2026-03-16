import type { Options } from "prettier";

const config: Options = {
  singleQuote: false,
  semi: true,
  tabWidth: 2,
  printWidth: 100,
  proseWrap: "always",
  trailingComma: "all",
  endOfLine: "lf",
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ["typescript", "typescript-jsx"],
};

export default config;
