const python = require("./python.mjs");
const js = require("./js.js");
const ts = require("./ts.js");
const http = require("http");

const PORT = 3333;

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

server.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
