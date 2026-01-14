import { loadPyodide } from "pyodide";

let pyodideReadyPromise;

async function initPyodide() {
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = loadPyodide({
      indexURL: "pyodide/"
    });
  }
  return pyodideReadyPromise;
}

export default async function run(code) {
  const logs = [];
  const pyodide = await initPyodide();

  // Capture print output
  pyodide.setStdout({ batched: (s) => logs.push(s) });
  pyodide.setStderr({ batched: (s) => logs.push(s) });

  let result;
  try {
    result = await pyodide.runPythonAsync(code);
  } catch (err) {
    logs.push(err.toString());
  }

  return {
    result,
    stdout: logs.join("\n")
  };
}