#Cache-Proxy
===========

A lightweight CLI caching proxy server for HTTP GET requests.\
It sits between your client and an origin server, caching responses to reduce latency and origin load.

[](https://badge.fury.io/js/cache-proxy)<https://badge.fury.io/js/cache-proxy.svg>\
[](https://nodejs.org/)<https://img.shields.io/badge/node-%253E%253D18.0.0-brightgreen>

* * * * *

Features
--------

-   Simple CLI -- start the proxy with `--port` and `--origin`.

-   In‑memory cache -- stores responses with configurable TTL (default 60s).

-   Cache‑aware headers -- adds `X-Cache: HIT` or `X-Cache: MISS` to every response.

-   Only GET requests -- optimized for read‑heavy workloads (extendable).

-   Clear cache on start -- use `--clear-cache` to start with an empty store.

-   Lightweight -- built with Node.js native `http` and `fetch`.

* * * * *

Installation
------------

### Global (for CLI usage)

bash

npm install -g cache-proxy

### Local (as a project dependency)

bash

npm install cache-proxy

* * * * *

Usage
-----

Start the proxy by providing a port and an origin URL:

bash

cache-proxy --port 3000 --origin https://api.example.com

Now any request to `http://localhost:3000/<path>` will be forwarded to `https://api.example.com/<path>`.

### CLI Options

| Option | Description |
| --- | --- |
| `--port <number>` | (required) Port on which the proxy listens. |
| `--origin <url>` | (required) Base URL of the origin server (e.g., `https://jsonplaceholder.typicode.com`). |
| `--clear-cache` | Optional. Clears the in‑memory cache before starting the server. |
| `--ttl <ms>` | Optional. Cache TTL in milliseconds (default: `60000`). |

### Example

bash

# Start proxy with a 30‑second TTL and clear cache initially
cache-proxy --port 8080 --origin https://api.github.com --ttl 30000 --clear-cache

* * * * *

How It Works
------------

1.  Request arrives -- the proxy receives a `GET` request.

2.  Cache key generation -- a key is built from the request method, URL, and relevant headers.

3.  Cache lookup -- if an entry exists and hasn't expired, it is served immediately with `X-Cache: HIT`.

4.  Origin fetch -- on a cache miss, the proxy forwards the request to the origin.

5.  Store response -- the response body, headers, and status are stored with an expiration timestamp.

6.  Return to client -- the response is sent with `X-Cache: MISS` and the original headers (except `content-encoding` and `content-length` are filtered).

* * * * *

Example Requests
----------------

Start the proxy:

bash

cache-proxy --port 3000 --origin https://jsonplaceholder.typicode.com

Then use `curl`:

bash

# First request -- cache MISS
curl -v http://localhost:3000/posts/1
# Response includes: X-Cache: MISS

# Second request -- cache HIT
curl -v http://localhost:3000/posts/1
# Response includes: X-Cache: HIT

* * * * *

Why Use a Caching Proxy?
------------------------

-   Reduce latency -- serve cached responses almost instantly.

-   Offload origin -- fewer requests reach your backend.

-   Simple integration -- no changes to your existing clients; just point them to the proxy.

* * * * *

Configuration
-------------

All configuration is done via CLI arguments. There is no config file, keeping it minimal and transparent.

-   TTL -- controls how long a response stays fresh. After expiry, the next request will re‑fetch from the origin.

-   Clear cache -- useful in development or when you want to force a cold start.

* * * * *

Node.js Compatibility
---------------------

Requires Node.js 18 or higher (uses native `fetch`). If you need older versions, you can replace `fetch` with `node-fetch` or `axios`.

* * * * *

Contributing
------------

Contributions are welcome!

-   Fork the repository.

-   Create a feature branch.

-   Submit a pull request with a clear description of changes.

Please ensure your code passes linting and includes appropriate tests.