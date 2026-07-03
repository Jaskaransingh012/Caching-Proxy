# CLI Applications with Node.js - Learnings


## What is a CLI?
- **CLI** = Command Line Interface
- Interact by typing commands in terminal, not clicking buttons
- Examples: `git status`, `npm install`, `node app.js`


## How CLI Works
- OS looks through directories in `PATH` environment variable
- Finds executable matching the command name
- Runs it from anywhere


## Node.js as CLI
```bash
node index.js
```
- Node executes the JavaScript file
- First CLI program: `console.log("Hello World")`


## Process Arguments
- **`process.argv`** - Stores all command-line arguments
- First two values always:
  - Index 0: Node executable path
  - Index 1: Current script path
  - Index 2+: User arguments


```javascript
// Example: node index.js hello world
console.log(process.argv);
// ['/usr/bin/node', '/path/index.js', 'hello', 'world']
```


## Slicing Arguments
```javascript
const args = process.argv.slice(2);
// Removes first two values, keeps only user arguments
```


### Important Notes:
- All arguments arrive as **strings**
- Convert to numbers if needed: `Number("3000")`
- Your program receives: `['--port', '3000', '--origin', 'http://dummyjson.com']`


## The `process` Object
Global Node.js object providing process information:


```javascript
process.argv      // Command-line arguments
process.pid       // Process ID
process.cwd()     // Current working directory
process.env       // Environment variables
process.exit()    // Exit program
```


## Exercise
```javascript
// index.js
console.log('Full argv:', process.argv);
console.log('Sliced args:', process.argv.slice(2));
console.log('Argument count:', process.argv.slice(2).length);
console.log('Current directory:', process.cwd());
```


```bash
node index.js --port 3000 --origin http://dummyjson.com
```


## Key Takeaways
✅ CLI = terminal commands
✅ Node executes JavaScript files  
✅ `process.argv` stores command arguments
✅ Always use `slice(2)` for user arguments
✅ All arguments are strings
✅ `process` provides runtime information



# Step 2 - Parsing Command Line Arguments


## What is Parsing?
- Converting raw array of arguments into structured, usable format
- Example: `['--port', '3000']` → `{ port: 3000 }`


## Raw Array vs Parsed Object
```javascript
// Raw array (hard to use)
['--port', '3000', '--origin', 'http://dummyjson.com']


// Parsed object (easy to use)
{
  port: 3000,
  origin: 'http://dummyjson.com',
  clearCache: false
}
```


## Types of CLI Arguments


### 1. Positional Arguments
```bash
node app.js file.txt
```
```javascript
['file.txt']  // Position matters
```


### 2. Flags (No Value)
```bash
node app.js --verbose
```
```javascript
['--verbose']  // Presence = true
```
```javascript
{ verbose: true }
```


### 3. Options (With Value)
```bash
node app.js --port 3000
```
```javascript
['--port', '3000']  // Pair: flag + value
```
```javascript
{ port: 3000 }
```


### 4. Multiple Options
```bash
node app.js --port 3000 --origin http://localhost:5000
```
```javascript
['--port', '3000', '--origin', 'http://localhost:5000']
```



# Step 3 - Making a Real CLI Command


## The Shebang (`#!/usr/bin/env node`)
- Must be first line of every Node.js CLI file
- Tells OS: "Execute this file using `node` from PATH"
- Without it, OS doesn't know which interpreter to use


## `package.json` Configuration
### The `bin` Field
```json
{
  "name": "caching-proxy",
  "version": "1.0.0",
  "bin": {
    "caching-proxy": "./cli.js"
  }
}
```
- Maps command name to executable file
- When user types `caching-proxy`, it runs `cli.js`


## `npm link` Command
- Creates global symbolic link to your project
- Makes command available system-wide
- Allows running from any directory, not just project folder


## Complete Flow
1. User types `caching-proxy --port 3000`
2. Shell finds global command (via `npm link`)
3. Shebang tells OS to use `node`
4. Node executes `cli.js`
5. `process.argv` receives the arguments
6. Your parser handles them


## Required Steps
1. ✅ Add shebang: `#!/usr/bin/env node` to `cli.js`
2. ✅ Add `bin` field to `package.json`
3. ✅ Run `npm link`
4. ✅ Test: `caching-proxy --port 3000`


## Key Concept
- `node cli.js` = development mode (manual)
- `caching-proxy` = production mode (global command)


## Common Use Cases
- Global tools like `npm`, `git`, `vite`
- Local development scripts in `node_modules/.bin/`
- Custom project-specific commands



# Step 4 - Building an HTTP Server

## What is an HTTP Server?
- Program that listens for incoming HTTP requests
- Receives requests from clients (browser, Postman, curl)
- Processes requests and sends back responses
- Core of every backend application

