const cache = require("../config/cache");

function serveFromCache(req, res, cacheKey) {
    const entry = cache.get(cacheKey);

    if (!entry) return false;

    // Clone headers so cache isn't modified
    const headers = { ...entry.headers };

    // Remove headers that are no longer valid
    delete headers["content-encoding"];
    delete headers["Content-Encoding"];

    delete headers["content-length"];
    delete headers["Content-Length"];

    // Add cache header
    headers["X-Cache"] = "HIT";

    res.writeHead(entry.statusCode, headers);
    res.end(entry.body);

    return true;
}

module.exports = { serveFromCache };