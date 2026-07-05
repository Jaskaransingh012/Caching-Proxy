const http = require('http');
const { generateCacheKey } = require('./services/generateCacheKey');
const { serveFromCache } = require('./services/serveFromCache');
const cache = require('./config/cache');


function startServer({ port, origin, clearCache, ttl = 60000 }) {






    const server = http.createServer(async (req, res) => {
        console.log("first")

        try {

            const { url, method, headers } = req;

            const key = generateCacheKey(req);

            if (serveFromCache(req, res, key)) return;

            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            })

            req.on("end", async () => {
                try {


                    const response = await fetch(origin + url, {
                        method,
                        headers,
                        body: ["GET", "HEAD"].includes(method) ? undefined : body,
                    });
                    const result = await response.text();
                    console.log(result);

                    const headersObject = {};

                    for (const [key, value] of response.headers) {
                        headersObject[key] = value;
                    }

                    const entery = {
                        statusCode: response.status,
                        headers: headersObject,
                        body: result,
                        expires: Date.now() + ttl
                    }
                    cache.put(key, entery);

                    for (const [key, value] of response.headers) {
                        if (key.toLowerCase() === "content-encoding") continue;
                        if (
                            key.toLowerCase() === "content-encoding" ||
                            key.toLowerCase() === "content-length"
                        ) continue;
                        res.setHeader(key, value);
                    }
                    res.setHeader('X-Cache', 'MISS');

                    res.statusCode = response.status;

                    res.end(result);
                }

                catch (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end("Internal Server Error");
                }

            })


        } catch (err) {
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
        if (clearCache == true) {
            cache.clear();
            console.log("Initial cache cleared");
        }

    });
}







module.exports = { startServer };