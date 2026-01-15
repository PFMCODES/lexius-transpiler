// js.js
import * as babel from "@babel/core";
import vm from "vm";
import { codeFrameColumns } from "@babel/code-frame";

export default async function run(code) {
  const logs = [];

  const sandbox = {
    console: {
      log: (...args) => {
        logs.push(args.map(String).join(" "));
      }
    }
  };

  const context = vm.createContext(sandbox);

  let transpiled;
  try {
    transpiled = babel.transformSync(code, {
      presets: ["@babel/preset-env"],
    }).code;
  } catch (err) {
    // Babel syntax error
    const frame = err.loc
      ? codeFrameColumns(
          code,
          { start: err.loc },
          { highlightCode: true }
        )
      : null;

    return {
      ok: false,
      type: "compile",
      stderr: err.message,
      stdout: logs.join("\n"),
    };
  }

  try {
    const script = new vm.Script(transpiled, { filename: "user-code.js" });
    const result = script.runInContext(context);

    return {
      ok: true,
      result,
      stdout: logs.join("\n"),
    };
  } catch (err) {
    // Runtime error
    const match = err.stack?.match(/user-code\.js:(\d+):(\d+)/);

    const frame = match
      ? codeFrameColumns(
          code,
          {
            start: {
              line: Number(match[1]),
              column: Number(match[2]),
            },
          },
          { highlightCode: true }
        )
      : null;

    return {
      ok: false,
      type: "runtime",
      message: err.message,
      frame,
      stdout: logs.join("\n"),
    };
  }
}