## HTTP Protocol
- **H**yper**T**ext **T**ransfer **P**rotocol
- Set of rules for client-server communication
- Defines request/response format

## Client vs Server
- **Client**: Initiates communication (browser, mobile app, curl)
- **Server**: Waits for and responds to requests

## Node.js HTTP Module
```javascript
import http from 'http';  // ES Modules
// OR
const http = require('http');  // CommonJS
```

## Creating a Server
```javascript
const server = http.createServer(callback);
```
- Creates server object (like manufacturing a car)
- Doesn't start listening yet

## Listening on a Port
```javascript
server.listen(3000, () => {
    console.log('Server started');
});
```
- Starts the server (like turning on engine)
- Reserves a port on the OS
- Port = specific "apartment" on computer

## Request Handler Callback
```javascript
const server = http.createServer((req, res) => {
    // Called for EVERY request
});
```
- Executes once per incoming request
- Never called by your code - Node calls it automatically

## Request Object (`req`)
Contains all request information:
- `req.method` - HTTP method (GET, POST, etc.)
- `req.url` - Request path (/products, /users)
- `req.headers` - Headers object

## Response Object (`res`)
Used to send response back:
- `res.end(data)` - Send response and end connection
- **Must always call `res.end()`** - browser waits forever otherwise

## Complete Minimal Server
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Hello World');
});

server.listen(3000, () => {
    console.log('Server Running');
});
```

## Server Lifecycle
1. `node cli.js` - Program starts
2. `createServer()` - Server object created (once)
3. `listen()` - Server starts listening
4. **Wait for requests**
5. Request arrives → Callback executes (per request)
6. Send response → Wait for next request

## Integration with CLI
```bash
caching-proxy --port 3000 --origin http://dummyjson.com
```
- CLI parses arguments (once)
- Extracts port
- Creates HTTP server
- `server.listen(port)`
- Server keeps running indefinitely

## Key Concepts
- `createServer()` = **Manufacturing** (once)
- `listen()` = **Starting** (once)
- Callback = **Per request** (many times)
- Port = Specific entry point on machine



## Testing Your Server
- Browser: `http://localhost:3000`
- curl: `curl http://localhost:3000`
- Postman: Create GET request to localhost



# Cache Implementation - Core Concepts with Examples


## What is Caching?
- Temporary storage of responses in memory
- Reduces origin server load and improves speed


## Cache Flow
```
Client Request → Check Cache → [HIT] → Return Cached Response
                              → [MISS] → Forward to Origin → Store → Return
```


## Cache Storage Structure
```javascript
{
  '/products': {
    data: '{"products":[...]}',
    timestamp: 1634567890,
    headers: { 'content-type': 'application/json' }
  }
}
```


## Cache Key Design
```javascript
// Basic
key = req.url  // "/products"


// Better (includes method)
key = req.method + req.url  // "GET/products"


// Advanced (includes headers)
key = req.method + req.url + req.headers.accept
```


## TTL (Time To Live)
- Duration cache remains valid
- Balance between freshness and performance
- Common: 60s, 300s, 3600s


```javascript
const isExpired = (cached) => {
    return Date.now() - cached.timestamp > TTL;
}
```


## Cache Operations


### 1. Lookup
```javascript
getFromCache(key)  // Returns cached data or null
```


### 2. Store
```javascript
setInCache(key, data, headers)
// Saves response with timestamp
```


### 3. Clear
```javascript
clearCache()  // Removes all entries
delete cache[key]  // Remove specific entry
```


## HTTP Cache Headers (Origin Says)
```javascript
// Honor origin's cache instructions
Cache-Control: no-store     // Don't cache
Cache-Control: max-age=300  // Cache for 5 mins
Cache-Control: no-cache     // Revalidate before use
```


## What to Cache
✅ **Cache:**
- GET requests only
- Static assets (CSS, JS, images)
- API responses (with TTL)
- Public content


❌ **Don't Cache:**
- POST/PUT/DELETE requests
- Private/user data
- Error responses (4xx, 5xx)
- `Cache-Control: no-store`


## Cache Hit vs Miss Performance
```
Cache Hit:  ~1-5ms   (in-memory)
Cache Miss: ~50-200ms (network to origin)
```


## Clear Cache Implementation
```bash
# CLI command triggers cache clear
caching-proxy --clear-cache
```
```javascript
// When flag detected
if (args.includes('--clear-cache')) {
    cache = {};  // Clear all cached data
}
```


## Integration Flow Example
```
1. Parse CLI (--port 3000, --origin http://api.com)
2. Start HTTP Server on port 3000
3. For each request:
   a. Build cache key from req.url
   b. Check cache → if hit, return cached
   c. If miss, forward to origin
   d. Store response in cache
   e. Return to client
```








