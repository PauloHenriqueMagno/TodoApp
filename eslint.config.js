// eslint.config.js (flat config for Expo + TS + RN + Prettier)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactNative from "eslint-plugin-react-native";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  // Ignore big/generated folders
  {
    ignores: ["node_modules/", "dist/", "build/", ".expo/", "web-build/", "ios/", "android/"],
  },

  // JS base rules
  js.configs.recommended,

  // TypeScript rules (no type-checking for speed)
  ...tseslint.configs.recommended,

  // React/React Native + Hooks + Prettier
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-native": reactNative,
      prettier: prettierPlugin,
    },
    settings: {
      react: { version: "detect" },
      "react-native": { version: "detect" },
    },
    rules: {
      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Native niceties
      "react-native/no-unused-styles": "warn",
      "react-native/split-platform-components": "warn",
      // Turn this on if you dislike inline styles:
      // 'react-native/no-inline-styles': 'warn',

      // Keep ESLint and Prettier from fighting
      "prettier/prettier": "warn",
    },
  },

  // Disable stylistic rules that conflict with Prettier
  prettierConfig,
];
