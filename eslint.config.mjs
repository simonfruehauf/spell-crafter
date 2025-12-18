// @ts-check
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default defineConfig([
    {
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.stylistic,
            angular.configs.tsRecommended,
            eslintPluginUnicorn.configs.recommended,
        ],
        processor: angular.processInlineTemplates,
        rules: {
            // Angular-specific rules
            "@angular-eslint/directive-selector": [
                "error",
                {
                    type: "attribute",
                    prefix: "app",
                    style: "camelCase",
                },
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                    type: "element",
                    prefix: "app",
                    style: "kebab-case",
                },
            ],

            // Unicorn rule configurations
            // Allow common abbreviations that are widely understood
            "unicorn/prevent-abbreviations": [
                "error",
                {
                    allowList: {
                        // Common abbreviations
                        def: true,
                        Def: true,
                        defs: true,
                        Defs: true,
                        args: true,
                        Args: true,
                        props: true,
                        Props: true,
                        params: true,
                        Params: true,
                        env: true,
                        Env: true,
                        src: true,
                        Src: true,
                        dest: true,
                        Dest: true,
                        ref: true,
                        Ref: true,
                        refs: true,
                        Refs: true,
                        prev: true,
                        Prev: true,
                        // Common loop variables
                        i: true,
                        j: true,
                        k: true,
                        idx: true,
                        // Error/event handlers
                        e: true,
                        err: true,
                        // Message shorthand
                        msg: true,
                        // Element shorthand
                        el: true,
                        // Value shorthand
                        val: true,
                        // Array shorthand
                        arr: true,
                        // Dev console
                        Dev: true,
                        dev: true,
                    },
                    replacements: {
                        // Disable utils -> utilities (allow .utils.ts filenames)
                        utils: false,
                    },
                },
            ],

            // Allow null - Angular signals and many APIs use null
            "unicorn/no-null": "off",

            // Allow nested functions - common in Angular with computed signals
            "unicorn/consistent-function-scoping": "off",

            // Allow forEach - it's fine and often more readable
            "unicorn/no-array-for-each": "off",

            // Allow .sort() - .toSorted() is newer and not always needed
            "unicorn/no-array-sort": "off",

            // Allow top-level promises - Angular bootstrap uses this pattern
            "unicorn/prefer-top-level-await": "off",

            // Disable conflicting rule - unicorn/new-for-builtins requires new Array()
            // but unicorn/no-new-array forbids it. We prefer Array.from for clarity.
            "unicorn/no-new-array": "off",

            // These are good rules to keep enabled with fixes:
            // unicorn/switch-case-braces - require braces in switch cases (auto-fixable)
            // unicorn/no-zero-fractions - remove .0 from numbers (auto-fixable)
            // unicorn/numeric-separators-style - use underscores in large numbers (auto-fixable)
            // unicorn/empty-brace-spaces - no spaces in empty braces (auto-fixable)
            // unicorn/catch-error-name - name catch parameter 'error' (auto-fixable)
            // unicorn/no-negated-condition - prefer positive conditions
            // unicorn/prefer-structured-clone - use structuredClone over JSON parse/stringify
            // unicorn/prefer-number-properties - use Number.parseInt over parseInt
            // unicorn/new-for-builtins - use new Array() instead of Array()
            // unicorn/explicit-length-check - use .length === 0 instead of !.length
            // unicorn/no-useless-spread - remove useless spreads
            // unicorn/no-useless-fallback-in-spread - remove empty object fallbacks
            // unicorn/no-nested-ternary - parenthesize nested ternaries
        },
    },
    {
        files: ["**/*.html"],
        extends: [
            angular.configs.templateRecommended,
            angular.configs.templateAccessibility,
        ],
        rules: {},
    }
]);
