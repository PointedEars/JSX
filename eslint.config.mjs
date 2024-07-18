import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginComments from 'eslint-plugin-eslint-comments/recommended';


export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      unicorn: eslintPluginUnicorn,
      comments: eslintPluginComments
    }
  }
];
