import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // Mengatur tipe sumber menjadi CommonJS
      globals: {
        jest: "readonly",        // Menambahkan jest sebagai variabel global
        describe: "readonly",    // Menambahkan describe sebagai variabel global
        test: "readonly",        // Menambahkan test sebagai variabel global
        expect: "readonly",      // Menambahkan expect sebagai variabel global
        beforeEach: "readonly",  // Menambahkan beforeEach sebagai variabel global
        afterEach: "readonly",   // Menambahkan afterEach sebagai variabel global
        console: "readonly", // Menambahkan console sebagai variabel global
        setTimeout: "readonly", // Menambahkan setTimeout sebagai variabel global
        process: "readonly", // Menambahkan process sebagai variabel global
        __dirname: "readonly", // Menambahkan __dirname sebagai variabel global
      },
    },
  },
  pluginJs.configs.recommended,
];