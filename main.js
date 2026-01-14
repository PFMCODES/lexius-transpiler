import python from "./python.js";
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
const server = http.createServer(async (req, res) => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight request
    if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    if (req.method === "POST" && req.url === "/run") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const data = JSON.parse(body);

                if (!data.code || !data.lang) {
                    res.writeHead(400, headers);
                    res.end(JSON.stringify({ error: "Both 'code' and 'lang' are required" }));
                    return;
                }

                let result;

                switch (data.lang.toLowerCase()) {
                    case "python":
                        result = await python.run(data.code);
                        break;
                    case "javascript":
                        result = await js.run(data.code);
                        break;
                    case "typescript":
                        result = await ts.run(data.code);
                        break;
                    default:
                        res.writeHead(400, headers);
                        res.end(JSON.stringify({ error: `Unsupported language: ${data.lang}` }));
                        return;
                }

                res.writeHead(200, headers);
                res.end(JSON.stringify({
                    status: "ok",
                    result: result
                }));

            } catch (err) {
                res.writeHead(500, headers);
                res.end(JSON.stringify({ error: "Execution failed", details: err.message }));
            }
        });

        return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404: NOT FOUND");
});

server.listen(PORT, "0.0.0.0", () => {
  if (process.env.RENDER) {
    console.log("Server running on https://lexius-transpiler.onrender.com");
  } else {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});
