// js.js
import * as babel from "@babel/core";
import * as vm from "vm";

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

  const transpiled = babel.transformSync(code, {
    presets: ["@babel/preset-env"],
  }).code;

  let result;
  try {
    const script = new vm.Script(transpiled);
    result = script.runInContext(context);
  } catch (err) {
    return {
      result: "",
      stdout: "",
      stderr: err
    }
  }

  return {
    result: result,
    stdout: logs.join("\n")
  };
}
