import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const disabledProjectRules = {
  "@typescript-eslint/no-unused-vars": "off",
  "no-unused-vars": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-require-imports": "off",
  "react-hooks/exhaustive-deps": "off",
  "react-hooks/immutability": "off",
  "react-hooks/set-state-in-effect": "off",
  "prefer-const": "off",
  "react/no-unescaped-entities": "off",
  "@typescript-eslint/no-empty-object-type": "off",
};

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: disabledProjectRules,
  },
];

export default eslintConfig;
