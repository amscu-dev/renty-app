import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ignori d.ts generate de Prisma
  {
    ignores: ["src/types/prismaTypes.d.ts", "src/lib/utils.ts"],
  },

  // override global pentru no-unused-vars (cum am adăugat înainte)
  {
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
];

export default eslintConfig;
