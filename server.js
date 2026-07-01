const http = require('http');


function startServer({ port, origin, clearCache }) {
    const server = http.createServer(async (req, res) => {
        try {

            const { url, method, headers } = req;

            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            })

            req.on("end", async () => {
                const response = await fetch(origin + url, {
                    method,
                    headers,
                    body: ["GET", "HEAD"].includes(method) ? undefined : body,
                });


                for (const [key, value] of response.headers) {
                    res.setHeader(key, value);
                }

                res.statusCode = response.status;
                const result = await response.text();
                res.end(result);
            })


        } catch (error) {
            console.error(err);
            res.statusCode = 500;
            res.end("Internal Server Error");
        }




        req.on("error", err => {
            console.error(err);
            res.statusCode = 400;
            res.end("Bad Request");
        });



    });

    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}







module.exports = { startServer };