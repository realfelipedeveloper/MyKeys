import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

const typeScriptFiles = ["**/*.ts"];

const scopeTypeScriptConfig = (configs) =>
  configs.map((config) => ({
    ...config,
    files: typeScriptFiles,
  }));

export default tseslint.config(
  {
    ignores: ["node_modules/**", ".nx/**", "dist/**", "coverage/**", "tmp/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
  ...scopeTypeScriptConfig(tseslint.configs.strictTypeChecked),
  ...scopeTypeScriptConfig(tseslint.configs.stylisticTypeChecked),
  {
    files: typeScriptFiles,
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-undef": "off",
      "no-console": "off",
    },
  },
);
