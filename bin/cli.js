#!/usr/bin/env node
const {startServer} = require("../server");


console.log(process.argv.slice(2));

const args = process.argv.slice(2);

const options = {
    clearCache :false,
};

for(let i = 0;i<args.length;i++){
    if(args[i] === "--port"){
        options.port = Number(args[i+1]);
    }
    else if(args[i] === "--origin"){
        options.origin = args[i+1];
    }
    else if(args[i]=='--clear-cache'){
        options.clearCache = true;
    }
}

if(!options.port){
    console.log("Port is required");
    process.exit(1);
}
console.log("Hello From the CLI");

console.log(options);



startServer({port:options.port, origin: options.origin, clearCache: options.clearCache});