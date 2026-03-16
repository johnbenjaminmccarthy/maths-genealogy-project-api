import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist/"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  // jsdoc.configs["flat/recommended-typescript-error"],
  {
    files: ["lib/**/*.ts", "test/**/*.ts", "eslint.config.ts", "prettier.config.ts"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: "./tsconfig.eslint.json",
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          checkConstructors: true,
          contexts: [
            "ExportNamedDeclaration:has(TSInterfaceDeclaration)",
            "ExportNamedDeclaration:has(TSTypeAliasDeclaration)",
            "ExportNamedDeclaration:has(VariableDeclaration)",
          ],
        },
      ],
      "jsdoc/require-description": [
        "error",
        {
          exemptedBy: ["deprecated", "see"],
          contexts: ["any"],
        },
      ],
      "jsdoc/check-alignment": "error",
      "jsdoc/check-line-alignment": ["error", "always"],
      "jsdoc/tag-lines": [
        "error",
        "never",
        {
          startLines: 1,
        },
      ],
    },
    extends: [prettier, jsdoc.configs["flat/recommended-typescript-error"]],
  },
);
