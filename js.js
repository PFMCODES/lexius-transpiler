// browserJS.js
import * as Babel from "@babel/core"; // browser version of Babel

export async function run(code) {
  const logs = [];

  // Safe console for the sandbox
  const sandboxConsole = {
    log: (...args) => {
      logs.push(args.map(String).join(" "));
    }
  };

  // Transpile using Babel (browser version)
  const transpiled = Babel.transform(code, {
    presets: ["env"]
  }).code;

  let result;
  try {
    // Create a "sandboxed" function using Function constructor
    // Expose only console
    const func = new Function("console", `"use strict";\n${transpiled}`);
    result = func(sandboxConsole);
  } catch (err) {
    throw err;
  }

  return {
    result,
    stdout: logs.join("\n")
  };
}
