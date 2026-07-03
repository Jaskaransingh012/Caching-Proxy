const cache = require("../config/cache");

function serveFromCache(req, res, cacheKey) {
  const entry = cache.get(cacheKey);
  if (!entry) return false;

  // Clone headers to avoid mutating the stored object
  const headers = { ...entry.headers, 'X-Cache': 'HIT' };
  res.writeHead(entry.statusCode, headers);
  res.end(entry.body);
  return true;
}

module.exports = {serveFromCache};