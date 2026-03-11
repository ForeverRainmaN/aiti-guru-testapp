import js from "@eslint/js"
import prettier from "eslint-config-prettier"
import boundaries from "eslint-plugin-boundaries"
import fpTs from "eslint-plugin-fp-ts"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "fp-ts": fpTs,
      boundaries
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "prefer-const": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: ["pages"], allow: ["app", "pages", "features", "shared"] },
            { from: ["features"], allow: ["features", "shared"] },
            { from: ["shared"], allow: ["shared"] }
          ]
        }
      ]
    },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**/*" },
        { type: "pages", pattern: "src/pages/**/*" },
        { type: "features", pattern: "src/features/**/*" },
        { type: "shared", pattern: "src/shared/**/*" }
      ]
    }
  },
  {
    files: ["src/shared/ui/**/*"],
    rules: {
      "react-refresh/only-export-components": "off"
    }
  },
  prettier
)
