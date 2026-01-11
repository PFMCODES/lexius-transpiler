// ts.js
import ts from "typescript";
import js from "./js.js";

/**
 * Run TypeScript code by first transpiling to JS
 * @param {string} code - TypeScript code to run
 * @returns {any} - The result of executing the code
 */
export async function run(code) {
    try {
        // Transpile TypeScript to JavaScript
        const transpiled = ts.transpileModule(code, {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES2020,
                strict: true,
            },
        }).outputText;

        // Execute the transpiled JS code
        const result = await js.run(transpiled);

        return result;
    } catch (err) {
        throw new Error(`TS execution error: ${err.message}`);
    }
}