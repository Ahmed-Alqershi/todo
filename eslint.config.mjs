import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      // Next.js build output
      ".next/**",
      "out/**",

      // Dependencies
      "node_modules/**",

      // Build artifacts
      "dist/**",
      "build/**",

      // Cache
      ".cache/**",
      ".eslintcache",

      // Coverage reports
      "coverage/**",

      // Misc
      "**/*.min.js",
    ],
  },
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            // Dependencies (framework)
            {
              pattern: "{next/*,react,react-dom,react-*}",
              group: "external",
              position: "before",
            },
            // Server Actions
            {
              pattern: "@/lib/actions/**",
              group: "internal",
              position: "before",
            },
            // Helpers
            {
              pattern: "@/lib/utils",
              group: "internal",
              position: "before",
            },
            // Store
            {
              pattern: "@/lib/stores/**",
              group: "internal",
              position: "before",
            },
            // shadcn/ui components
            {
              pattern: "@/components/ui/**",
              group: "internal",
              position: "before",
            },
            // Layouts
            {
              pattern: "@/layouts/**",
              group: "internal",
              position: "before",
            },
            // Components
            {
              pattern: "@/components/**",
              group: "internal",
              position: "before",
            },
            // Icons
            {
              pattern: "{lucide-react,@heroicons/**,@/icons/**}",
              group: "internal",
              position: "before",
            },
            // Types
            {
              pattern: "@/lib/types",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          warnOnUnassignedImports: true,
        },
      ],
      "import/newline-after-import": ["error", { count: 1 }],
    },
  },
];

export default eslintConfig;
