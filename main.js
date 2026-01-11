import python from "./python.mjs";
import js from "./js.js";
import ts from "./ts.js";

export const run = (code, lang) => {
    switch (lang) {
        case "javascript":
            js.run(code);
            break;
        case "typescript":
            ts.run(code);
            break;
        case "python":
            python.run(code);
            break;
    }
}