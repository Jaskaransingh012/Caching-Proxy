

function generateCacheKey(req){

    const method = req.method;
    const url = req.url;

    const key = method + ":" + url;

    return key;

}
module.exports = { generateCacheKey };