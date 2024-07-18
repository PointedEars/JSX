import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
// import eslintPluginComments from 'eslint-plugin-eslint-comments/recommended';
// import sonarjs from "eslint-plugin-sonarjs";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "script"
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
      eslintPluginUnicorn,
      // eslintPluginComments,
      // sonarjs
    }
  },
  // sonarjs.configs.recommended,
  {
    rules: {
      'no-var': 'warn'
    }
  }
];
